import React from 'react';
import { Music, PlusCircle, Sparkles, Download, Library, Sliders, Volume2 } from 'lucide-react';
import { SongData } from '../types/music';

interface HeaderProps {
  currentSong: SongData;
  onOpenNew: () => void;
  onOpenLibrary: () => void;
  onOpenExport: () => void;
  onOpenAiAssistant: () => void;
  activeView: 'pianoroll' | 'sheet' | 'tabs' | 'chords';
  setActiveView: (view: 'pianoroll' | 'sheet' | 'tabs' | 'chords') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSong,
  onOpenNew,
  onOpenLibrary,
  onOpenExport,
  onOpenAiAssistant,
  activeView,
  setActiveView,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Current Song */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black">
            <Music className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                Songscription<span className="text-indigo-400">.ai</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full">
                Studio
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-slate-200 font-medium truncate max-w-[200px] sm:max-w-xs">
                {currentSong.title}
              </span>
              <span>•</span>
              <span className="text-indigo-300 font-mono font-semibold">{currentSong.key}</span>
              <span>•</span>
              <span className="font-mono">{currentSong.bpm} BPM</span>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-semibold self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveView('pianoroll')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeView === 'pianoroll'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Piano Roll
          </button>
          <button
            onClick={() => setActiveView('sheet')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeView === 'sheet'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            Sheet Music
          </button>
          <button
            onClick={() => setActiveView('tabs')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeView === 'tabs'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Guitar Tabs
          </button>
          <button
            onClick={() => setActiveView('chords')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeView === 'chords'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Chords & Lyrics
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAiAssistant}
            className="px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-700/50 text-indigo-300 hover:bg-indigo-900/50 hover:text-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            title="AI Music Theory & Arranger"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">AI Analysis</span>
          </button>

          <button
            onClick={onOpenLibrary}
            className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Browse sample transcriptions"
          >
            <Library className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Samples</span>
          </button>

          <button
            onClick={onOpenExport}
            className="px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Export MIDI, Sheet Music & XML"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            onClick={onOpenNew}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-500/25 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Transcribe Audio</span>
          </button>
        </div>
      </div>
    </header>
  );
};
