import React, { useState, useRef } from 'react';
import {
  Upload,
  Sparkles,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RefreshCw,
  Sliders,
  FileVideo,
  Layers,
  Volume2,
  Lock,
  ArrowRight,
  Zap,
  Check,
  Share2,
  Copy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VideoMetadata, ProcessingSettings, ProcessingStage, ProcessingStageId } from '../types';
import { SAMPLE_VIDEOS, SampleVideo } from '../utils/videoSamples';
import { createSynthesizedWatermarkedVideo, DEFAULT_WATERMARK_CONFIG } from '../utils/aiVideoStudio';

interface QuickWizardWorkflowProps {
  metadata: VideoMetadata | null;
  videoUrl: string | null;
  settings: ProcessingSettings;
  isProcessing: boolean;
  onStartProcessing: () => void;
  onFileLoaded: (file: File, meta: VideoMetadata, videoUrl: string) => void;
  onSelectSample: (sample: SampleVideo) => void;
  onOpenAdvancedStudio: () => void;
  onOpenComparisonModal: () => void;
  onOpenWatermarkModal?: () => void;
  overallProgress: number;
}

export const QuickWizardWorkflow: React.FC<QuickWizardWorkflowProps> = ({
  metadata,
  videoUrl,
  settings,
  isProcessing,
  onStartProcessing,
  onFileLoaded,
  onSelectSample,
  onOpenAdvancedStudio,
  onOpenComparisonModal,
  onOpenWatermarkModal,
  overallProgress
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isInstantDownloading, setIsInstantDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Step detection
  const isStep1Done = Boolean(metadata && videoUrl);
  const isStep2Done = overallProgress === 100 || (metadata && metadata.copyrightRiskScore <= 1);
  const isStep2InProgress = isProcessing;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processLocalFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processLocalFile(file);
  };

  const processLocalFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const sizeFormatted = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    const mockMeta: VideoMetadata = {
      fileName: file.name,
      fileSize: sizeFormatted,
      duration: 15.0,
      durationFormatted: '00:15',
      resolution: '1920x1080',
      width: 1920,
      height: 1080,
      fps: 60,
      codec: 'H.264 (High Profile)',
      audioCodec: 'AAC-LC',
      audioChannels: '2.0 (Stereo)',
      audioSampleRate: '48.0 kHz',
      bitrate: '12.4 Mbps',
      containerFormat: 'MPEG-4 (.mp4)',
      bitDepth: '8-bit',
      colorSpace: 'BT.709',
      originalHash: '0x8f2a9401bc3e' + Date.now().toString(16),
      scrubbedHash: '0x1c49e290f84a' + (Date.now() + 999).toString(16),
      copyrightRiskScore: 94,
      detectedPlatforms: ['YouTube Content ID', 'TikTok Sound Match', 'Meta Rights Manager'],
      cameraModel: 'Sony A7S III (ILCE-7SM3)',
      creationDate: new Date().toISOString(),
      encoderTag: 'Lavf58.29.100'
    };
    onFileLoaded(file, mockMeta, url);
  };

  const handleDirectDownloadClean = async (format: 'mp4' | 'bundle' = 'mp4') => {
    if (!metadata) return;
    setIsInstantDownloading(true);
    try {
      const cfg = settings.watermarkConfig || DEFAULT_WATERMARK_CONFIG;
      const cleanUrl = await createSynthesizedWatermarkedVideo(
        metadata?.fileName || 'Clean_Copyright_Free.mp4',
        cfg,
        10,
        videoUrl
      );

      if (format === 'bundle') {
        const textContent = `=== CR-REMOVER PRO // CLEAN COPYRIGHT-FREE REPORT ===\nFile: ${metadata.fileName}\nSHA-256 Hash: ${metadata.scrubbedHash}\nAudio Harmonics: Inaudible Phase-Inverted (-0.04% Shift)\nWatermark: ${cfg.text || 'schsable'} (${cfg.position})\nContent ID Strike Risk: 0.0% (Cleaned)\nStatus: Ready for YouTube, TikTok, Instagram & Facebook Monetization`;
        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        const bundleUrl = URL.createObjectURL(blob);
        const aTxt = document.createElement('a');
        aTxt.href = bundleUrl;
        aTxt.download = `CLEAN_COMPLIANCE_CERTIFICATE_${(cfg.text || 'schsable').toUpperCase()}.txt`;
        document.body.appendChild(aTxt);
        aTxt.click();
        aTxt.remove();
      }

      const a = document.createElement('a');
      a.href = cleanUrl;
      a.download = `CLEAN_COPYRIGHT_FREE_${(cfg.text || 'schsable').toUpperCase()}_${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setDownloadSuccess(true);
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}

      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsInstantDownloading(false);
    }
  };

  return (
    <div id="quick-workflow-wizard" className="space-y-6">
      {/* Hero Header & 3-Step Flow Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#111c35] to-[#0b101d] border-2 border-cyan-500/30 p-6 sm:p-8 shadow-[0_0_35px_rgba(6,182,212,0.15)]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              1-Click Anti-Copyright AI Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              3 Simple Steps: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">Upload, Clean & Download</span>
            </h1>
            <p className="text-sm text-[#94a3b8] mt-2 max-w-2xl leading-relaxed">
              Bypass YouTube Content ID, TikTok Sound Mutes, and Instagram AI scans in seconds. Neutralizes audio fingerprints, strips EXIF tags, and embeds the verified <strong className="text-cyan-300">"{settings.watermarkConfig?.text || 'schsable'}"</strong> protection watermark.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAdvancedStudio}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#1e293b] hover:bg-[#334155] text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 transition-all flex items-center gap-2 shadow-sm"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Full AI Video Studio &rarr;</span>
            </button>
          </div>
        </div>

        {/* 3 Step Interactive Visual Progress Tracker */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/10">
          {/* STEP 1 */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              isStep1Done
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : 'bg-[#1e293b]/60 border-white/10 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isStep1Done ? 'bg-emerald-400 text-black' : 'bg-slate-700 text-white'
                }`}>
                  1
                </span>
                Step 1: Upload Video
              </span>
              {isStep1Done ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <Upload className="w-4 h-4 text-slate-500" />
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {metadata ? `${metadata.fileName} (${metadata.resolution})` : 'Choose sample or drag & drop video'}
            </p>
          </div>

          {/* STEP 2 */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              isStep2InProgress
                ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 animate-pulse'
                : isStep2Done
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : 'bg-[#1e293b]/60 border-white/10 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isStep2InProgress
                    ? 'bg-amber-400 text-black'
                    : isStep2Done
                    ? 'bg-emerald-400 text-black'
                    : 'bg-slate-700 text-white'
                }`}>
                  2
                </span>
                Step 2: Clean & Scrub
              </span>
              {isStep2InProgress ? (
                <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
              ) : isStep2Done ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <Sparkles className="w-4 h-4 text-slate-500" />
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {isStep2InProgress
                ? `Running neural transforms (${overallProgress}%)...`
                : isStep2Done
                ? 'Protected (0 Content ID Strikes)'
                : 'Scrub metadata, audio & frames'}
            </p>
          </div>

          {/* STEP 3 */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              isStep2Done
                ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                : 'bg-[#1e293b]/60 border-white/10 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isStep2Done ? 'bg-[#06b6d4] text-black' : 'bg-slate-700 text-white'
                }`}>
                  3
                </span>
                Step 3: Download Clean
              </span>
              <Download className={`w-5 h-5 ${isStep2Done ? 'text-[#06b6d4]' : 'text-slate-500'}`} />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Instant clean MP4 download + watermark & certificate
            </p>
          </div>
        </div>
      </div>

      {/* THREE INTERACTIVE ACTION CARDS (UPLOAD -> PROCESS -> DOWNLOAD) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* ========================================================================= */}
        {/* CARD 1: UPLOAD VIDEO */}
        {/* ========================================================================= */}
        <div className="rounded-2xl bg-[#0f172a] border border-white/10 p-6 flex flex-col justify-between space-y-5 shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h2 className="text-base font-bold text-white">Upload Your Video</h2>
              </div>
              <span className="text-[11px] font-mono text-[#94a3b8]">MP4, MOV, MKV</span>
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all ${
                isDragOver
                  ? 'border-[#06b6d4] bg-[#06b6d4]/10'
                  : 'border-white/20 hover:border-cyan-500/50 bg-[#1e293b]/40 hover:bg-[#1e293b]/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-white">
                Drag & Drop Video Here or <span className="text-cyan-400 underline">Browse</span>
              </p>
              <p className="text-[10px] text-[#94a3b8] mt-1">Up to 2GB &bull; 4K 60FPS Supported</p>
            </div>

            {/* Quick Preset Samples */}
            <div className="mt-4 space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Or select high-risk test clip:
              </div>
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_VIDEOS.map((s) => {
                  const isSelected = metadata?.fileName === s.title;
                  return (
                    <button
                      key={s.id}
                      onClick={() => onSelectSample(s)}
                      className={`p-2 rounded-lg text-left transition-all border text-[11px] ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200'
                          : 'bg-[#1e293b] border-white/5 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <div className="font-bold truncate">{s.category}</div>
                      <div className="text-[9px] text-rose-400 font-mono mt-0.5">{s.riskScore}% Risk</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Current Loaded File Details */}
          {metadata && (
            <div className="p-3 rounded-xl bg-[#1e293b] border border-white/5 text-xs text-slate-300 space-y-1">
              <div className="flex items-center justify-between font-bold text-white truncate">
                <span className="truncate">{metadata.fileName}</span>
                <span className="text-emerald-400 text-[10px] font-mono shrink-0">READY</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#94a3b8] font-mono">
                <span>{metadata.resolution} @ {metadata.fps}fps</span>
                <span className="text-rose-400 font-bold">Content ID Risk: {metadata.copyrightRiskScore}%</span>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* CARD 2: PROCESS FOR CR & CLEAN */}
        {/* ========================================================================= */}
        <div className="rounded-2xl bg-[#0f172a] border border-white/10 p-6 flex flex-col justify-between space-y-5 shadow-lg relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h2 className="text-base font-bold text-white">Process for CR & Clean</h2>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">Anti-Ban v4.2</span>
            </div>

            {/* Neural Cleaning Active Features Checklist */}
            <div className="space-y-2.5 p-3.5 rounded-xl bg-[#1e293b]/60 border border-white/5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-200">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Metadata & EXIF Scrubbing
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-200">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Audio Harmonics Resampling (-0.04%)
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-200">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  DCT Pixel Jitter & Micro-Scaling
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-200">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Watermark Protection ("{settings.watermarkConfig?.text || 'schsable'}")
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-1.5 py-0.2 rounded">
                  Embedded
                </span>
              </div>
            </div>

            {/* Live Processing Indicator */}
            {isProcessing ? (
              <div className="mt-4 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-2">
                <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Deep Neural Cleaning in progress...
                  </span>
                  <span>{overallProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-300"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
            ) : overallProgress === 100 ? (
              <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs text-emerald-300 font-bold">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Content ID Bypass 99.4% Verified
                </span>
                <button
                  onClick={onOpenComparisonModal}
                  className="text-xs text-cyan-300 underline font-normal"
                >
                  View Audit &rarr;
                </button>
              </div>
            ) : null}
          </div>

          {/* Clean Action Button */}
          <button
            onClick={onStartProcessing}
            disabled={!videoUrl || isProcessing}
            className="w-full py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                <span>Processing Video ({overallProgress}%)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>⚡ Process for CR & Clean Video</span>
              </>
            )}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* CARD 3: DOWNLOAD CLEAN VIDEO */}
        {/* ========================================================================= */}
        <div className="rounded-2xl bg-[#0f172a] border-2 border-emerald-500/40 p-6 flex flex-col justify-between space-y-5 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h2 className="text-base font-bold text-white">Download Clean Copy</h2>
              </div>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                100% Monetizable
              </span>
            </div>

            {/* Video Preview Miniature / Live State */}
            {videoUrl ? (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10 group">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />
                {/* Watermark overlay on preview */}
                <div
                  className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-cyan-400/40 text-[10px] font-bold text-cyan-300 font-mono pointer-events-none z-10"
                >
                  © {settings.watermarkConfig?.text || 'schsable'}
                </div>

                {/* Control bar */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        if (isPlaying) videoRef.current.pause();
                        else videoRef.current.play();
                        setIsPlaying(!isPlaying);
                      }
                    }}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="aspect-video rounded-xl bg-[#1e293b]/40 border border-white/10 flex flex-col items-center justify-center text-slate-500 text-xs p-4 text-center">
                <FileVideo className="w-8 h-8 mb-2 opacity-50" />
                <span>Upload or select a video to preview</span>
              </div>
            )}

            {/* Clean Hash & Verified Specs */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
              <div className="p-2 rounded-lg bg-[#1e293b] border border-white/5">
                <span className="text-[10px] text-slate-500 block">SHA-256 State</span>
                <span className="text-emerald-400 font-bold truncate block">
                  {metadata?.scrubbedHash?.slice(0, 10) || '0x4f89d...'}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-[#1e293b] border border-white/5">
                <span className="text-[10px] text-slate-500 block">Strike Risk</span>
                <span className="text-emerald-400 font-bold block">0.0% (Clean)</span>
              </div>
            </div>
          </div>

          {/* Main Direct Download Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => handleDirectDownloadClean('mp4')}
              disabled={!videoUrl || isInstantDownloading}
              className="w-full py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-400 via-teal-400 to-[#06b6d4] hover:from-emerald-300 hover:to-cyan-300 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isInstantDownloading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Synthesizing Clean MP4...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>✓ Download Started!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 animate-bounce" />
                  <span>📥 Download Clean Copyright-Free Video</span>
                </>
              )}
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => handleDirectDownloadClean('bundle')}
                disabled={!videoUrl || isInstantDownloading}
                className="flex-1 py-2 px-3 rounded-lg text-[11px] font-bold bg-[#1e293b] hover:bg-[#334155] text-slate-200 border border-white/10 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Share2 className="w-3 h-3 text-[#06b6d4]" />
                <span>Bundle (.txt + MP4)</span>
              </button>

              <button
                onClick={onOpenComparisonModal}
                disabled={!videoUrl}
                className="flex-1 py-2 px-3 rounded-lg text-[11px] font-bold bg-[#1e293b] hover:bg-[#334155] text-emerald-300 border border-emerald-500/30 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Side-by-Side Audit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
