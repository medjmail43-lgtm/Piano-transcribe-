export type Clef = 'treble' | 'bass';

export type InstrumentType = 'piano' | 'guitar' | 'bass' | 'vocals' | 'ensemble';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface NoteItem {
  id: string;
  pitch: string; // e.g. "C4", "D#4", "Eb4"
  midiNumber: number; // 60 for Middle C
  startTime: number; // in seconds
  duration: number; // in seconds
  velocity?: number; // 1-127
  hand?: 'right' | 'left'; // for piano: treble (right) or bass (left)
  stringNumber?: number; // for guitar: 1-6
  fretNumber?: number; // for guitar: 0-24
  lyric?: string;
}

export interface ChordItem {
  name: string; // e.g. "Am7", "Fmaj7", "G7", "C"
  time: number; // in seconds
  duration: number; // in seconds
  root: string;
  quality: 'maj' | 'min' | '7' | 'maj7' | 'min7' | 'dim' | 'aug' | 'sus4' | 'other';
  notes: string[]; // e.g. ["A3", "C4", "E4", "G4"]
}

export interface Measure {
  number: number;
  timeSignature: [number, number]; // e.g. [4, 4] or [3, 4]
  keySignature: string; // e.g. "C", "G", "Am", "Dm"
  bpm: number;
  notes: NoteItem[];
  chords: ChordItem[];
}

export interface SongTrack {
  id: string;
  name: string;
  instrument: InstrumentType;
  volume: number; // 0 to 1
  muted: boolean;
  solo: boolean;
  pan: number; // -1 to 1
  color: string;
  notes: NoteItem[];
}

export interface SongData {
  id: string;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  timeSignature: [number, number];
  key: string;
  duration: number; // seconds
  difficulty: DifficultyLevel;
  audioUrl?: string;
  tracks: SongTrack[];
  chords: ChordItem[];
  lyrics?: { time: number; text: string }[];
}

export interface TranscriptionOptions {
  instrument: InstrumentType;
  difficulty: DifficultyLevel;
  outputFormats: ('sheet' | 'midi' | 'pianoroll' | 'tabs' | 'chords')[];
  keyShift: number; // semitones (-12 to +12)
  targetBpm?: number;
  separateStems: boolean;
  detectLyrics: boolean;
}
