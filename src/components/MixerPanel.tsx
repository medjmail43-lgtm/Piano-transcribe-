import React from 'react';
import { SongTrack, InstrumentType } from '../types/music';
import { Volume2, VolumeX, Sliders } from 'lucide-react';

interface MixerPanelProps {
  tracks: SongTrack[];
  onUpdateTrack: (trackId: string, updates: Partial<SongTrack>) => void;
}

export const MixerPanel: React.FC<MixerPanelProps> = ({
  tracks,
  onUpdateTrack,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
        <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          Multi-Track & Stem Mixer
        </span>
        <span className="text-[11px] text-slate-500">
          Isolate or mute hands & instruments
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tracks.map((track) => {
          return (
            <div
              key={track.id}
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: track.color }}
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-200 truncate">
                    {track.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {track.notes.length} notes • {track.instrument}
                  </div>
                </div>
              </div>

              {/* Fader & Mute/Solo */}
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={track.volume}
                  onChange={(e) =>
                    onUpdateTrack(track.id, { volume: parseFloat(e.target.value) })
                  }
                  className="w-20 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  title={`Volume: ${Math.round(track.volume * 100)}%`}
                />

                <button
                  onClick={() => onUpdateTrack(track.id, { muted: !track.muted })}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                    track.muted
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {track.muted ? 'MUTED' : 'MUTE'}
                </button>

                <button
                  onClick={() => onUpdateTrack(track.id, { solo: !track.solo })}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                    track.solo
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  SOLO
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
