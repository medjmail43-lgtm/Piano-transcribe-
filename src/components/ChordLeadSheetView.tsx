import React from 'react';
import { SongData, ChordItem } from '../types/music';
import { audioSynth } from '../utils/audioSynthesis';

interface ChordLeadSheetViewProps {
  song: SongData;
  currentTime: number;
  onSeek: (time: number) => void;
  keyShift: number;
}

export const ChordLeadSheetView: React.FC<ChordLeadSheetViewProps> = ({
  song,
  currentTime,
  onSeek,
  keyShift,
}) => {
  // Find current active chord
  const activeChord = song.chords.find(
    (c) => currentTime >= c.time && currentTime < c.time + c.duration
  );

  // Find active lyric if any
  const currentLyric = song.lyrics?.find(
    (l, idx) => {
      const nextL = song.lyrics?.[idx + 1];
      const endTime = nextL ? nextL.time : song.duration;
      return currentTime >= l.time && currentTime < endTime;
    }
  );

  const handleChordClick = (chord: ChordItem) => {
    onSeek(chord.time);
    // Preview chord notes
    chord.notes.forEach((pitch, i) => {
      const midi = audioSynth.pitchToMidi(pitch) + keyShift;
      setTimeout(() => {
        audioSynth.playNote(midi, 1.2, 85, 'piano');
      }, i * 40);
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-100">Chord Chart & Lead Sheet</span>
          <span className="text-slate-500">•</span>
          <span className="font-mono text-indigo-300">Key: {song.key}</span>
        </div>
        <div className="text-slate-400">
          Total Chords: <strong className="text-indigo-400">{song.chords.length}</strong>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Active Chord Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/60 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex flex-col items-center justify-center shadow-lg">
              <span className="text-3xl font-black text-indigo-300">
                {activeChord ? activeChord.name : '—'}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Active
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {activeChord ? `Current Chord: ${activeChord.name}` : 'Waiting for chord playback...'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {activeChord
                  ? `Voicing Notes: ${activeChord.notes.join(' - ')} • Quality: ${activeChord.quality}`
                  : 'Click on any chord below to jump playback to that section'}
              </p>
            </div>
          </div>

          {/* Active Lyrics Karaoke Display */}
          {song.lyrics && song.lyrics.length > 0 && (
            <div className="w-full md:w-auto md:min-w-[320px] p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1">
                Synchronized Lyrics
              </div>
              <div className="text-base font-bold text-amber-300 italic">
                "{currentLyric ? currentLyric.text : '...'}"
              </div>
            </div>
          )}
        </div>

        {/* Chord Progression Grid */}
        <div>
          <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
            Harmonic Progression Timeline
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {song.chords.map((chord, idx) => {
              const isActive =
                currentTime >= chord.time && currentTime < chord.time + chord.duration;

              return (
                <div
                  key={`chord-${idx}`}
                  onClick={() => handleChordClick(chord)}
                  className={`p-4 rounded-xl border text-center cursor-pointer transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white border-white ring-4 ring-indigo-500/40 shadow-xl scale-105'
                      : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-indigo-500/50 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="text-2xl font-extrabold mb-1">{chord.name}</div>
                  <div
                    className={`text-[11px] font-mono ${
                      isActive ? 'text-indigo-100' : 'text-slate-400'
                    }`}
                  >
                    {chord.notes.join(' ')}
                  </div>
                  <div
                    className={`text-[10px] mt-2 font-mono ${
                      isActive ? 'text-indigo-200' : 'text-slate-500'
                    }`}
                  >
                    {chord.time.toFixed(1)}s
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lyrics Transcript List */}
        {song.lyrics && song.lyrics.length > 0 && (
          <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800">
            <h3 className="text-sm font-bold text-slate-200 mb-3">Song Lyrics Transcript</h3>
            <div className="space-y-2">
              {song.lyrics.map((lyric, lIdx) => {
                const nextL = song.lyrics?.[lIdx + 1];
                const endTime = nextL ? nextL.time : song.duration;
                const isCurrent = currentTime >= lyric.time && currentTime < endTime;

                return (
                  <div
                    key={`lyric-${lIdx}`}
                    onClick={() => onSeek(lyric.time)}
                    className={`p-2.5 rounded-lg flex items-center justify-between text-sm cursor-pointer transition-colors ${
                      isCurrent
                        ? 'bg-indigo-600/30 border border-indigo-500 text-white font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <span>{lyric.text}</span>
                    <span className="font-mono text-xs text-slate-500">
                      {Math.floor(lyric.time / 60)}:
                      {String(Math.floor(lyric.time % 60)).padStart(2, '0')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
