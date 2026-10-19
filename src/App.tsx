import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SongData, DifficultyLevel, SongTrack } from './types/music';
import { SAMPLE_SONGS } from './data/sampleSongs';
import { audioSynth } from './utils/audioSynthesis';
import { Header } from './components/Header';
import { PianoRoll } from './components/PianoRoll';
import { SheetMusicView } from './components/SheetMusicView';
import { GuitarTabView } from './components/GuitarTabView';
import { ChordLeadSheetView } from './components/ChordLeadSheetView';
import { AudioControls } from './components/AudioControls';
import { MixerPanel } from './components/MixerPanel';
import { NewTranscriptionModal } from './components/NewTranscriptionModal';
import { ExportModal } from './components/ExportModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { LibraryModal } from './components/LibraryModal';
import { PlusCircle, Sparkles, SlidersHorizontal, Music, Play, Pause } from 'lucide-react';

export default function App() {
  const [currentSong, setCurrentSong] = useState<SongData>(SAMPLE_SONGS[0]);
  const [activeView, setActiveView] = useState<'pianoroll' | 'sheet' | 'tabs' | 'chords'>('pianoroll');

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [keyShift, setKeyShift] = useState<number>(0);
  const [metronomeActive, setMetronomeActive] = useState<boolean>(false);
  const [loopActive, setLoopActive] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.85);
  const [showMixer, setShowMixer] = useState<boolean>(false);

  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);

  // Audio Scheduling Refs
  const lastTimeRef = useRef<number>(0);
  const scheduledNotesRef = useRef<Set<string>>(new Set());
  const lastMetronomeBeatRef = useRef<number>(-1);
  const animFrameRef = useRef<number | null>(null);

  // Update master volume
  useEffect(() => {
    audioSynth.setMasterVolume(volume);
  }, [volume]);

  // Audio playback ticker
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = performance.now();
      scheduledNotesRef.current.clear();
      return;
    }

    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      const deltaSeconds = ((now - lastTimeRef.current) / 1000) * playbackSpeed;
      lastTimeRef.current = now;

      setCurrentTime((prevTime) => {
        const nextTime = prevTime + deltaSeconds;
        const songDuration = currentSong.duration || 10;

        if (nextTime >= songDuration) {
          if (loopActive) {
            scheduledNotesRef.current.clear();
            lastMetronomeBeatRef.current = -1;
            return 0;
          } else {
            setIsPlaying(false);
            audioSynth.stopAll();
            return 0;
          }
        }

        // Schedule notes in lookahead window (next 150ms)
        const lookahead = 0.15 * playbackSpeed;
        const windowStart = prevTime;
        const windowEnd = nextTime + lookahead;

        // Schedule track notes
        currentSong.tracks.forEach((track) => {
          if (track.muted) return;
          // Check solo constraint
          const hasSolo = currentSong.tracks.some((t) => t.solo);
          if (hasSolo && !track.solo) return;

          track.notes.forEach((note) => {
            const noteKey = `${note.id}-${Math.floor(prevTime / songDuration)}`;
            if (
              note.startTime >= windowStart &&
              note.startTime < windowEnd &&
              !scheduledNotesRef.current.has(noteKey)
            ) {
              scheduledNotesRef.current.add(noteKey);
              const shiftedMidi = note.midiNumber + keyShift;
              audioSynth.playNote(
                shiftedMidi,
                note.duration,
                (note.velocity || 85) * track.volume,
                track.instrument === 'guitar' ? 'guitar' : 'piano'
              );
            }
          });
        });

        // Metronome scheduling
        if (metronomeActive) {
          const bpm = currentSong.bpm || 120;
          const secondsPerBeat = 60 / bpm;
          const currentBeat = Math.floor(nextTime / secondsPerBeat);
          if (currentBeat !== lastMetronomeBeatRef.current) {
            lastMetronomeBeatRef.current = currentBeat;
            const beatsPerMeasure = currentSong.timeSignature[0] || 4;
            const isAccent = currentBeat % beatsPerMeasure === 0;
            audioSynth.playMetronomeTick(isAccent);
          }
        }

        return nextTime;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, playbackSpeed, currentSong, keyShift, metronomeActive, loopActive]);

  const togglePlay = () => {
    audioSynth.resumeAudioContext();
    if (isPlaying) {
      setIsPlaying(false);
      audioSynth.stopAll();
    } else {
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    audioSynth.resumeAudioContext();
    setIsPlaying(false);
    audioSynth.stopAll();
    scheduledNotesRef.current.clear();
    lastMetronomeBeatRef.current = -1;
    setCurrentTime(0);
  };

  const handleSeek = (newTime: number) => {
    audioSynth.resumeAudioContext();
    audioSynth.stopAll();
    scheduledNotesRef.current.clear();
    lastMetronomeBeatRef.current = -1;
    setCurrentTime(newTime);
  };

  // Keyboard shortcut listener (Spacebar for play/pause, Left/Right arrows for seek)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleSeek(Math.max(0, currentTime - 2));
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleSeek(Math.min(currentSong.duration, currentTime + 2));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTime, currentSong.duration, isPlaying]);

  const handleUpdateTrack = (trackId: string, updates: Partial<SongTrack>) => {
    setCurrentSong((prev) => ({
      ...prev,
      tracks: prev.tracks.map((t) => (t.id === trackId ? { ...t, ...updates } : t)),
    }));
  };

  const handleChangeDifficulty = (lvl: DifficultyLevel) => {
    setCurrentSong((prev) => ({
      ...prev,
      difficulty: lvl,
    }));
  };

  const handleTranscriptionComplete = (newSong: SongData) => {
    handleRestart();
    setCurrentSong(newSong);
    // Switch to piano roll by default or guitar tabs if target was guitar
    if (newSong.tracks.some((t) => t.instrument === 'guitar')) {
      setActiveView('tabs');
    } else {
      setActiveView('pianoroll');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Header Bar */}
      <Header
        currentSong={currentSong}
        onOpenNew={() => setIsNewModalOpen(true)}
        onOpenLibrary={() => setIsLibraryModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 flex flex-col gap-4">
        {/* Quick Hero Banner / Action bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-purple-950/30 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-extrabold text-white tracking-tight">
                  {currentSong.title}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 capitalize">
                  {currentSong.difficulty}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {currentSong.artist} • {currentSong.tracks.length} Stems / Tracks • Transcribed with AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20 animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>إيقاف مؤقت / Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>تشغيل المقطوعة / Play</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowMixer(!showMixer)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                showMixer
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Stem Mixer</span>
            </button>

            <button
              onClick={() => setIsNewModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Transcribe New Audio</span>
            </button>
          </div>
        </div>

        {/* Stem Mixer Collapsible Drawer */}
        {showMixer && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <MixerPanel
              tracks={currentSong.tracks}
              onUpdateTrack={handleUpdateTrack}
            />
          </div>
        )}

        {/* Dynamic Studio Workspace Views */}
        <div className="flex-1 min-h-[500px]">
          {activeView === 'pianoroll' && (
            <PianoRoll
              song={currentSong}
              currentTime={currentTime}
              isPlaying={isPlaying}
              onSeek={handleSeek}
              keyShift={keyShift}
            />
          )}

          {activeView === 'sheet' && (
            <SheetMusicView
              song={currentSong}
              currentTime={currentTime}
              onSeek={handleSeek}
              keyShift={keyShift}
            />
          )}

          {activeView === 'tabs' && (
            <GuitarTabView
              song={currentSong}
              currentTime={currentTime}
              onSeek={handleSeek}
              keyShift={keyShift}
            />
          )}

          {activeView === 'chords' && (
            <ChordLeadSheetView
              song={currentSong}
              currentTime={currentTime}
              onSeek={handleSeek}
              keyShift={keyShift}
            />
          )}
        </div>
      </main>

      {/* Sticky Bottom Audio Transport Controls */}
      <footer className="sticky bottom-0 z-30">
        <AudioControls
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          onRestart={handleRestart}
          currentTime={currentTime}
          duration={currentSong.duration || 10}
          onSeek={handleSeek}
          playbackSpeed={playbackSpeed}
          onChangeSpeed={setPlaybackSpeed}
          keyShift={keyShift}
          onChangeKeyShift={setKeyShift}
          metronomeActive={metronomeActive}
          onToggleMetronome={() => setMetronomeActive(!metronomeActive)}
          loopActive={loopActive}
          onToggleLoop={() => setLoopActive(!loopActive)}
          difficulty={currentSong.difficulty}
          onChangeDifficulty={handleChangeDifficulty}
          volume={volume}
          onChangeVolume={setVolume}
        />
      </footer>

      {/* Modals */}
      <NewTranscriptionModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onTranscriptionComplete={handleTranscriptionComplete}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        song={currentSong}
      />

      <AIAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        song={currentSong}
      />

      <LibraryModal
        isOpen={isLibraryModalOpen}
        onClose={() => setIsLibraryModalOpen(false)}
        currentSongId={currentSong.id}
        onSelectSong={(song) => {
          handleRestart();
          setCurrentSong(song);
        }}
      />
    </div>
  );
}
