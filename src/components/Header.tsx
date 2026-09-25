import React from 'react';
import {
  Bell,
  Sparkles,
  Shield,
  Activity,
  Film,
  Zap,
  CheckCircle2,
  RefreshCw,
  Crown,
  Lock,
  FolderOpen,
  Download
} from 'lucide-react';
import { SAMPLE_VIDEOS, SampleVideo } from '../utils/videoSamples';
import { VideoMetadata } from '../types';
import { SUPER_ADMIN_EMAIL } from '../utils/adminStorage';

interface HeaderProps {
  currentMetadata: VideoMetadata | null;
  onSelectSample: (sample: SampleVideo) => void;
  onReset: () => void;
  isProcessing: boolean;
  onQuickDownloadClean?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMetadata,
  onSelectSample,
  onReset,
  isProcessing,
  onQuickDownloadClean
}) => {
  return (
    <header className="h-16 border-b border-white/10 bg-[#0f172a] px-6 flex items-center justify-between z-10 shrink-0">
      {/* Left Title & Status */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            AI Video Engine
          </h1>
          <p className="text-[11px] text-[#94a3b8] hidden sm:block">Scrub, re-hash and protect your content assets.</p>
        </div>

        <div className="h-4 w-px bg-white/10 hidden md:block" />

        {/* Quick Sample Selector Pills */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-xs text-[#94a3b8] font-medium">Demo Feeds:</span>
          {SAMPLE_VIDEOS.map((sample) => (
            <button
              key={sample.id}
              disabled={isProcessing}
              onClick={() => onSelectSample(sample)}
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-[#1e293b] hover:bg-[#334155] border border-white/10 text-slate-300 hover:text-[#06b6d4] transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Film className="w-3 h-3 text-[#6366f1]" />
              <span className="truncate max-w-[110px]">{sample.category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right Stats & Profile */}
      <div className="flex items-center gap-3">
        {currentMetadata && onQuickDownloadClean && (
          <button
            onClick={onQuickDownloadClean}
            disabled={isProcessing}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-400 to-[#06b6d4] text-black shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download Clean Video</span>
          </button>
        )}

        {currentMetadata && (
          <button
            onClick={onReset}
            disabled={isProcessing}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#94a3b8] hover:text-white hover:bg-white/5 border border-white/10 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            title="Load different video"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}

        <div className="sleek-status-pill hidden sm:flex items-center gap-1.5 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] animate-pulse" />
          <span>SYSTEM ONLINE (v2.4.1)</span>
        </div>

        <div className="h-6 w-px bg-white/10" />

        {/* Super Admin User Profile Indicator */}
        <div className="flex items-center gap-2.5 bg-[#1e293b] border border-amber-500/30 px-3 py-1.5 rounded-xl shadow-[0_0_12px_rgba(245,158,11,0.1)]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 via-orange-500 to-cyan-400 flex items-center justify-center text-xs font-black text-white shadow-md">
            <Crown className="w-4 h-4 text-white" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-white">Sable</p>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                SUPER ADMIN
              </span>
            </div>
            <p className="text-[10px] text-[#06b6d4] font-mono">{SUPER_ADMIN_EMAIL}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

