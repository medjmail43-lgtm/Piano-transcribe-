import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FastForward,
  Repeat,
  Gauge,
  SlidersHorizontal,
} from 'lucide-react';
import { DifficultyLevel } from '../types/music';

interface AudioControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onRestart: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  keyShift: number;
  onChangeKeyShift: (shift: number) => void;
  metronomeActive: boolean;
  onToggleMetronome: () => void;
  loopActive: boolean;
  onToggleLoop: () => void;
  difficulty: DifficultyLevel;
  onChangeDifficulty: (lvl: DifficultyLevel) => void;
  volume: number;
  onChangeVolume: (v: number) => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onRestart,
  currentTime,
  duration,
  onSeek,
  playbackSpeed,
  onChangeSpeed,
  keyShift,
  onChangeKeyShift,
  metronomeActive,
  onToggleMetronome,
  loopActive,
  onToggleLoop,
  difficulty,
  onChangeDifficulty,
  volume,
  onChangeVolume,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5];

  return (
    <div className="bg-slate-900/95 border-t border-slate-800 p-3 sm:px-6 sm:py-4 shadow-2xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        {/* Progress Timeline Scrubber */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <div className="relative flex-1 group">
            <input
              type="range"
              min={0}
              max={duration || 10}
              step={0.05}
              value={currentTime}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:h-2.5 transition-all"
            />
          </div>
          <span className="font-mono text-xs text-slate-400 w-10">
            {formatTime(duration)}
          </span>
        </div>

        {/* Main Control Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Primary Transport (Play, Rewind, Loop, Metronome) */}
          <div className="flex items-center gap-2">
            <button
              onClick={onRestart}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Restart from beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onTogglePlay}
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            {/* Loop Toggle */}
            <button
              onClick={onToggleLoop}
              className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                loopActive
                  ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 shadow-sm'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="A-B Section Loop"
            >
              <Repeat className="w-4 h-4" />
              <span className="hidden sm:inline">Loop</span>
            </button>

            {/* Metronome Click */}
            <button
              onClick={onToggleMetronome}
              className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                metronomeActive
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Metronome click"
            >
              <Gauge className="w-4 h-4" />
              <span className="hidden sm:inline">Click</span>
            </button>
          </div>

          {/* Speed Selector (0.5x, 0.75x, 1x, etc.) */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="px-2 text-slate-500 font-semibold text-[11px]">Speed:</span>
            {speedOptions.map((sp) => (
              <button
                key={sp}
                onClick={() => onChangeSpeed(sp)}
                className={`px-2 py-1 rounded-lg font-mono transition-all ${
                  playbackSpeed === sp
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {sp}x
              </button>
            ))}
          </div>

          {/* Transposition (Key Shifter) */}
          <div className="flex items-center gap-2 bg-slate-950/80 px-2 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Transpose:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onChangeKeyShift(keyShift - 1)}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center cursor-pointer"
                title="Transpose down 1 semitone"
              >
                -
              </button>
              <span className="w-10 text-center font-mono font-bold text-indigo-300">
                {keyShift > 0 ? `+${keyShift}` : keyShift}
              </span>
              <button
                onClick={() => onChangeKeyShift(keyShift + 1)}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center cursor-pointer"
                title="Transpose up 1 semitone"
              >
                +
              </button>
              {keyShift !== 0 && (
                <button
                  onClick={() => onChangeKeyShift(0)}
                  className="text-[10px] text-slate-500 hover:text-slate-300 underline ml-1"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Difficulty Leveler (Songscription Sheet Music Leveler feature) */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="px-2 text-slate-500 font-semibold text-[11px]">Level:</span>
            {(['beginner', 'intermediate', 'advanced'] as DifficultyLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => onChangeDifficulty(lvl)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                  difficulty === lvl
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Master Volume */}
          <div className="flex items-center gap-2 text-slate-400">
            <button
              onClick={() => onChangeVolume(volume > 0 ? 0 : 0.8)}
              className="hover:text-white"
            >
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
              className="w-20 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
