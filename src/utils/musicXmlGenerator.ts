/**
 * MusicXML 4.0 Standard Sheet Music Generator
 * Exports SongData into clean MusicXML XML for MuseScore, Sibelius, Finale, and Dorico
 */

import { SongData } from '../types/music';

export function generateMusicXml(song: SongData): string {
  const bpm = song.bpm || 120;
  const beatsPerMeasure = song.timeSignature[0] || 4;
  const beatType = song.timeSignature[1] || 4;
  const secondsPerBeat = 60 / bpm;
  const measureDuration = secondsPerBeat * beatsPerMeasure;

  // Flatten all notes and sort by startTime
  const allNotes = song.tracks.flatMap((t) => t.notes).sort((a, b) => a.startTime - b.startTime);
  const totalMeasures = Math.max(4, Math.ceil((song.duration || 10) / measureDuration));

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="4.0">
  <work>
    <work-title>${escapeXml(song.title)}</work-title>
  </work>
  <identification>
    <creator type="composer">${escapeXml(song.artist || 'Transcribed by Songscription AI')}</creator>
    <encoding>
      <software>Songscription AI</software>
      <encoding-date>${new Date().toISOString().split('T')[0]}</encoding-date>
    </encoding>
  </identification>
  <part-list>
    <score-part id="P1">
      <part-name>Piano</part-name>
    </score-part>
  </part-list>
  <part id="P1">
`;

  for (let m = 0; m < totalMeasures; m++) {
    const mStart = m * measureDuration;
    const mEnd = (m + 1) * measureDuration;
    const mNotes = allNotes.filter((n) => n.startTime >= mStart && n.startTime < mEnd);

    xml += `    <measure number="${m + 1}">\n`;
    if (m === 0) {
      xml += `      <attributes>
        <divisions>4</divisions>
        <key>
          <fifths>0</fifths>
        </key>
        <time>
          <beats>${beatsPerMeasure}</beats>
          <beat-type>${beatType}</beat-type>
        </time>
        <clef>
          <sign>G</sign>
          <line>2</line>
        </clef>
      </attributes>
      <direction placement="above">
        <sound tempo="${bpm}"/>
      </direction>\n`;
    }

    if (mNotes.length === 0) {
      xml += `      <note>
        <rest/>
        <duration>${beatsPerMeasure * 4}</duration>
        <voice>1</voice>
        <type>whole</type>
      </note>\n`;
    } else {
      mNotes.forEach((note) => {
        const step = note.pitch.charAt(0);
        const alter = note.pitch.includes('#') ? 1 : note.pitch.includes('b') ? -1 : 0;
        const octave = note.pitch.replace(/[^0-9]/g, '') || '4';
        const durDivs = Math.max(1, Math.round((note.duration / secondsPerBeat) * 4));

        xml += `      <note>
        <pitch>
          <step>${step}</step>
          ${alter !== 0 ? `<alter>${alter}</alter>` : ''}
          <octave>${octave}</octave>
        </pitch>
        <duration>${durDivs}</duration>
        <voice>1</voice>
        <type>${getNoteType(durDivs)}</type>
      </note>\n`;
      });
    }

    xml += `    </measure>\n`;
  }

  xml += `  </part>
</score-partwise>`;

  return xml;
}

function getNoteType(durDivs: number): string {
  if (durDivs >= 16) return 'whole';
  if (durDivs >= 8) return 'half';
  if (durDivs >= 4) return 'quarter';
  if (durDivs >= 2) return 'eighth';
  return '16th';
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function downloadMusicXml(song: SongData, filename?: string) {
  const xml = generateMusicXml(song);
  const blob = new Blob([xml], { type: 'application/vnd.recordare.musicxml+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `${song.title.replace(/\s+/g, '_')}.musicxml`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
