import React from 'react';
import { X, Download, FileText, Music, Printer, CheckCircle } from 'lucide-react';
import { SongData } from '../types/music';
import { downloadMidiFile } from '../utils/midiGenerator';
import { downloadMusicXml } from '../utils/musicXmlGenerator';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: SongData;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  song,
}) => {
  if (!isOpen) return null;

  const handleExportMidi = () => {
    downloadMidiFile(song);
  };

  const handleExportMusicXml = () => {
    downloadMusicXml(song);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleExportGuitarTab = () => {
    let tabText = `======================================================\n`;
    tabText += `${song.title.toUpperCase()} - GUITAR TABLATURE\n`;
    tabText += `Artist: ${song.artist}\nKey: ${song.key} | Tempo: ${song.bpm} BPM\n`;
    tabText += `Transcribed with Songscription AI\n`;
    tabText += `======================================================\n\n`;

    song.chords.forEach((c) => {
      tabText += `[${c.name}] (${c.notes.join(' - ')})\n`;
    });

    const blob = new Blob([tabText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${song.title.replace(/\s+/g, '_')}_tabs.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Export Transcriptions</h3>
              <p className="text-xs text-slate-400">Download in your preferred music format</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Formats Grid */}
        <div className="p-6 space-y-3">
          {/* 1. MIDI File */}
          <button
            onClick={handleExportMidi}
            className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/80 hover:bg-indigo-950/20 transition-all flex items-center justify-between group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white group-hover:text-indigo-300">
                  Standard MIDI File (.mid)
                </div>
                <div className="text-xs text-slate-400">
                  Universal multi-track MIDI for Ableton, FL Studio, Logic, GarageBand
                </div>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-600 text-white shadow-sm">
              Download
            </span>
          </button>

          {/* 2. MusicXML */}
          <button
            onClick={handleExportMusicXml}
            className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-violet-500/80 hover:bg-violet-950/20 transition-all flex items-center justify-between group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-400 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white group-hover:text-violet-300">
                  MusicXML 4.0 (.musicxml)
                </div>
                <div className="text-xs text-slate-400">
                  Full notation score for MuseScore, Sibelius, Finale, and Dorico
                </div>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-violet-600 text-white shadow-sm">
              Download
            </span>
          </button>

          {/* 3. Sheet Music PDF / Print */}
          <button
            onClick={handlePrintPdf}
            className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/80 hover:bg-emerald-950/20 transition-all flex items-center justify-between group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white group-hover:text-emerald-300">
                  Print Sheet Music / Save as PDF
                </div>
                <div className="text-xs text-slate-400">
                  High-resolution classical Grand Staff score ready to print
                </div>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-600 text-white shadow-sm">
              Print
            </span>
          </button>

          {/* 4. Guitar Tablature */}
          <button
            onClick={handleExportGuitarTab}
            className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/80 hover:bg-amber-950/20 transition-all flex items-center justify-between group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white group-hover:text-amber-300">
                  Guitar Tablature & Chords (.txt)
                </div>
                <div className="text-xs text-slate-400">
                  6-string tabs and chord progression text chart
                </div>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-600 text-white shadow-sm">
              Download
            </span>
          </button>
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
