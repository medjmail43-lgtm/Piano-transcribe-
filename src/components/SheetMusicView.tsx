import React, { useRef } from 'react';
import { SongData, NoteItem } from '../types/music';
import { Printer, Music, Eye } from 'lucide-react';
import { audioSynth } from '../utils/audioSynthesis';

interface SheetMusicViewProps {
  song: SongData;
  currentTime: number;
  onSeek: (time: number) => void;
  keyShift: number;
}

export const SheetMusicView: React.FC<SheetMusicViewProps> = ({
  song,
  currentTime,
  onSeek,
  keyShift,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const bpm = song.bpm || 120;
  const beatsPerMeasure = song.timeSignature[0] || 4;
  const secondsPerBeat = 60 / bpm;
  const measureDuration = secondsPerBeat * beatsPerMeasure;
  const totalMeasures = Math.max(4, Math.ceil(song.duration / measureDuration));

  // Current active measure
  const currentMeasure = Math.floor(currentTime / measureDuration) + 1;

  // Flatten and shift notes
  const notesWithShift: NoteItem[] = song.tracks.flatMap((t) =>
    t.notes.map((n) => ({
      ...n,
      midiNumber: n.midiNumber + keyShift,
      pitch: audioSynth.midiToPitch(n.midiNumber + keyShift),
    }))
  );

  const handlePrint = () => {
    window.print();
  };

  // Convert MIDI note into stave vertical offset (relative to staff line)
  // Treble clef bottom line is E4 (MIDI 64)
  // Bass clef top line is A3 (MIDI 57)
  const getTrebleOffset = (midi: number): number => {
    // E4 is at Y = 70px in a 100px stave box
    const diff = midi - 64; // semitones roughly
    return 70 - diff * 3.5;
  };

  const getBassOffset = (midi: number): number => {
    // A3 is at Y = 25px in bass stave
    const diff = midi - 57;
    return 30 - diff * 3.5;
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Sheet Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-100 flex items-center gap-1.5">
            <Music className="w-4 h-4 text-indigo-400" />
            Grand Staff Sheet Music
          </span>
          <span className="text-slate-500">•</span>
          <span className="font-mono text-slate-400">
            Measure {currentMeasure} of {totalMeasures}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-semibold">
            {song.timeSignature[0]}/{song.timeSignature[1]} Time • ♩ = {bpm}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Sheet Music Score Paper (Classic Ivory / White Page Theme for readable notation) */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-8 bg-white text-slate-900 selection:bg-indigo-100 print:p-0 print:bg-white"
      >
        <div className="max-w-4xl mx-auto">
          {/* Piece Title & Header */}
          <div className="text-center mb-8 border-b border-slate-200 pb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-serif">
              {song.title}
            </h1>
            <p className="text-sm font-medium text-slate-600 mt-1">
              Composer / Artist: {song.artist}
            </p>
            <div className="flex items-center justify-center gap-4 mt-2 text-xs font-mono text-slate-500">
              <span>Key: <strong>{song.key}</strong></span>
              <span>•</span>
              <span>Tempo: <strong>♩ = {song.bpm}</strong></span>
              <span>•</span>
              <span>Difficulty: <strong className="capitalize">{song.difficulty}</strong></span>
            </div>
          </div>

          {/* Stave Measure System */}
          <div className="space-y-12">
            {Array.from({ length: Math.ceil(totalMeasures / 2) }).map((_, systemIdx) => {
              const m1Idx = systemIdx * 2;
              const m2Idx = m1Idx + 1;
              const measuresInSystem = [m1Idx, m2Idx].filter((m) => m < totalMeasures);

              return (
                <div
                  key={`system-${systemIdx}`}
                  className="relative border-l-2 border-slate-900 pl-4 py-2"
                >
                  {/* System bracket / brace */}
                  <div className="absolute -left-1 top-0 bottom-0 w-2 flex flex-col justify-between">
                    <span className="text-2xl leading-none text-slate-800">⎡</span>
                    <span className="text-2xl leading-none text-slate-800">⎣</span>
                  </div>

                  {/* Measures Grid (2 measures per row for clear readability) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {measuresInSystem.map((mIdx) => {
                      const mStart = mIdx * measureDuration;
                      const mEnd = (mIdx + 1) * measureDuration;
                      const isCurrentM = currentTime >= mStart && currentTime < mEnd;
                      const measureChords = song.chords.filter(
                        (c) => c.time >= mStart && c.time < mEnd
                      );
                      const mNotes = notesWithShift.filter(
                        (n) => n.startTime >= mStart && n.startTime < mEnd
                      );

                      const trebleNotes = mNotes.filter((n) => n.midiNumber >= 60);
                      const bassNotes = mNotes.filter((n) => n.midiNumber < 60);

                      return (
                        <div
                          key={`measure-box-${mIdx}`}
                          onClick={() => onSeek(mStart)}
                          className={`relative border rounded-lg p-3 cursor-pointer transition-all ${
                            isCurrentM
                              ? 'border-indigo-500 bg-indigo-50/70 ring-2 ring-indigo-400 shadow-md'
                              : 'border-slate-300 bg-slate-50/50 hover:bg-slate-100/60'
                          }`}
                        >
                          {/* Measure number & Chords */}
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="font-mono text-slate-500 font-bold">
                              Bar {mIdx + 1}
                            </span>
                            <div className="flex items-center gap-1">
                              {measureChords.map((ch, cI) => (
                                <span
                                  key={cI}
                                  className="font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded text-[11px]"
                                >
                                  {ch.name}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Treble Stave (Right Hand) */}
                          <div className="relative mb-6">
                            <div className="flex items-center absolute -left-3 top-2 font-serif text-3xl text-slate-800 select-none">
                              𝄞
                            </div>
                            {/* 5 Staff Lines */}
                            <div className="space-y-2 py-2">
                              {[0, 1, 2, 3, 4].map((line) => (
                                <div key={`tl-${line}`} className="border-b border-slate-800 w-full" />
                              ))}
                            </div>

                            {/* Treble Notes */}
                            <div className="absolute inset-0 pl-8 pr-2 flex items-center">
                              {trebleNotes.map((note) => {
                                const relTime = (note.startTime - mStart) / measureDuration;
                                const leftPercent = Math.max(5, Math.min(92, relTime * 100));
                                const topOffset = Math.max(0, Math.min(36, getTrebleOffset(note.midiNumber)));
                                const isPlaying =
                                  currentTime >= note.startTime &&
                                  currentTime <= note.startTime + note.duration;

                                return (
                                  <div
                                    key={note.id}
                                    style={{
                                      left: `${leftPercent}%`,
                                      top: `${topOffset}px`,
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      audioSynth.playNote(note.midiNumber, note.duration);
                                      onSeek(note.startTime);
                                    }}
                                    className={`absolute flex flex-col items-center cursor-pointer transition-transform ${
                                      isPlaying
                                        ? 'scale-125 text-indigo-600 font-bold'
                                        : 'text-slate-900 hover:text-indigo-600'
                                    }`}
                                    title={`${note.pitch} (${note.duration.toFixed(2)}s)`}
                                  >
                                    {/* Note head (oval) and stem */}
                                    <div className="relative">
                                      <div
                                        className={`w-3.5 h-2.5 rounded-full rotate-[-20deg] ${
                                          isPlaying ? 'bg-indigo-600 ring-2 ring-indigo-300' : 'bg-slate-900'
                                        }`}
                                      />
                                      {/* Vertical Note Stem */}
                                      <div
                                        className={`absolute right-0 bottom-1 w-[1.5px] h-6 ${
                                          isPlaying ? 'bg-indigo-600' : 'bg-slate-900'
                                        }`}
                                      />
                                    </div>
                                    <span className="text-[9px] font-mono mt-2 font-semibold">
                                      {note.pitch}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Bass Stave (Left Hand) */}
                          <div className="relative pt-2 border-t border-dashed border-slate-300">
                            <div className="flex items-center absolute -left-3 top-2 font-serif text-2xl text-slate-800 select-none">
                              𝄢
                            </div>
                            {/* 5 Staff Lines */}
                            <div className="space-y-2 py-2">
                              {[0, 1, 2, 3, 4].map((line) => (
                                <div key={`bl-${line}`} className="border-b border-slate-800 w-full" />
                              ))}
                            </div>

                            {/* Bass Notes */}
                            <div className="absolute inset-0 pl-8 pr-2 flex items-center">
                              {bassNotes.map((note) => {
                                const relTime = (note.startTime - mStart) / measureDuration;
                                const leftPercent = Math.max(5, Math.min(92, relTime * 100));
                                const topOffset = Math.max(0, Math.min(36, getBassOffset(note.midiNumber)));
                                const isPlaying =
                                  currentTime >= note.startTime &&
                                  currentTime <= note.startTime + note.duration;

                                return (
                                  <div
                                    key={note.id}
                                    style={{
                                      left: `${leftPercent}%`,
                                      top: `${topOffset}px`,
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      audioSynth.playNote(note.midiNumber, note.duration);
                                      onSeek(note.startTime);
                                    }}
                                    className={`absolute flex flex-col items-center cursor-pointer transition-transform ${
                                      isPlaying
                                        ? 'scale-125 text-indigo-600 font-bold'
                                        : 'text-slate-900 hover:text-indigo-600'
                                    }`}
                                    title={`${note.pitch} (${note.duration.toFixed(2)}s)`}
                                  >
                                    <div className="relative">
                                      <div
                                        className={`w-3.5 h-2.5 rounded-full rotate-[-20deg] ${
                                          isPlaying ? 'bg-indigo-600 ring-2 ring-indigo-300' : 'bg-slate-900'
                                        }`}
                                      />
                                      <div
                                        className={`absolute right-0 top-1 w-[1.5px] h-6 ${
                                          isPlaying ? 'bg-indigo-600' : 'bg-slate-900'
                                        }`}
                                      />
                                    </div>
                                    <span className="text-[9px] font-mono mt-1 font-semibold">
                                      {note.pitch}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Measure playhead overlay */}
                          {isCurrentM && (
                            <div
                              style={{
                                left: `${((currentTime - mStart) / measureDuration) * 100}%`,
                              }}
                              className="absolute top-0 bottom-0 w-[2px] bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] pointer-events-none"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* End of Score Fine line */}
          <div className="flex items-center justify-center gap-2 my-12 text-slate-400 font-serif">
            <span className="w-12 h-px bg-slate-300"></span>
            <span>Fine (End of Score)</span>
            <span className="w-12 h-px bg-slate-300"></span>
          </div>
        </div>
      </div>
    </div>
  );
};
