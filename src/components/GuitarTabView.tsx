import React, { useRef } from 'react';
import { SongData, NoteItem } from '../types/music';
import { audioSynth } from '../utils/audioSynthesis';

interface GuitarTabViewProps {
  song: SongData;
  currentTime: number;
  onSeek: (time: number) => void;
  keyShift: number;
}

const STRINGS = [
  { num: 1, name: 'e', standardMidi: 64 }, // High E (E4)
  { num: 2, name: 'B', standardMidi: 59 }, // B3
  { num: 3, name: 'G', standardMidi: 55 }, // G3
  { num: 4, name: 'D', standardMidi: 50 }, // D3
  { num: 5, name: 'A', standardMidi: 45 }, // A2
  { num: 6, name: 'E', standardMidi: 40 }, // Low E (E2)
];

export const GuitarTabView: React.FC<GuitarTabViewProps> = ({
  song,
  currentTime,
  onSeek,
  keyShift,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Derive guitar notes from tracks (either already has string/fret or calculate optimal string/fret)
  const tabNotes: (NoteItem & { stringIdx: number; fret: number })[] = [];

  song.tracks.forEach((track) => {
    track.notes.forEach((note) => {
      const midi = note.midiNumber + keyShift;

      let stringNum = note.stringNumber;
      let fret = note.fretNumber;

      if (!stringNum || fret === undefined) {
        // Calculate best string for this MIDI note
        let bestString = 1;
        let bestFret = 0;
        for (let i = 0; i < STRINGS.length; i++) {
          const s = STRINGS[i];
          const diff = midi - s.standardMidi;
          if (diff >= 0 && diff <= 15) {
            bestString = s.num;
            bestFret = diff;
            break;
          }
        }
        stringNum = bestString;
        fret = bestFret;
      }

      tabNotes.push({
        ...note,
        midiNumber: midi,
        stringIdx: stringNum - 1, // 0-5
        fret: Math.max(0, fret),
      });
    });
  });

  const pixelsPerSecond = 120;
  const totalDuration = Math.max(song.duration, 15);
  const totalWidth = totalDuration * pixelsPerSecond;

  // Active notes on guitar right now
  const activeFretNotes = tabNotes.filter(
    (n) => currentTime >= n.startTime && currentTime <= n.startTime + n.duration
  );

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-100">6-String Guitar Tablature & Fretboard</span>
          <span className="text-slate-500">•</span>
          <span className="font-mono text-slate-400">Standard Tuning (E A D G B e)</span>
        </div>
        <div className="text-slate-400">
          Showing <strong className="text-indigo-400">{tabNotes.length}</strong> tab events
        </div>
      </div>

      {/* Interactive Tab Timeline */}
      <div
        ref={containerRef}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left + (containerRef.current?.scrollLeft || 0);
          const newTime = Math.max(0, Math.min(totalDuration, (clickX - 48) / pixelsPerSecond));
          onSeek(newTime);
        }}
        className="flex-1 overflow-x-auto relative p-6 bg-slate-950 cursor-pointer select-none"
      >
        <div className="relative" style={{ width: `${totalWidth + 60}px`, height: '240px' }}>
          {/* Left string names */}
          <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-around py-4 font-mono font-bold text-slate-400 text-sm border-r border-slate-700 bg-slate-900/80 z-20">
            {STRINGS.map((s) => (
              <div key={s.num} className="text-center">
                {s.name}
              </div>
            ))}
          </div>

          {/* 6 horizontal string lines */}
          <div className="absolute left-12 right-0 top-0 bottom-0 flex flex-col justify-around py-4">
            {STRINGS.map((s) => (
              <div
                key={`string-line-${s.num}`}
                className="w-full border-b border-slate-700/80 relative"
              />
            ))}
          </div>

          {/* Tab measure vertical lines */}
          {Array.from({ length: Math.ceil(totalDuration / 2) }).map((_, mIdx) => {
            const mLeft = 48 + mIdx * 2 * pixelsPerSecond;
            return (
              <div
                key={`tab-m-${mIdx}`}
                style={{ left: `${mLeft}px` }}
                className="absolute top-4 bottom-4 border-l border-slate-800"
              >
                <span className="text-[10px] text-slate-600 font-mono pl-1">
                  |
                </span>
              </div>
            );
          })}

          {/* Render Tab Fret Numbers */}
          {tabNotes.map((note) => {
            const left = 48 + note.startTime * pixelsPerSecond;
            // String 1 is at top (approx 20px), string 6 is at bottom (approx 200px)
            const stringStep = (240 - 48) / 5;
            const top = 16 + note.stringIdx * stringStep;
            const isActive =
              currentTime >= note.startTime &&
              currentTime <= note.startTime + note.duration;

            return (
              <div
                key={`tab-${note.id}`}
                style={{
                  left: `${left}px`,
                  top: `${top}px`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  audioSynth.playNote(note.midiNumber, note.duration, 90, 'guitar');
                  onSeek(note.startTime);
                }}
                className={`absolute w-7 h-6 -ml-3.5 -mt-3 flex items-center justify-center font-mono text-xs font-bold rounded cursor-pointer transition-all ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/40 scale-125 z-30 shadow-lg'
                    : 'bg-slate-900 border border-slate-700 text-slate-200 hover:border-amber-400 hover:text-amber-300 z-10'
                }`}
                title={`String ${note.stringIdx + 1}, Fret ${note.fret} (${note.pitch})`}
              >
                {note.fret}
              </div>
            );
          })}

          {/* Playhead line */}
          <div
            style={{ left: `${48 + currentTime * pixelsPerSecond}px` }}
            className="absolute top-0 bottom-0 w-[2px] bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.9)] z-30 pointer-events-none"
          >
            <div className="w-3 h-3 -ml-[5px] top-0 bg-amber-500 rounded-full border border-white"></div>
          </div>
        </div>
      </div>

      {/* Interactive Guitar Fretboard visualizer */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Interactive Guitar Neck (Frets 0 - 12)
          </span>
          <span className="text-xs text-amber-400 font-mono">
            {activeFretNotes.length > 0
              ? `Active: ${activeFretNotes.map((n) => `String ${n.stringIdx + 1} Fr.${n.fret} (${n.pitch})`).join(', ')}`
              : 'Idle'}
          </span>
        </div>

        {/* Fretboard Graphic */}
        <div className="relative bg-gradient-to-r from-amber-950/80 via-stone-900 to-amber-950/80 border-2 border-stone-800 rounded-xl p-3 shadow-inner overflow-x-auto">
          {/* Fret numbers indicator */}
          <div className="grid grid-cols-13 gap-0 text-center font-mono text-[10px] text-stone-400 mb-1">
            {Array.from({ length: 13 }).map((_, f) => (
              <div key={`fn-${f}`}>{f === 0 ? 'Nut' : f}</div>
            ))}
          </div>

          {/* 6 Guitar strings over frets */}
          <div className="relative space-y-3 py-1">
            {STRINGS.map((str) => (
              <div key={`fb-s-${str.num}`} className="relative flex items-center">
                <span className="w-5 text-[10px] font-mono font-bold text-amber-200">
                  {str.name}
                </span>
                <div className="flex-1 grid grid-cols-13 gap-0 relative">
                  {/* String wire */}
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-stone-300 shadow-sm pointer-events-none" />

                  {/* Fret slots */}
                  {Array.from({ length: 13 }).map((_, f) => {
                    const isPressed = activeFretNotes.some(
                      (n) => n.stringIdx === str.num - 1 && n.fret === f
                    );

                    return (
                      <button
                        key={`cell-${str.num}-${f}`}
                        onClick={() => {
                          const midi = str.standardMidi + f;
                          audioSynth.playNote(midi, 0.7, 85, 'guitar');
                        }}
                        className={`h-5 border-r border-stone-600/60 relative flex items-center justify-center hover:bg-white/10 transition-colors ${
                          f === 0 ? 'border-r-4 border-stone-400' : ''
                        }`}
                        title={`String ${str.name}, Fret ${f}`}
                      >
                        {isPressed && (
                          <div className="w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow-lg shadow-amber-400/80 text-[9px] font-black text-slate-950 flex items-center justify-center animate-pulse z-10">
                            {f}
                          </div>
                        )}
                        {[3, 5, 7, 9].includes(f) && str.num === 3 && (
                          <div className="w-1.5 h-1.5 rounded-full bg-stone-600/50 pointer-events-none absolute -bottom-3"></div>
                        )}
                        {f === 12 && str.num === 3 && (
                          <div className="flex gap-1 absolute -bottom-3 pointer-events-none">
                            <div className="w-1.5 h-1.5 rounded-full bg-stone-600/50"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-stone-600/50"></div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
