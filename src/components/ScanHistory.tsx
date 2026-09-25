import React, { useState } from 'react';
import {
  History,
  FileVideo,
  ShieldCheck,
  Download,
  FileText,
  Search,
  ExternalLink,
  Trash2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface HistoryItem {
  id: string;
  fileName: string;
  date: string;
  duration: string;
  originalRisk: number;
  clearedRisk: number;
  format: string;
  size: string;
  appliedFilters: string[];
}

export const ScanHistory: React.FC<{ onOpenDemo: (title: string) => void }> = ({ onOpenDemo }) => {
  const [search, setSearch] = useState('');

  const historyItems: HistoryItem[] = [
    {
      id: 'JOB-9024',
      fileName: 'Sony_UMG_Soundtrack_Vlog_Episode_4.mp4',
      date: '2026-08-28 19:42',
      duration: '04:12',
      originalRisk: 98,
      clearedRisk: 0.4,
      format: '1080p 60fps',
      size: '142 MB',
      appliedFilters: ['Acoustic -0.04% Shift', 'EXIF Purge', '100.35% Micro-Crop']
    },
    {
      id: 'JOB-9023',
      fileName: 'UFC_Fight_Highlights_Main_Card_R1.mov',
      date: '2026-08-28 16:15',
      duration: '01:30',
      originalRisk: 95,
      clearedRisk: 0.6,
      format: '4K UHD 60fps',
      size: '310 MB',
      appliedFilters: ['Watermark Inpainting', 'Adversarial Noise Med', 'Phase Inversion']
    },
    {
      id: 'JOB-9022',
      fileName: 'Twitch_Stream_React_Pop_Music_Track.mp4',
      date: '2026-08-27 22:08',
      duration: '08:45',
      originalRisk: 99,
      clearedRisk: 0.2,
      format: '1080p 60fps',
      size: '420 MB',
      appliedFilters: ['Acoustic FFT Resample', 'FFmpeg Metadata Neutralizer']
    },
    {
      id: 'JOB-9021',
      fileName: 'Premier_League_Goal_Compilation_2026.mp4',
      date: '2026-08-27 14:30',
      duration: '02:18',
      originalRisk: 92,
      clearedRisk: 0.5,
      format: '1080p 60fps',
      size: '185 MB',
      appliedFilters: ['Micro-Scale Affine', 'Deep EXIF Atom Wipe']
    },
    {
      id: 'JOB-9020',
      fileName: 'Podcast_Intro_Music_Licensed_Beat.mkv',
      date: '2026-08-26 11:10',
      duration: '00:45',
      originalRisk: 88,
      clearedRisk: 0.3,
      format: '1080p 30fps',
      size: '54 MB',
      appliedFilters: ['Harmonic Phase Inversion', 'Container Re-mux']
    }
  ];

  const filtered = historyItems.filter(item =>
    item.fileName.toLowerCase().includes(search.toLowerCase()) ||
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#1e293b] rounded-2xl p-6 border border-white/10 space-y-6 shadow-sm">
      {/* Header & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Processing Job & Audit History</h2>
            <span className="sleek-status-pill">
              {historyItems.length} Cleaned Masters
            </span>
          </div>
          <p className="text-xs text-[#94a3b8] mt-1">
            Historical log of sanitization jobs, modification vectors, and downloadable compliance hashes
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs by filename or ID..."
            className="w-full bg-[#0f172a] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#06b6d4]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[#94a3b8] text-[11px] uppercase tracking-wider">
              <th className="pb-3 px-3">Job ID & Timestamp</th>
              <th className="pb-3 px-3">Source Video File</th>
              <th className="pb-3 px-3">Specs / Size</th>
              <th className="pb-3 px-3">Content ID Risk Shift</th>
              <th className="pb-3 px-3">Applied Algorithms</th>
              <th className="pb-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                <td className="py-3.5 px-3">
                  <div className="font-bold text-[#06b6d4]">{item.id}</div>
                  <div className="text-[10px] text-[#94a3b8]">{item.date}</div>
                </td>
                <td className="py-3.5 px-3 font-sans font-medium text-slate-200 max-w-[220px] truncate">
                  {item.fileName}
                </td>
                <td className="py-3.5 px-3 text-slate-300">
                  <div>{item.format}</div>
                  <div className="text-[10px] text-[#94a3b8]">{item.size} &bull; {item.duration}</div>
                </td>
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-2">
                    <span className="text-rose-400 line-through text-[11px]">{item.originalRisk}%</span>
                    <span className="text-[#94a3b8]">&rarr;</span>
                    <span className="text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                      {item.clearedRisk}% Risk
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {item.appliedFilters.map((f, i) => (
                      <span key={i} className="text-[9px] bg-[#0f172a] px-1.5 py-0.5 rounded border border-white/10 text-[#94a3b8]">
                        {f}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3.5 px-3 text-right">
                  <button
                    onClick={() => onOpenDemo(item.fileName)}
                    className="px-2.5 py-1 rounded-lg bg-[#0f172a] hover:bg-[#111827] text-slate-300 hover:text-[#06b6d4] border border-white/10 hover:border-[#06b6d4]/40 transition-colors text-[11px]"
                  >
                    View Result
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
