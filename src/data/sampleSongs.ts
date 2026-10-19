import { SongData } from '../types/music';

export const SAMPLE_SONGS: SongData[] = [
  {
    id: 'fur-elise',
    title: 'Für Elise (Bagatelle No. 25)',
    artist: 'Ludwig van Beethoven',
    genre: 'Classical',
    bpm: 130,
    timeSignature: [3, 4],
    key: 'Am',
    duration: 16.5,
    difficulty: 'intermediate',
    tracks: [
      {
        id: 't-elise-rh',
        name: 'Piano - Right Hand (Treble Clef)',
        instrument: 'piano',
        volume: 0.95,
        muted: false,
        solo: false,
        pan: 0.15,
        color: '#6366f1',
        notes: [
          // E5 - D#5 - E5 - D#5 - E5 - B4 - D5 - C5 - A4 motif
          { id: 'fe-1', pitch: 'E5', midiNumber: 76, startTime: 0.0, duration: 0.35, hand: 'right', velocity: 88 },
          { id: 'fe-2', pitch: 'D#5', midiNumber: 75, startTime: 0.35, duration: 0.35, hand: 'right', velocity: 84 },
          { id: 'fe-3', pitch: 'E5', midiNumber: 76, startTime: 0.7, duration: 0.35, hand: 'right', velocity: 88 },
          { id: 'fe-4', pitch: 'D#5', midiNumber: 75, startTime: 1.05, duration: 0.35, hand: 'right', velocity: 84 },
          { id: 'fe-5', pitch: 'E5', midiNumber: 76, startTime: 1.4, duration: 0.35, hand: 'right', velocity: 88 },
          { id: 'fe-6', pitch: 'B4', midiNumber: 71, startTime: 1.75, duration: 0.35, hand: 'right', velocity: 80 },
          { id: 'fe-7', pitch: 'D5', midiNumber: 74, startTime: 2.1, duration: 0.35, hand: 'right', velocity: 82 },
          { id: 'fe-8', pitch: 'C5', midiNumber: 72, startTime: 2.45, duration: 0.35, hand: 'right', velocity: 85 },
          { id: 'fe-9', pitch: 'A4', midiNumber: 69, startTime: 2.8, duration: 0.9, hand: 'right', velocity: 90 },

          // Measure 2: C4 - E4 - A4 - B4
          { id: 'fe-10', pitch: 'C4', midiNumber: 60, startTime: 3.8, duration: 0.35, hand: 'right', velocity: 75 },
          { id: 'fe-11', pitch: 'E4', midiNumber: 64, startTime: 4.15, duration: 0.35, hand: 'right', velocity: 78 },
          { id: 'fe-12', pitch: 'A4', midiNumber: 69, startTime: 4.5, duration: 0.35, hand: 'right', velocity: 82 },
          { id: 'fe-13', pitch: 'B4', midiNumber: 71, startTime: 4.85, duration: 0.9, hand: 'right', velocity: 85 },

          // Measure 3: E4 - G#4 - B4 - C5
          { id: 'fe-14', pitch: 'E4', midiNumber: 64, startTime: 5.85, duration: 0.35, hand: 'right', velocity: 75 },
          { id: 'fe-15', pitch: 'G#4', midiNumber: 68, startTime: 6.2, duration: 0.35, hand: 'right', velocity: 78 },
          { id: 'fe-16', pitch: 'B4', midiNumber: 71, startTime: 6.55, duration: 0.35, hand: 'right', velocity: 82 },
          { id: 'fe-17', pitch: 'C5', midiNumber: 72, startTime: 6.9, duration: 0.9, hand: 'right', velocity: 86 },

          // Measure 4: repeat theme
          { id: 'fe-18', pitch: 'E4', midiNumber: 64, startTime: 7.9, duration: 0.35, hand: 'right', velocity: 75 },
          { id: 'fe-19', pitch: 'E5', midiNumber: 76, startTime: 8.25, duration: 0.35, hand: 'right', velocity: 88 },
          { id: 'fe-20', pitch: 'D#5', midiNumber: 75, startTime: 8.6, duration: 0.35, hand: 'right', velocity: 84 },
          { id: 'fe-21', pitch: 'E5', midiNumber: 76, startTime: 8.95, duration: 0.35, hand: 'right', velocity: 88 },
          { id: 'fe-22', pitch: 'D#5', midiNumber: 75, startTime: 9.3, duration: 0.35, hand: 'right', velocity: 84 },
          { id: 'fe-23', pitch: 'E5', midiNumber: 76, startTime: 9.65, duration: 0.35, hand: 'right', velocity: 88 },
          { id: 'fe-24', pitch: 'B4', midiNumber: 71, startTime: 10.0, duration: 0.35, hand: 'right', velocity: 80 },
          { id: 'fe-25', pitch: 'D5', midiNumber: 74, startTime: 10.35, duration: 0.35, hand: 'right', velocity: 82 },
          { id: 'fe-26', pitch: 'C5', midiNumber: 72, startTime: 10.7, duration: 0.35, hand: 'right', velocity: 85 },
          { id: 'fe-27', pitch: 'A4', midiNumber: 69, startTime: 11.05, duration: 1.2, hand: 'right', velocity: 90 },

          // Cadence resolution
          { id: 'fe-28', pitch: 'C5', midiNumber: 72, startTime: 12.4, duration: 0.4, hand: 'right', velocity: 82 },
          { id: 'fe-29', pitch: 'B4', midiNumber: 71, startTime: 12.8, duration: 0.4, hand: 'right', velocity: 80 },
          { id: 'fe-30', pitch: 'A4', midiNumber: 69, startTime: 13.2, duration: 1.8, hand: 'right', velocity: 88 },
        ]
      },
      {
        id: 't-elise-lh',
        name: 'Piano - Left Hand (Bass Clef)',
        instrument: 'piano',
        volume: 0.8,
        muted: false,
        solo: false,
        pan: -0.15,
        color: '#10b981',
        notes: [
          // Am arpeggio
          { id: 'fel-1', pitch: 'A2', midiNumber: 45, startTime: 2.8, duration: 0.8, hand: 'left', velocity: 70 },
          { id: 'fel-2', pitch: 'E3', midiNumber: 52, startTime: 3.1, duration: 0.8, hand: 'left', velocity: 68 },
          { id: 'fel-3', pitch: 'A3', midiNumber: 57, startTime: 3.4, duration: 0.8, hand: 'left', velocity: 70 },

          // E7 arpeggio
          { id: 'fel-4', pitch: 'E2', midiNumber: 40, startTime: 4.85, duration: 0.8, hand: 'left', velocity: 70 },
          { id: 'fel-5', pitch: 'E3', midiNumber: 52, startTime: 5.15, duration: 0.8, hand: 'left', velocity: 68 },
          { id: 'fel-6', pitch: 'G#3', midiNumber: 56, startTime: 5.45, duration: 0.8, hand: 'left', velocity: 70 },

          // Am arpeggio
          { id: 'fel-7', pitch: 'A2', midiNumber: 45, startTime: 6.9, duration: 0.8, hand: 'left', velocity: 70 },
          { id: 'fel-8', pitch: 'E3', midiNumber: 52, startTime: 7.2, duration: 0.8, hand: 'left', velocity: 68 },
          { id: 'fel-9', pitch: 'A3', midiNumber: 57, startTime: 7.5, duration: 0.8, hand: 'left', velocity: 70 },

          // Full Am chord at cadence
          { id: 'fel-10', pitch: 'A2', midiNumber: 45, startTime: 11.05, duration: 1.4, hand: 'left', velocity: 75 },
          { id: 'fel-11', pitch: 'E3', midiNumber: 52, startTime: 11.05, duration: 1.4, hand: 'left', velocity: 70 },
          { id: 'fel-12', pitch: 'A3', midiNumber: 57, startTime: 11.05, duration: 1.4, hand: 'left', velocity: 70 },
          { id: 'fel-13', pitch: 'C4', midiNumber: 60, startTime: 11.05, duration: 1.4, hand: 'left', velocity: 65 },

          // Final deep root
          { id: 'fel-14', pitch: 'A1', midiNumber: 33, startTime: 13.2, duration: 2.2, hand: 'left', velocity: 85 },
          { id: 'fel-15', pitch: 'E2', midiNumber: 40, startTime: 13.2, duration: 2.2, hand: 'left', velocity: 80 },
        ]
      }
    ],
    chords: [
      { name: 'Am', time: 0, duration: 3.8, root: 'A', quality: 'min', notes: ['A3', 'C4', 'E4'] },
      { name: 'E7', time: 3.8, duration: 3.1, root: 'E', quality: '7', notes: ['E3', 'G#3', 'B3', 'D4'] },
      { name: 'Am', time: 6.9, duration: 4.15, root: 'A', quality: 'min', notes: ['A3', 'C4', 'E4'] },
      { name: 'E7', time: 11.05, duration: 2.15, root: 'E', quality: '7', notes: ['E3', 'G#3', 'B3', 'D4'] },
      { name: 'Am', time: 13.2, duration: 3.3, root: 'A', quality: 'min', notes: ['A2', 'E3', 'A3', 'C4'] },
    ]
  },
  {
    id: 'bohemian-rhapsody',
    title: 'Bohemian Rhapsody (Piano Ballad)',
    artist: 'Queen (Freddie Mercury)',
    genre: 'Rock / Classical Crossover',
    bpm: 72,
    timeSignature: [4, 4],
    key: 'Bb',
    duration: 15.0,
    difficulty: 'advanced',
    tracks: [
      {
        id: 't-bohem-rh',
        name: 'Piano - Freddie Mercury Melody',
        instrument: 'piano',
        volume: 0.92,
        muted: false,
        solo: false,
        pan: 0.1,
        color: '#f59e0b',
        notes: [
          // "Mama, just killed a man..."
          { id: 'br-1', pitch: 'Bb3', midiNumber: 58, startTime: 0.0, duration: 0.7, hand: 'right', velocity: 82 },
          { id: 'br-2', pitch: 'D4', midiNumber: 62, startTime: 0.4, duration: 0.7, hand: 'right', velocity: 80 },
          { id: 'br-3', pitch: 'F4', midiNumber: 65, startTime: 0.8, duration: 0.9, hand: 'right', velocity: 88 },
          { id: 'br-4', pitch: 'Bb4', midiNumber: 70, startTime: 1.7, duration: 0.6, hand: 'right', velocity: 85 },
          { id: 'br-5', pitch: 'A4', midiNumber: 69, startTime: 2.4, duration: 0.5, hand: 'right', velocity: 82 },
          { id: 'br-6', pitch: 'G4', midiNumber: 67, startTime: 3.0, duration: 1.2, hand: 'right', velocity: 86 },

          // Gm accompaniment
          { id: 'br-7', pitch: 'G3', midiNumber: 55, startTime: 4.4, duration: 0.6, hand: 'right', velocity: 78 },
          { id: 'br-8', pitch: 'Bb3', midiNumber: 58, startTime: 4.8, duration: 0.6, hand: 'right', velocity: 78 },
          { id: 'br-9', pitch: 'D4', midiNumber: 62, startTime: 5.2, duration: 0.6, hand: 'right', velocity: 80 },
          { id: 'br-10', pitch: 'G4', midiNumber: 67, startTime: 5.7, duration: 1.4, hand: 'right', velocity: 85 },

          // Cm7 arpeggio
          { id: 'br-11', pitch: 'C4', midiNumber: 60, startTime: 7.2, duration: 0.5, hand: 'right', velocity: 82 },
          { id: 'br-12', pitch: 'Eb4', midiNumber: 63, startTime: 7.7, duration: 0.5, hand: 'right', velocity: 82 },
          { id: 'br-13', pitch: 'G4', midiNumber: 67, startTime: 8.2, duration: 0.5, hand: 'right', velocity: 84 },
          { id: 'br-14', pitch: 'Bb4', midiNumber: 70, startTime: 8.7, duration: 1.2, hand: 'right', velocity: 89 },

          // F7 resolution
          { id: 'br-15', pitch: 'F4', midiNumber: 65, startTime: 10.0, duration: 0.6, hand: 'right', velocity: 84 },
          { id: 'br-16', pitch: 'A4', midiNumber: 69, startTime: 10.6, duration: 0.6, hand: 'right', velocity: 85 },
          { id: 'br-17', pitch: 'C5', midiNumber: 72, startTime: 11.2, duration: 0.6, hand: 'right', velocity: 88 },
          { id: 'br-18', pitch: 'Eb5', midiNumber: 75, startTime: 11.8, duration: 1.5, hand: 'right', velocity: 90 },

          // Grand Bb chord
          { id: 'br-19', pitch: 'D5', midiNumber: 74, startTime: 13.4, duration: 1.5, hand: 'right', velocity: 92 },
          { id: 'br-20', pitch: 'Bb4', midiNumber: 70, startTime: 13.4, duration: 1.5, hand: 'right', velocity: 88 },
          { id: 'br-21', pitch: 'F4', midiNumber: 65, startTime: 13.4, duration: 1.5, hand: 'right', velocity: 84 },
        ]
      },
      {
        id: 't-bohem-lh',
        name: 'Piano - Left Hand (Bassline)',
        instrument: 'piano',
        volume: 0.85,
        muted: false,
        solo: false,
        pan: -0.1,
        color: '#06b6d4',
        notes: [
          { id: 'brl-1', pitch: 'Bb1', midiNumber: 34, startTime: 0.0, duration: 1.8, hand: 'left', velocity: 85 },
          { id: 'brl-2', pitch: 'F2', midiNumber: 41, startTime: 0.0, duration: 1.8, hand: 'left', velocity: 80 },
          { id: 'brl-3', pitch: 'Bb2', midiNumber: 46, startTime: 0.9, duration: 1.2, hand: 'left', velocity: 78 },

          { id: 'brl-4', pitch: 'G1', midiNumber: 31, startTime: 4.4, duration: 2.2, hand: 'left', velocity: 85 },
          { id: 'brl-5', pitch: 'D2', midiNumber: 38, startTime: 4.4, duration: 2.2, hand: 'left', velocity: 80 },

          { id: 'brl-6', pitch: 'C2', midiNumber: 36, startTime: 7.2, duration: 2.2, hand: 'left', velocity: 85 },
          { id: 'brl-7', pitch: 'G2', midiNumber: 43, startTime: 7.2, duration: 2.2, hand: 'left', velocity: 80 },

          { id: 'brl-8', pitch: 'F1', midiNumber: 29, startTime: 10.0, duration: 2.5, hand: 'left', velocity: 88 },
          { id: 'brl-9', pitch: 'C2', midiNumber: 36, startTime: 10.0, duration: 2.5, hand: 'left', velocity: 82 },

          { id: 'brl-10', pitch: 'Bb1', midiNumber: 34, startTime: 13.4, duration: 1.6, hand: 'left', velocity: 90 },
        ]
      }
    ],
    chords: [
      { name: 'Bb', time: 0.0, duration: 4.4, root: 'Bb', quality: 'maj', notes: ['Bb2', 'D3', 'F3', 'Bb3'] },
      { name: 'Gm', time: 4.4, duration: 2.8, root: 'G', quality: 'min', notes: ['G2', 'Bb2', 'D3', 'G3'] },
      { name: 'Cm7', time: 7.2, duration: 2.8, root: 'C', quality: 'min7', notes: ['C3', 'Eb3', 'G3', 'Bb3'] },
      { name: 'F7', time: 10.0, duration: 3.4, root: 'F', quality: '7', notes: ['F2', 'A2', 'C3', 'Eb3'] },
      { name: 'Bb', time: 13.4, duration: 1.6, root: 'Bb', quality: 'maj', notes: ['Bb2', 'D3', 'F3', 'Bb3'] },
    ],
    lyrics: [
      { time: 0.0, text: 'Is this the real life?' },
      { time: 4.4, text: 'Is this just fantasy?' },
      { time: 7.2, text: 'Caught in a landslide,' },
      { time: 10.0, text: 'No escape from reality...' },
    ]
  },
  {
    id: 'autumn-leaves',
    title: 'Autumn Leaves (Jazz Standards & Chords)',
    artist: 'Joseph Kosma & Jacques Prévert',
    genre: 'Jazz Standard',
    bpm: 110,
    timeSignature: [4, 4],
    key: 'Gm',
    duration: 17.5,
    difficulty: 'intermediate',
    tracks: [
      {
        id: 't-jazz-lead',
        name: 'Lead Melody (Acoustic Guitar / Piano)',
        instrument: 'guitar',
        volume: 0.9,
        muted: false,
        solo: false,
        pan: 0.1,
        color: '#ec4899',
        notes: [
          // E4 - F#4 - G4 - C5 melody pickup
          { id: 'al-1', pitch: 'E4', midiNumber: 64, startTime: 0.0, duration: 0.5, stringNumber: 2, fretNumber: 5, velocity: 85 },
          { id: 'al-2', pitch: 'F#4', midiNumber: 66, startTime: 0.5, duration: 0.5, stringNumber: 2, fretNumber: 7, velocity: 85 },
          { id: 'al-3', pitch: 'G4', midiNumber: 67, startTime: 1.0, duration: 0.5, stringNumber: 1, fretNumber: 3, velocity: 86 },
          { id: 'al-4', pitch: 'C5', midiNumber: 72, startTime: 1.5, duration: 1.8, stringNumber: 1, fretNumber: 8, velocity: 90 },

          // D4 - E4 - F#4 - B4
          { id: 'al-5', pitch: 'D4', midiNumber: 62, startTime: 3.5, duration: 0.5, stringNumber: 3, fretNumber: 7, velocity: 82 },
          { id: 'al-6', pitch: 'E4', midiNumber: 64, startTime: 4.0, duration: 0.5, stringNumber: 2, fretNumber: 5, velocity: 84 },
          { id: 'al-7', pitch: 'F#4', midiNumber: 66, startTime: 4.5, duration: 0.5, stringNumber: 2, fretNumber: 7, velocity: 86 },
          { id: 'al-8', pitch: 'B4', midiNumber: 71, startTime: 5.0, duration: 1.8, stringNumber: 1, fretNumber: 7, velocity: 88 },

          // C4 - D4 - E4 - A4
          { id: 'al-9', pitch: 'C4', midiNumber: 60, startTime: 7.0, duration: 0.5, stringNumber: 3, fretNumber: 5, velocity: 80 },
          { id: 'al-10', pitch: 'D4', midiNumber: 62, startTime: 7.5, duration: 0.5, stringNumber: 3, fretNumber: 7, velocity: 82 },
          { id: 'al-11', pitch: 'E4', midiNumber: 64, startTime: 8.0, duration: 0.5, stringNumber: 2, fretNumber: 5, velocity: 84 },
          { id: 'al-12', pitch: 'A4', midiNumber: 69, startTime: 8.5, duration: 1.8, stringNumber: 1, fretNumber: 5, velocity: 88 },

          // B3 - C4 - D4 - G4
          { id: 'al-13', pitch: 'B3', midiNumber: 59, startTime: 10.5, duration: 0.5, stringNumber: 3, fretNumber: 4, velocity: 80 },
          { id: 'al-14', pitch: 'C4', midiNumber: 60, startTime: 11.0, duration: 0.5, stringNumber: 3, fretNumber: 5, velocity: 82 },
          { id: 'al-15', pitch: 'D4', midiNumber: 62, startTime: 11.5, duration: 0.5, stringNumber: 3, fretNumber: 7, velocity: 84 },
          { id: 'al-16', pitch: 'G4', midiNumber: 67, startTime: 12.0, duration: 2.2, stringNumber: 1, fretNumber: 3, velocity: 88 },
        ]
      },
      {
        id: 't-jazz-chords',
        name: 'Jazz Chords (ii-V-I-IV Progression)',
        instrument: 'guitar',
        volume: 0.78,
        muted: false,
        solo: false,
        pan: -0.2,
        color: '#8b5cf6',
        notes: [
          // Am7
          { id: 'aj-1', pitch: 'A2', midiNumber: 45, startTime: 1.5, duration: 1.8, stringNumber: 5, fretNumber: 0, velocity: 75 },
          { id: 'aj-2', pitch: 'G3', midiNumber: 55, startTime: 1.5, duration: 1.8, stringNumber: 3, fretNumber: 0, velocity: 75 },
          { id: 'aj-3', pitch: 'C4', midiNumber: 60, startTime: 1.5, duration: 1.8, stringNumber: 2, fretNumber: 1, velocity: 78 },
          { id: 'aj-4', pitch: 'E4', midiNumber: 64, startTime: 1.5, duration: 1.8, stringNumber: 1, fretNumber: 0, velocity: 78 },

          // D7
          { id: 'aj-5', pitch: 'D3', midiNumber: 50, startTime: 5.0, duration: 1.8, stringNumber: 4, fretNumber: 0, velocity: 75 },
          { id: 'aj-6', pitch: 'F#3', midiNumber: 54, startTime: 5.0, duration: 1.8, stringNumber: 4, fretNumber: 4, velocity: 75 },
          { id: 'aj-7', pitch: 'C4', midiNumber: 60, startTime: 5.0, duration: 1.8, stringNumber: 2, fretNumber: 1, velocity: 78 },

          // Gmaj7
          { id: 'aj-8', pitch: 'G2', midiNumber: 43, startTime: 8.5, duration: 1.8, stringNumber: 6, fretNumber: 3, velocity: 75 },
          { id: 'aj-9', pitch: 'B2', midiNumber: 47, startTime: 8.5, duration: 1.8, stringNumber: 5, fretNumber: 2, velocity: 75 },
          { id: 'aj-10', pitch: 'F#3', midiNumber: 54, startTime: 8.5, duration: 1.8, stringNumber: 4, fretNumber: 4, velocity: 78 },

          // Cmaj7
          { id: 'aj-11', pitch: 'C3', midiNumber: 48, startTime: 12.0, duration: 2.2, stringNumber: 5, fretNumber: 3, velocity: 75 },
          { id: 'aj-12', pitch: 'E3', midiNumber: 52, startTime: 12.0, duration: 2.2, stringNumber: 4, fretNumber: 2, velocity: 75 },
          { id: 'aj-13', pitch: 'B3', midiNumber: 59, startTime: 12.0, duration: 2.2, stringNumber: 3, fretNumber: 4, velocity: 78 },
        ]
      }
    ],
    chords: [
      { name: 'Am7', time: 1.5, duration: 3.5, root: 'A', quality: 'min7', notes: ['A2', 'C3', 'E3', 'G3'] },
      { name: 'D7', time: 5.0, duration: 3.5, root: 'D', quality: '7', notes: ['D3', 'F#3', 'A3', 'C4'] },
      { name: 'Gmaj7', time: 8.5, duration: 3.5, root: 'G', quality: 'maj7', notes: ['G2', 'B2', 'D3', 'F#3'] },
      { name: 'Cmaj7', time: 12.0, duration: 5.0, root: 'C', quality: 'maj7', notes: ['C3', 'E3', 'G3', 'B3'] },
    ]
  },
  {
    id: 'pop-ballad',
    title: 'Daylight Dreams (Pop Acoustic Piano)',
    artist: 'Songscription Originals',
    genre: 'Pop / Acoustic',
    bpm: 124,
    timeSignature: [4, 4],
    key: 'C',
    duration: 15.5,
    difficulty: 'beginner',
    tracks: [
      {
        id: 't-pop-melody',
        name: 'Vocal Melody (Treble)',
        instrument: 'piano',
        volume: 0.95,
        muted: false,
        solo: false,
        pan: 0,
        color: '#3b82f6',
        notes: [
          // C - E - G - A melody
          { id: 'pm-1', pitch: 'G4', midiNumber: 67, startTime: 0.0, duration: 0.45, hand: 'right', velocity: 85 },
          { id: 'pm-2', pitch: 'A4', midiNumber: 69, startTime: 0.5, duration: 0.45, hand: 'right', velocity: 86 },
          { id: 'pm-3', pitch: 'C5', midiNumber: 72, startTime: 1.0, duration: 0.9, hand: 'right', velocity: 90 },
          { id: 'pm-4', pitch: 'B4', midiNumber: 71, startTime: 2.0, duration: 0.45, hand: 'right', velocity: 82 },
          { id: 'pm-5', pitch: 'G4', midiNumber: 67, startTime: 2.5, duration: 1.0, hand: 'right', velocity: 84 },

          // G major bar
          { id: 'pm-6', pitch: 'D5', midiNumber: 74, startTime: 3.8, duration: 0.5, hand: 'right', velocity: 88 },
          { id: 'pm-7', pitch: 'C5', midiNumber: 72, startTime: 4.4, duration: 0.5, hand: 'right', velocity: 85 },
          { id: 'pm-8', pitch: 'B4', midiNumber: 71, startTime: 5.0, duration: 1.2, hand: 'right', velocity: 86 },

          // Am bar
          { id: 'pm-9', pitch: 'E5', midiNumber: 76, startTime: 7.2, duration: 0.6, hand: 'right', velocity: 92 },
          { id: 'pm-10', pitch: 'D5', midiNumber: 74, startTime: 7.8, duration: 0.6, hand: 'right', velocity: 88 },
          { id: 'pm-11', pitch: 'C5', midiNumber: 72, startTime: 8.5, duration: 1.4, hand: 'right', velocity: 90 },

          // F bar resolution
          { id: 'pm-12', pitch: 'A4', midiNumber: 69, startTime: 10.8, duration: 0.5, hand: 'right', velocity: 85 },
          { id: 'pm-13', pitch: 'C5', midiNumber: 72, startTime: 11.4, duration: 0.5, hand: 'right', velocity: 88 },
          { id: 'pm-14', pitch: 'E5', midiNumber: 76, startTime: 12.0, duration: 2.2, hand: 'right', velocity: 94 },
        ]
      },
      {
        id: 't-pop-chords',
        name: 'Piano Accompaniment (Left Hand)',
        instrument: 'piano',
        volume: 0.8,
        muted: false,
        solo: false,
        pan: -0.15,
        color: '#14b8a6',
        notes: [
          // C chord
          { id: 'pc-1', pitch: 'C3', midiNumber: 48, startTime: 0.0, duration: 3.5, hand: 'left', velocity: 80 },
          { id: 'pc-2', pitch: 'G3', midiNumber: 55, startTime: 0.0, duration: 3.5, hand: 'left', velocity: 75 },
          { id: 'pc-3', pitch: 'E4', midiNumber: 64, startTime: 0.0, duration: 3.5, hand: 'left', velocity: 72 },

          // G chord
          { id: 'pc-4', pitch: 'G2', midiNumber: 43, startTime: 3.8, duration: 3.2, hand: 'left', velocity: 80 },
          { id: 'pc-5', pitch: 'D3', midiNumber: 50, startTime: 3.8, duration: 3.2, hand: 'left', velocity: 75 },
          { id: 'pc-6', pitch: 'B3', midiNumber: 59, startTime: 3.8, duration: 3.2, hand: 'left', velocity: 72 },

          // Am chord
          { id: 'pc-7', pitch: 'A2', midiNumber: 45, startTime: 7.2, duration: 3.4, hand: 'left', velocity: 80 },
          { id: 'pc-8', pitch: 'E3', midiNumber: 52, startTime: 7.2, duration: 3.4, hand: 'left', velocity: 75 },
          { id: 'pc-9', pitch: 'C4', midiNumber: 60, startTime: 7.2, duration: 3.4, hand: 'left', velocity: 72 },

          // F chord
          { id: 'pc-10', pitch: 'F2', midiNumber: 41, startTime: 10.8, duration: 4.2, hand: 'left', velocity: 82 },
          { id: 'pc-11', pitch: 'C3', midiNumber: 48, startTime: 10.8, duration: 4.2, hand: 'left', velocity: 78 },
          { id: 'pc-12', pitch: 'A3', midiNumber: 57, startTime: 10.8, duration: 4.2, hand: 'left', velocity: 74 },
        ]
      }
    ],
    chords: [
      { name: 'C', time: 0.0, duration: 3.8, root: 'C', quality: 'maj', notes: ['C3', 'E3', 'G3'] },
      { name: 'G', time: 3.8, duration: 3.4, root: 'G', quality: 'maj', notes: ['G2', 'B2', 'D3'] },
      { name: 'Am', time: 7.2, duration: 3.6, root: 'A', quality: 'min', notes: ['A2', 'C3', 'E3'] },
      { name: 'F', time: 10.8, duration: 4.5, root: 'F', quality: 'maj', notes: ['F2', 'A2', 'C3'] },
    ]
  }
];
