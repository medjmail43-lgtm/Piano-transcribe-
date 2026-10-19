import React from 'react';
import { X, Library, Music, Play, Sparkles, Check } from 'lucide-react';
import { SongData } from '../types/music';
import { SAMPLE_SONGS } from '../data/sampleSongs';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSongId: string;
  onSelectSong: (song: SongData) => void;
}

export const LibraryModal: React.FC<LibraryModalProps> = ({
  isOpen,
  onClose,
  currentSongId,
  onSelectSong,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Library className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Transcriptions Library</h3>
              <p className="text-xs text-slate-400">
                Explore pre-analyzed classical, jazz, and pop repertoire
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Songs List */}
        <div className="p-6 space-y-3 max-h-[460px] overflow-y-auto">
          {SAMPLE_SONGS.map((song) => {
            const isSelected = song.id === currentSongId;

            return (
              <div
                key={song.id}
                onClick={() => {
                  onSelectSong(song);
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500 ring-2 ring-indigo-500/30'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-800 text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-colors'
                    }`}
                  >
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white group-hover:text-indigo-300">
                        {song.title}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-bold bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/40">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">{song.artist}</div>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono text-slate-500">
                      <span className="text-indigo-400 font-semibold">{song.genre}</span>
                      <span>•</span>
                      <span>Key: {song.key}</span>
                      <span>•</span>
                      <span>{song.bpm} BPM</span>
                      <span>•</span>
                      <span className="capitalize text-emerald-400 font-semibold">
                        {song.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-xl bg-slate-800 group-hover:bg-indigo-600 text-slate-200 group-hover:text-white text-xs font-bold flex items-center gap-1 transition-all">
                    <Play className="w-3.5 h-3.5" />
                    Load
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-6 py-4 bg-slate-950/40 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
