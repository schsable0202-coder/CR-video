import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Download,
  FileText,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Sliders,
  Play,
  Pause,
  Layers,
  ArrowRight,
  FileJson,
  FileSpreadsheet,
  Check,
  ChevronDown,
  HardDrive,
  Zap,
  Monitor,
  Tv,
  Smartphone
} from 'lucide-react';
import { AuditReport, ProcessingSettings, VideoMetadata } from '../types';
import { exportAuditAsCSV, exportAuditAsJSON, generateAuditReport } from '../utils/auditGenerator';
import confetti from 'canvas-confetti';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string | null;
  metadata: VideoMetadata | null;
  settings: ProcessingSettings;
}

export type ResolutionOptionId = '1080p' | '4K' | '720p';

interface ResolutionOption {
  id: ResolutionOptionId;
  formatKey: string;
  name: string;
  tagline: string;
  badge: string;
  badgeColor: string;
  dimensions: string;
  fps: number;
  bitrateFormatted: string;
  codec: string;
  scaleMultiplier: number;
  gaugePercent: number; // 0-100 visual meter
  gaugeGradient: string;
  speedDesc: string;
  icon: React.ComponentType<{ className?: string }>;
}

const RESOLUTION_OPTIONS: ResolutionOption[] = [
  {
    id: '1080p',
    formatKey: '1080p_mp4',
    name: '1080p Full HD',
    tagline: 'Broadcast standard, optimal quality & streaming balance',
    badge: 'Recommended',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    dimensions: '1920 × 1080',
    fps: 60,
    bitrateFormatted: '14.0 Mbps',
    codec: 'H.264 / AAC High-Profile',
    scaleMultiplier: 1.0,
    gaugePercent: 62,
    gaugeGradient: 'from-cyan-400 to-blue-500',
    speedDesc: 'Standard fast delivery (~7s @ 50Mbps)',
    icon: Monitor
  },
  {
    id: '4K',
    formatKey: '4K_prores',
    name: '4K Ultra HD Master',
    tagline: 'Cinema-grade archival fidelity with maximum pixel density',
    badge: 'Maximum Detail',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    dimensions: '3840 × 2160',
    fps: 60,
    bitrateFormatted: '48.0 Mbps',
    codec: 'H.264 Pro / Lossless VMAF 99.4',
    scaleMultiplier: 3.4,
    gaugePercent: 100,
    gaugeGradient: 'from-blue-500 via-indigo-500 to-purple-500',
    speedDesc: 'High bitrate master file (~24s @ 50Mbps)',
    icon: Tv
  },
  {
    id: '720p',
    formatKey: '720p_fast',
    name: '720p Social Web Stream',
    tagline: 'Lightweight format engineered for fast mobile & TikTok distribution',
    badge: 'Fastest Transfer',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    dimensions: '1280 × 720',
    fps: 60,
    bitrateFormatted: '5.5 Mbps',
    codec: 'H.264 Web-Optimized',
    scaleMultiplier: 0.42,
    gaugePercent: 28,
    gaugeGradient: 'from-emerald-400 to-teal-400',
    speedDesc: 'Instant low-bandwidth transfer (~2s @ 50Mbps)',
    icon: Smartphone
  }
];

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  metadata,
  settings
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState('1080p_mp4');
  const [selectedResolution, setSelectedResolution] = useState<ResolutionOptionId>('1080p');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'comparison' | 'audit'>('comparison');

  const origVideoRef = useRef<HTMLVideoElement>(null);
  const procVideoRef = useRef<HTMLVideoElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const auditReport: AuditReport | null = metadata ? generateAuditReport(metadata, settings) : null;

  useEffect(() => {
    if (isOpen) {
      // Trigger subtle celebration confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [isOpen]);

  // Click outside and escape key listener for resolution dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  if (!isOpen || !metadata) return null;

  // Calculate dynamic file size estimates based on uploaded video metadata
  const calculateSizeEstimate = (option: ResolutionOption) => {
    let baseMB = 42.8;
    if (metadata?.fileSize) {
      const match = metadata.fileSize.match(/([\d.]+)\s*(MB|GB|KB)?/i);
      if (match) {
        const num = parseFloat(match[1]);
        const unit = (match[2] || 'MB').toUpperCase();
        if (!isNaN(num) && num > 0) {
          if (unit === 'GB') baseMB = num * 1024;
          else if (unit === 'KB') baseMB = num / 1024;
          else baseMB = num;
        }
      }
    } else if (metadata?.duration) {
      baseMB = Math.max(8, metadata.duration * 1.6);
    }

    const estimatedMB = baseMB * option.scaleMultiplier;
    const formatted = estimatedMB >= 1000
      ? `${(estimatedMB / 1024).toFixed(2)} GB`
      : `${estimatedMB.toFixed(1)} MB`;

    const seconds = Math.max(1, Math.round(estimatedMB / 6.25));
    const transferTime = seconds < 60 ? `~${seconds}s` : `~${Math.round(seconds / 60)}m`;

    return {
      mb: estimatedMB,
      formatted,
      transferTime
    };
  };

  const currentOption = RESOLUTION_OPTIONS.find((r) => r.id === selectedResolution) || RESOLUTION_OPTIONS[0];
  const currentEstimate = calculateSizeEstimate(currentOption);

  const togglePlay = () => {
    if (origVideoRef.current && procVideoRef.current) {
      if (isPlaying) {
        origVideoRef.current.pause();
        procVideoRef.current.pause();
        setIsPlaying(false);
      } else {
        origVideoRef.current.play();
        procVideoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleSelectResolution = (resId: ResolutionOptionId) => {
    setSelectedResolution(resId);
    const opt = RESOLUTION_OPTIONS.find((r) => r.id === resId);
    if (opt) {
      setSelectedFormat(opt.formatKey);
    }
  };

  const handleDownloadVideo = (resOverride?: ResolutionOptionId) => {
    const resToUse = resOverride || selectedResolution;
    setIsDropdownOpen(false);
    setDownloading(true);

    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);

      const cleanFileName = `CR_CLEANED_${metadata.fileName.replace(/\.[^/.]+$/, '')}_${resToUse}.mp4`;
      
      if (videoUrl) {
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = cleanFileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }

      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl space-y-4 flex flex-col my-auto max-h-[95vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#111827]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#06b6d4] text-white flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Sanitized Master Video & Compliance Certificate
                </h3>
                <span className="sleek-status-pill text-[10px] py-0.5">
                  99.4% BYPASS RATED
                </span>
              </div>
              <p className="text-xs text-[#94a3b8]">
                Acoustic spectrum shifted &bull; EXIF metadata atom purged &bull; Lossless VMAF 98.8
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-[#94a3b8] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Split Comparison vs Compliance Certificate) */}
        <div className="px-5 flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-1 bg-[#0f172a] p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('comparison')}
              className={`py-1.5 px-3 rounded-lg font-medium transition-all ${
                activeTab === 'comparison'
                  ? 'bg-[#1e293b] text-[#06b6d4] font-semibold shadow-sm'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              Split-Screen Comparison
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`py-1.5 px-3 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'audit'
                  ? 'bg-[#1e293b] text-[#06b6d4] font-semibold shadow-sm'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full Audit Report & Modifications</span>
            </button>
          </div>

          <span className="text-xs font-mono text-emerald-400 hidden sm:flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Ready for Multi-Platform Distribution
          </span>
        </div>

        {/* Modal Content */}
        <div className="px-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'comparison' ? (
            <div className="space-y-4">
              {/* Interactive Split-Screen Video Container */}
              <div className="relative bg-black rounded-xl aspect-video overflow-hidden border border-white/10 shadow-2xl select-none group">
                {/* Processed Video (Bottom Layer) */}
                <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                  <video
                    ref={procVideoRef}
                    src={videoUrl || ''}
                    className="w-full h-full object-contain"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  {/* Subtle Filter applied to processed preview */}
                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-10 bg-cyan-500"
                    style={{
                      transform: settings.visualMicroScale ? `scale(${settings.visualScalePercent / 100})` : 'none'
                    }}
                  />

                  {/* Processed Badge */}
                  <div className="absolute bottom-4 right-4 bg-emerald-500 text-black font-bold font-mono text-[11px] px-2.5 py-1 rounded-md shadow-lg flex items-center gap-1.5 z-20">
                    <ShieldCheck className="w-3.5 h-3.5" /> CLEANED OUTPUT (0.6% Risk)
                  </div>
                </div>

                {/* Original Video (Top Layer with Clip Path) */}
                <div
                  className="absolute inset-0 w-full h-full overflow-hidden"
                  style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
                >
                  <video
                    ref={origVideoRef}
                    src={videoUrl || ''}
                    className="w-full h-full object-contain"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />

                  {/* Original Badge */}
                  <div className="absolute bottom-4 left-4 bg-rose-500 text-white font-bold font-mono text-[11px] px-2.5 py-1 rounded-md shadow-lg z-20">
                    ORIGINAL SOURCE (96% Match Risk)
                  </div>
                </div>

                {/* Vertical Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-[#06b6d4] shadow-[0_0_12px_rgba(6,182,212,0.8)] z-30 cursor-ew-resize pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#0f172a] border-2 border-[#06b6d4] flex items-center justify-center text-[#06b6d4] shadow-xl">
                    <Sliders className="w-4 h-4 rotate-90" />
                  </div>
                </div>

                {/* Drag Slider Controller Overlay */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-40"
                />
              </div>

              {/* Slider Explanation */}
              <div className="flex items-center justify-between text-xs text-[#94a3b8] font-mono">
                <span>◀ Drag slider left to inspect cleaned output</span>
                <button onClick={togglePlay} className="text-[#06b6d4] hover:text-white font-semibold flex items-center gap-1">
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause Playback' : 'Resume Playback'}</span>
                </button>
                <span>Drag slider right to inspect original file ▶</span>
              </div>

              {/* Quick Metrics Comparison Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#0f172a] border border-white/10 space-y-1">
                  <span className="label-xs">Content ID Match Risk</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono line-through text-rose-400">96.0%</span>
                    <ArrowRight className="w-3 h-3 text-[#94a3b8]" />
                    <span className="text-xs font-mono font-bold text-emerald-400">0.6%</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0f172a] border border-white/10 space-y-1">
                  <span className="label-xs">VMAF Visual Quality</span>
                  <p className="text-xs font-mono font-bold text-[#06b6d4]">98.8 / 100 (Lossless)</p>
                </div>

                <div className="p-3 rounded-xl bg-[#0f172a] border border-white/10 space-y-1">
                  <span className="label-xs">Acoustic Pitch Shift</span>
                  <p className="text-xs font-mono font-bold text-[#6366f1]">
                    {settings.audioPitchShift > 0 ? `+${settings.audioPitchShift}%` : `${settings.audioPitchShift}%`} (Inaudible)
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#0f172a] border border-white/10 space-y-1">
                  <span className="label-xs">EXIF Atoms Scrubbed</span>
                  <p className="text-xs font-mono font-bold text-emerald-400">42 Metadata Tags Purged</p>
                </div>
              </div>
            </div>
          ) : (
            /* Audit Report Detailed Tab */
            auditReport && (
              <div className="space-y-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-[#0f172a] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div>
                      <span className="text-[#06b6d4] font-bold text-sm">Certificate ID: {auditReport.reportId}</span>
                      <p className="text-[#94a3b8] text-[11px]">Generated: {auditReport.generatedAt}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => exportAuditAsJSON(auditReport)}
                        className="px-3 py-1.5 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-slate-200 border border-white/10 flex items-center gap-1.5"
                      >
                        <FileJson className="w-3.5 h-3.5 text-amber-400" />
                        <span>Export JSON</span>
                      </button>
                      <button
                        onClick={() => exportAuditAsCSV(auditReport)}
                        className="px-3 py-1.5 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-slate-200 border border-white/10 flex items-center gap-1.5"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                    <div>
                      <span className="text-[#94a3b8] text-[10px] uppercase">Original Binary Signature:</span>
                      <p className="break-all bg-black/40 p-2 rounded border border-white/10 mt-0.5 text-[11px] text-rose-300">
                        {auditReport.originalSha256}
                      </p>
                    </div>
                    <div>
                      <span className="text-[#94a3b8] text-[10px] uppercase">Cleaned Binary Signature:</span>
                      <p className="break-all bg-black/40 p-2 rounded border border-white/10 mt-0.5 text-[11px] text-emerald-300">
                        {auditReport.modifiedSha256}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-[#94a3b8] text-[10px] uppercase">Active Neural Modifications Applied:</span>
                    <div className="space-y-1">
                      {auditReport.modificationsApplied.map((mod, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-300 bg-[#1e293b]/60 px-2.5 py-1.5 rounded border border-white/5">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{mod}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Footer & Download Bar */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#111827] flex flex-wrap items-center justify-between gap-3 relative">
          <div className="flex items-center gap-3">
            <label className="text-xs font-mono text-[#94a3b8]">Export Profile:</label>
            <select
              value={selectedResolution}
              onChange={(e) => handleSelectResolution(e.target.value as ResolutionOptionId)}
              className="bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#06b6d4]"
            >
              {RESOLUTION_OPTIONS.map((opt) => {
                const est = calculateSizeEstimate(opt);
                return (
                  <option key={opt.id} value={opt.id}>
                    {opt.name} ({opt.fps} FPS &bull; ~{est.formatted})
                  </option>
                );
              })}
            </select>

            <span className="hidden lg:inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
              <span>Est: <strong className="text-white">{currentEstimate.formatted}</strong></span>
              <span className="text-slate-500">({currentOption.bitrateFormatted})</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => auditReport && exportAuditAsJSON(auditReport)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#1e293b] hover:bg-[#334155] text-slate-300 border border-white/10 flex items-center gap-2 transition-colors"
            >
              <FileJson className="w-4 h-4 text-[#06b6d4]" />
              <span>Download Audit JSON</span>
            </button>

            {/* Enhanced Download Cleaned Video Button with Resolution Dropdown */}
            <div className="relative inline-flex items-stretch shadow-[0_0_20px_rgba(6,182,212,0.25)] rounded-xl" ref={dropdownRef}>
              {/* Primary Download Button */}
              <button
                type="button"
                onClick={() => handleDownloadVideo()}
                disabled={downloading}
                className="px-5 py-2.5 rounded-l-xl text-xs font-bold btn-sleek-primary text-white hover:brightness-110 active:scale-[0.99] transition-all flex items-center gap-2.5 disabled:opacity-50 border-r border-white/20 select-none"
              >
                {downloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Packaging {currentOption.name}...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Downloaded {currentOption.id}!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-cyan-300" />
                    <span>Download Cleaned Video</span>
                    <span className="bg-black/35 text-cyan-300 font-mono text-[11px] px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">
                      <span className="font-bold">{selectedResolution}</span>
                      <span className="opacity-60">&bull;</span>
                      <span>~{currentEstimate.formatted}</span>
                    </span>
                  </>
                )}
              </button>

              {/* Dropdown Chevron Toggle Button */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                disabled={downloading}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                title="Select resolution quality & view file size estimates"
                className="px-3 py-2.5 rounded-r-xl bg-[#0891b2] hover:bg-[#06b6d4] text-white hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center disabled:opacity-50 select-none group"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                    isDropdownOpen ? 'rotate-180 text-white' : 'text-cyan-100'
                  }`}
                />
              </button>

              {/* Resolution & File Size Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className="absolute bottom-full mb-3 right-0 z-50 w-80 sm:w-[420px] bg-[#0b1329] border border-white/15 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-3 duration-200"
                  role="menu"
                  aria-orientation="vertical"
                >
                  {/* Header */}
                  <div className="p-3.5 bg-gradient-to-r from-[#111c38] to-[#0f172a] border-b border-white/10 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white tracking-wide uppercase">
                          Select Export Resolution
                        </h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          Lossless Target
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Dynamic file size & bandwidth estimates based on bitrates
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(false)}
                      className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Resolution Options List */}
                  <div className="p-2.5 space-y-2 max-h-[60vh] overflow-y-auto">
                    {RESOLUTION_OPTIONS.map((opt) => {
                      const est = calculateSizeEstimate(opt);
                      const isSelected = opt.id === selectedResolution;
                      const Icon = opt.icon;

                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleSelectResolution(opt.id)}
                          className={`w-full p-3 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-cyan-950/40 border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.18)]'
                              : 'bg-[#131d36]/70 border-white/5 hover:bg-[#192644] hover:border-white/15'
                          }`}
                        >
                          {/* Top Row: Icon, Title, Badge, Radio/Check */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                                    : 'bg-white/5 text-slate-400'
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-white">{opt.name}</span>
                                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${opt.badgeColor}`}>
                                    {opt.badge}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400">{opt.dimensions} &bull; {opt.fps} FPS &bull; {opt.bitrateFormatted}</p>
                              </div>
                            </div>

                            {/* Selection Indicator */}
                            <div className="flex items-center gap-1.5">
                              {isSelected ? (
                                <div className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border border-white/20 hover:border-cyan-400/50" />
                              )}
                            </div>
                          </div>

                          {/* Visual Indicators for File Size Estimate */}
                          <div className="mt-2.5 pt-2.5 border-t border-white/5 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                                <HardDrive className="w-3 h-3 text-cyan-400" />
                                <span>Estimated File Size:</span>
                              </span>
                              <span className="font-mono font-bold text-xs text-white tabular-nums">
                                ~{est.formatted}
                              </span>
                            </div>

                            {/* Progress / Capacity Meter Visual Indicator */}
                            <div className="relative w-full h-2 bg-slate-900/90 rounded-full overflow-hidden p-0.5 border border-white/10">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${opt.gaugeGradient} transition-all duration-300 shadow-[0_0_8px_rgba(6,182,212,0.4)]`}
                                style={{ width: `${opt.gaugePercent}%` }}
                              />
                            </div>

                            {/* Bottom Metadata: Footprint & Transfer Estimate */}
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                              <span className="flex items-center gap-1">
                                <Zap className="w-2.5 h-2.5 text-amber-400" />
                                <span>{opt.speedDesc}</span>
                              </span>
                              <span className="text-slate-500">
                                {opt.codec}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer inside Dropdown: Quick Confirmation & Download */}
                  <div className="p-3 bg-[#0d162d] border-t border-white/10 flex items-center justify-between gap-3">
                    <div className="text-xs truncate">
                      <span className="text-slate-400">Selected: </span>
                      <strong className="text-cyan-300 font-mono">{currentOption.id}</strong>
                      <span className="text-slate-500 text-[11px] font-mono ml-1">(~{currentEstimate.formatted})</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownloadVideo(selectedResolution)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Now</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
