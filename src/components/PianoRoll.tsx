import React, { useRef, useEffect, useState } from 'react';
import { SongData, NoteItem } from '../types/music';
import { audioSynth } from '../utils/audioSynthesis';

interface PianoRollProps {
  song: SongData;
  currentTime: number;
  isPlaying: boolean;
  onSeek: (time: number) => void;
  keyShift: number; // Semitone transposition
}

const MIN_MIDI = 36; // C2
const MAX_MIDI = 84; // C6
const TOTAL_NOTES = MAX_MIDI - MIN_MIDI + 1;

export const PianoRoll: React.FC<PianoRollProps> = ({
  song,
  currentTime,
  onSeek,
  keyShift,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNote, setHoveredNote] = useState<NoteItem | null>(null);
  const [activeMidiKeys, setActiveMidiKeys] = useState<Set<number>>(new Set());

  // Collect notes from all active non-muted tracks, applying keyShift
  const activeNotes: (NoteItem & { trackColor: string; trackName: string })[] = [];
  song.tracks.forEach((track) => {
    if (!track.muted) {
      track.notes.forEach((note) => {
        const shiftedMidi = note.midiNumber + keyShift;
        activeNotes.push({
          ...note,
          midiNumber: shiftedMidi,
          pitch: audioSynth.midiToPitch(shiftedMidi),
          trackColor: track.color,
          trackName: track.name,
        });
      });
    }
  });

  // Calculate currently active notes at currentTime for key lighting
  useEffect(() => {
    const currentlyPlaying = new Set<number>();
    activeNotes.forEach((n) => {
      if (currentTime >= n.startTime && currentTime <= n.startTime + n.duration) {
        currentlyPlaying.add(n.midiNumber);
      }
    });
    setActiveMidiKeys(currentlyPlaying);
  }, [currentTime, song, keyShift]);

  // Dimensions
  const pixelsPerSecond = 140;
  const noteRowHeight = 16;
  const totalDuration = Math.max(song.duration, 15);
  const rollWidth = totalDuration * pixelsPerSecond;
  const rollHeight = TOTAL_NOTES * noteRowHeight;

  // Auto-scroll piano roll horizontally to follow the playhead if playing
  useEffect(() => {
    if (containerRef.current) {
      const playheadX = currentTime * pixelsPerSecond;
      const clientWidth = containerRef.current.clientWidth;
      const targetScroll = playheadX - clientWidth / 2.5;
      if (Math.abs(containerRef.current.scrollLeft - targetScroll) > 15) {
        containerRef.current.scrollLeft = Math.max(0, targetScroll);
      }
    }
  }, [currentTime, pixelsPerSecond]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left + (containerRef.current?.scrollLeft || 0);
    const newTime = Math.max(0, Math.min(totalDuration, clickX / pixelsPerSecond));
    onSeek(newTime);
  };

  const handleKeyClick = (midi: number) => {
    audioSynth.playNote(midi, 0.6, 95, 'piano');
  };

  // Helper for black vs white key
  const isBlackKey = (midi: number): boolean => {
    const mod = midi % 12;
    return [1, 3, 6, 8, 10].includes(mod);
  };

  // Beats and measure lines
  const bpm = song.bpm || 120;
  const beatsPerMeasure = song.timeSignature[0] || 4;
  const secondsPerBeat = 60 / bpm;
  const measureDuration = secondsPerBeat * beatsPerMeasure;
  const totalMeasures = Math.ceil(totalDuration / measureDuration);

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Header bar with Info & Legend */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-100 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
            Piano Roll Studio
          </span>
          <span className="text-slate-500">|</span>
          <span className="font-mono text-slate-400">
            {activeNotes.length} notes transcribed
          </span>
          {keyShift !== 0 && (
            <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[11px] font-semibold border border-amber-500/30">
              Shift: {keyShift > 0 ? `+${keyShift}` : keyShift} semitones
            </span>
          )}
        </div>

        {/* Track Legend */}
        <div className="flex items-center gap-3">
          {song.tracks.map((track) => (
            <div key={track.id} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: track.color }}
              />
              <span className="text-[11px] text-slate-400">{track.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Piano Roll Container */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Left Vertical Piano Keys */}
        <div
          className="w-20 sm:w-24 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none z-20 shadow-md"
          style={{ height: `${rollHeight}px` }}
        >
          {Array.from({ length: TOTAL_NOTES }).map((_, index) => {
            const midi = MAX_MIDI - index;
            const black = isBlackKey(midi);
            const pitch = audioSynth.midiToPitch(midi);
            const isPlayingThisKey = activeMidiKeys.has(midi);

            return (
              <button
                key={midi}
                onClick={() => handleKeyClick(midi)}
                style={{ height: `${noteRowHeight}px` }}
                className={`relative w-full border-b text-[10px] font-mono flex items-center justify-end pr-1.5 transition-colors cursor-pointer ${
                  black
                    ? isPlayingThisKey
                      ? 'bg-indigo-600 text-white shadow-inner font-bold'
                      : 'bg-slate-950 text-slate-500 border-slate-900 hover:bg-slate-800'
                    : isPlayingThisKey
                    ? 'bg-indigo-300 text-indigo-950 font-bold'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-700'
                } ${pitch.startsWith('C') && !pitch.includes('#') ? 'border-b-indigo-500/40' : ''}`}
                title={`Click to preview ${pitch}`}
              >
                {pitch.startsWith('C') && !pitch.includes('#') && (
                  <span className="font-bold text-[9px] text-indigo-400 mr-auto pl-1">
                    {pitch}
                  </span>
                )}
                {isPlayingThisKey && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping mr-1"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Scrollable Note Grid */}
        <div
          ref={containerRef}
          onClick={handleCanvasClick}
          className="flex-1 overflow-x-auto overflow-y-hidden relative bg-slate-950 cursor-crosshair select-none"
        >
          <div
            className="relative"
            style={{ width: `${rollWidth}px`, height: `${rollHeight}px` }}
          >
            {/* Horizontal pitch row guidelines */}
            {Array.from({ length: TOTAL_NOTES }).map((_, index) => {
              const midi = MAX_MIDI - index;
              const black = isBlackKey(midi);
              const pitch = audioSynth.midiToPitch(midi);
              const isC = pitch.startsWith('C') && !pitch.includes('#');

              return (
                <div
                  key={`row-${midi}`}
                  style={{
                    top: `${index * noteRowHeight}px`,
                    height: `${noteRowHeight}px`,
                  }}
                  className={`absolute left-0 right-0 border-b ${
                    isC
                      ? 'bg-indigo-950/20 border-indigo-900/40'
                      : black
                      ? 'bg-slate-950/60 border-slate-900/60'
                      : 'bg-slate-900/20 border-slate-900/40'
                  }`}
                />
              );
            })}

            {/* Vertical Measure & Beat Grid Lines */}
            {Array.from({ length: totalMeasures + 1 }).map((_, mIdx) => {
              const mTime = mIdx * measureDuration;
              const leftPos = mTime * pixelsPerSecond;

              return (
                <div
                  key={`measure-${mIdx}`}
                  style={{ left: `${leftPos}px` }}
                  className="absolute top-0 bottom-0 border-l border-slate-700/60 pointer-events-none"
                >
                  <span className="sticky top-0 bg-slate-900/90 text-slate-400 font-mono text-[9px] px-1 py-0.5 rounded border border-slate-800 ml-1">
                    m.{mIdx + 1}
                  </span>
                </div>
              );
            })}

            {/* Chord markers on top timeline */}
            {song.chords.map((chord, idx) => (
              <div
                key={`chord-marker-${idx}`}
                style={{
                  left: `${chord.time * pixelsPerSecond}px`,
                  width: `${chord.duration * pixelsPerSecond}px`,
                }}
                className="absolute top-0 h-5 bg-indigo-950/70 border-b border-r border-indigo-700/50 flex items-center px-1.5 text-[10px] font-bold text-indigo-200 z-10"
              >
                {chord.name}
              </div>
            ))}

            {/* Rendered Notes */}
            {activeNotes.map((note) => {
              if (note.midiNumber < MIN_MIDI || note.midiNumber > MAX_MIDI) return null;
              const rowIndex = MAX_MIDI - note.midiNumber;
              const top = rowIndex * noteRowHeight + 1;
              const left = note.startTime * pixelsPerSecond;
              const width = Math.max(12, note.duration * pixelsPerSecond - 2);
              const isActive =
                currentTime >= note.startTime &&
                currentTime <= note.startTime + note.duration;

              return (
                <div
                  key={note.id}
                  style={{
                    top: `${top}px`,
                    left: `${left}px`,
                    width: `${width}px`,
                    height: `${noteRowHeight - 2}px`,
                    backgroundColor: note.trackColor,
                  }}
                  onMouseEnter={() => setHoveredNote(note)}
                  onMouseLeave={() => setHoveredNote(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    audioSynth.playNote(note.midiNumber, note.duration, note.velocity || 90);
                    onSeek(note.startTime);
                  }}
                  className={`absolute rounded-sm text-[9px] font-semibold text-white px-1 flex items-center justify-between shadow-sm cursor-pointer transition-transform ${
                    isActive
                      ? 'ring-2 ring-white scale-y-110 shadow-lg brightness-125 z-20'
                      : 'hover:brightness-125 hover:z-10'
                  }`}
                  title={`${note.pitch} (${note.duration.toFixed(2)}s) - ${note.trackName}`}
                >
                  <span className="truncate leading-none">{note.pitch}</span>
                </div>
              );
            })}

            {/* Playhead Red/Indigo Bar */}
            <div
              style={{ left: `${currentTime * pixelsPerSecond}px` }}
              className="absolute top-0 bottom-0 w-[2px] bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] z-30 pointer-events-none"
            >
              <div className="w-3.5 h-3.5 -ml-[6px] -top-1 bg-red-500 rounded-full border-2 border-white shadow"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status / Note Hover inspector */}
      <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div>
          {hoveredNote ? (
            <span className="text-slate-200">
              Note: <strong className="text-indigo-400">{hoveredNote.pitch}</strong> (MIDI {hoveredNote.midiNumber}) • Start: {hoveredNote.startTime.toFixed(2)}s • Duration: {hoveredNote.duration.toFixed(2)}s • {hoveredNote.hand === 'left' ? 'Left Hand (LH)' : 'Right Hand (RH)'}
            </span>
          ) : (
            <span>Click any note or piano key to hear it, or click anywhere on the grid to jump the playhead.</span>
          )}
        </div>
        <div className="font-mono text-slate-300">
          Position: {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}.{Math.floor((currentTime % 1) * 10)}
        </div>
      </div>
    </div>
  );
};
