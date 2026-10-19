/**
 * Standard MIDI File (SMF Type 1) Generator
 * Encodes SongData tracks into a valid .mid binary file
 */

import { SongData } from '../types/music';

// Helper to write big-endian numbers to Uint8Array
function writeUint16(arr: number[], value: number) {
  arr.push((value >> 8) & 0xff);
  arr.push(value & 0xff);
}

function writeUint32(arr: number[], value: number) {
  arr.push((value >> 24) & 0xff);
  arr.push((value >> 16) & 0xff);
  arr.push((value >> 8) & 0xff);
  arr.push(value & 0xff);
}

// Write Variable-Length Quantity (VLQ) for MIDI delta times
function writeVarLength(arr: number[], value: number) {
  const buffer = [];
  buffer.push(value & 0x7f);
  let v = value >> 7;
  while (v > 0) {
    buffer.push((v & 0x7f) | 0x80);
    v = v >> 7;
  }
  while (buffer.length > 0) {
    arr.push(buffer.pop()!);
  }
}

export function generateMidiFile(song: SongData): Blob {
  const TICKS_PER_BEAT = 480;
  const bpm = song.bpm || 120;
  const microsecondsPerBeat = Math.round(60000000 / bpm);

  // We will build a Type 1 SMF (tempo track + instrument tracks)
  const tracksBytes: number[][] = [];

  // 1. Tempo & Metadata Track (Track 0)
  const tempoTrack: number[] = [];

  // Track Name meta event
  writeVarLength(tempoTrack, 0); // delta
  tempoTrack.push(0xff, 0x03); // Meta Track Name
  const titleBytes = new TextEncoder().encode(song.title || 'Songscription AI');
  writeVarLength(tempoTrack, titleBytes.length);
  tempoTrack.push(...titleBytes);

  // Set Tempo meta event (FF 51 03 tt tt tt)
  writeVarLength(tempoTrack, 0);
  tempoTrack.push(0xff, 0x51, 0x03);
  tempoTrack.push(
    (microsecondsPerBeat >> 16) & 0xff,
    (microsecondsPerBeat >> 8) & 0xff,
    microsecondsPerBeat & 0xff
  );

  // Time signature meta event (FF 58 04 nn dd cc bb)
  const num = song.timeSignature[0] || 4;
  const denom = song.timeSignature[1] || 4;
  const denomPower = Math.round(Math.log2(denom));
  writeVarLength(tempoTrack, 0);
  tempoTrack.push(0xff, 0x58, 0x04, num, denomPower, 24, 8);

  // End of Track meta event (FF 2F 00)
  writeVarLength(tempoTrack, 0);
  tempoTrack.push(0xff, 0x2f, 0x00);
  tracksBytes.push(tempoTrack);

  // 2. Note Tracks
  song.tracks.forEach((track, trackIndex) => {
    const trackData: number[] = [];
    const channel = Math.min(15, trackIndex === 9 ? 10 : trackIndex); // skip channel 10 if not drums

    // Track Name
    writeVarLength(trackData, 0);
    trackData.push(0xff, 0x03);
    const trackNameBytes = new TextEncoder().encode(track.name);
    writeVarLength(trackData, trackNameBytes.length);
    trackData.push(...trackNameBytes);

    // Instrument program change (Acoustic Grand Piano = 0, Acoustic Guitar = 24, etc.)
    writeVarLength(trackData, 0);
    let program = 0;
    if (track.instrument === 'guitar') program = 24;
    else if (track.instrument === 'bass') program = 32;
    else if (track.instrument === 'vocals') program = 54;
    trackData.push(0xc0 | channel, program);

    // Build timeline of Note On / Note Off events
    interface MidiEvent {
      tick: number;
      type: 'on' | 'off';
      note: number;
      velocity: number;
    }

    const events: MidiEvent[] = [];
    const secondsPerBeat = 60 / bpm;

    track.notes.forEach((note) => {
      const startTick = Math.round((note.startTime / secondsPerBeat) * TICKS_PER_BEAT);
      const endTick = Math.round(((note.startTime + note.duration) / secondsPerBeat) * TICKS_PER_BEAT);

      events.push({
        tick: startTick,
        type: 'on',
        note: Math.max(0, Math.min(127, note.midiNumber)),
        velocity: note.velocity || 80,
      });

      events.push({
        tick: Math.max(startTick + 1, endTick),
        type: 'off',
        note: Math.max(0, Math.min(127, note.midiNumber)),
        velocity: 0,
      });
    });

    // Sort events chronologically (note offs before note ons at same tick)
    events.sort((a, b) => {
      if (a.tick !== b.tick) return a.tick - b.tick;
      if (a.type === 'off' && b.type === 'on') return -1;
      if (a.type === 'on' && b.type === 'off') return 1;
      return 0;
    });

    let currentTick = 0;
    events.forEach((ev) => {
      const delta = Math.max(0, ev.tick - currentTick);
      writeVarLength(trackData, delta);
      currentTick = ev.tick;

      if (ev.type === 'on') {
        trackData.push(0x90 | channel, ev.note, ev.velocity);
      } else {
        trackData.push(0x80 | channel, ev.note, 0);
      }
    });

    // End of Track
    writeVarLength(trackData, 0);
    trackData.push(0xff, 0x2f, 0x00);
    tracksBytes.push(trackData);
  });

  // Assemble full binary file
  const fullMidiBytes: number[] = [];

  // MThd Header Chunk
  // 'MThd' (0x4D, 0x54, 0x68, 0x64)
  fullMidiBytes.push(0x4d, 0x54, 0x68, 0x64);
  writeUint32(fullMidiBytes, 6); // header size = 6
  writeUint16(fullMidiBytes, 1); // format = 1 (multi-track)
  writeUint16(fullMidiBytes, tracksBytes.length); // num tracks
  writeUint16(fullMidiBytes, TICKS_PER_BEAT); // ticks per quarter note

  // MTrk Track Chunks
  tracksBytes.forEach((trackData) => {
    fullMidiBytes.push(0x4d, 0x54, 0x72, 0x6b); // 'MTrk'
    writeUint32(fullMidiBytes, trackData.length);
    fullMidiBytes.push(...trackData);
  });

  const uint8 = new Uint8Array(fullMidiBytes);
  return new Blob([uint8], { type: 'audio/midi' });
}

export function downloadMidiFile(song: SongData, filename?: string) {
  const blob = generateMidiFile(song);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `${song.title.replace(/\s+/g, '_')}_Songscription.mid`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
