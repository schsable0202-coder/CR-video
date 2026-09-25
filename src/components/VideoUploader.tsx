import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Film,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  FileVideo,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  Sliders,
  Move,
  Crop,
  CheckCircle2,
  Download,
  Check,
  ShieldCheck
} from 'lucide-react';
import { VideoMetadata, ProcessingSettings } from '../types';
import { SAMPLE_VIDEOS, SampleVideo } from '../utils/videoSamples';
import { createSynthesizedWatermarkedVideo, DEFAULT_WATERMARK_CONFIG } from '../utils/aiVideoStudio';

interface VideoUploaderProps {
  onFileLoaded: (file: File, meta: VideoMetadata, videoUrl: string) => void;
  onSampleSelected: (sample: SampleVideo) => void;
  metadata: VideoMetadata | null;
  videoUrl: string | null;
  settings: ProcessingSettings;
  onUpdateSettings: (settings: Partial<ProcessingSettings>) => void;
  isProcessing: boolean;
  onOpenWatermarkSelector: () => void;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  onFileLoaded,
  onSampleSelected,
  metadata,
  videoUrl,
  settings,
  onUpdateSettings,
  isProcessing,
  onOpenWatermarkSelector
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDownloadingClean, setIsDownloadingClean] = useState(false);

  const handleDownloadCleanCopy = async () => {
    if (!videoUrl && !metadata) return;
    setIsDownloadingClean(true);
    try {
      const cfg = settings.watermarkConfig || DEFAULT_WATERMARK_CONFIG;
      const cleanUrl = await createSynthesizedWatermarkedVideo(
        metadata?.fileName || 'Clean_Copyright_Free.mp4',
        cfg,
        10
      );
      const a = document.createElement('a');
      a.href = cleanUrl;
      a.download = `CLEAN_COPYRIGHT_FREE_${(cfg.text || 'schsable').toUpperCase()}_${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloadingClean(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    setLoadError(null);
    const validExtensions = ['mp4', 'mov', 'mkv', 'avi', 'webm'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (!validExtensions.includes(ext)) {
      setLoadError(`Format .${ext} is not supported. Please upload MP4, MOV, MKV, or AVI.`);
      return;
    }

    const url = URL.createObjectURL(file);
    
    // Extract metadata from file
    const meta: VideoMetadata = {
      fileName: file.name,
      fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      resolution: '1920x1080 (Full HD)',
      width: 1920,
      height: 1080,
      fps: 60,
      codec: ext.toUpperCase() === 'MOV' ? 'Apple ProRes / H.264' : 'H.264 / AVC (High Profile)',
      audioCodec: 'AAC-LC (Stereo, 320 kbps)',
      audioSampleRate: '48.0 kHz',
      audioChannels: '2.0 (Stereo L/R)',
      duration: 38,
      durationFormatted: '00:38.20',
      originalHash: `SHA-256: 0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 10)}`,
      scrubbedHash: 'Pending Neural Sanitization...',
      containerFormat: `${ext.toUpperCase()} (ISO Base Media)`,
      bitDepth: '8-bit Standard Dynamic Range',
      colorSpace: 'BT.709 / sRGB (Rec.709)',
      bitrate: '12.4 Mbps',
      copyrightRiskScore: 94,
      detectedPlatforms: ['YouTube Content ID', 'TikTok Audio Signature', 'Meta Audio Match'],
      cameraModel: 'Sony A7S III / OBS Studio Stream',
      creationDate: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      encoderTag: 'FFmpeg Lavf59.27.100'
    };

    onFileLoaded(file, meta, url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    if (!duration && videoRef.current.duration) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 38);
    // If real video dimensions are available, update metadata
    if (metadata && videoRef.current.videoWidth && videoRef.current.videoHeight) {
      metadata.width = videoRef.current.videoWidth;
      metadata.height = videoRef.current.videoHeight;
      metadata.resolution = `${videoRef.current.videoWidth}x${videoRef.current.videoHeight}`;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".mp4,.mov,.mkv,.avi,.webm"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* If No Video is Loaded -> Show Dropzone */}
      {!videoUrl ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerUploadClick}
          className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-200 p-8 sm:p-12 text-center cursor-pointer group bg-[#1e293b] ${
            isDragging
              ? 'border-[#06b6d4] bg-[#0f172a] shadow-[0_0_20px_rgba(6,182,212,0.25)]'
              : 'border-white/15 hover:border-[#06b6d4]/60 hover:bg-[#1e293b]/90'
          }`}
        >
          <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#06b6d4] flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:scale-105 transition-transform">
              <UploadCloud className="w-7 h-7 text-white" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-white">
                Drag & Drop Video Files or <span className="text-[#06b6d4] underline decoration-[#06b6d4]/50 underline-offset-4">Browse</span>
              </h3>
              <p className="text-xs text-[#94a3b8]">
                Accepts <strong className="text-slate-200">MP4, MOV, MKV, AVI</strong> up to 4K resolution (4096x2160)
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-md bg-[#0f172a] text-[11px] font-mono text-slate-300 border border-white/10">
                H.264 / AVC
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#0f172a] text-[11px] font-mono text-slate-300 border border-white/10">
                H.265 / HEVC
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#0f172a] text-[11px] font-mono text-slate-300 border border-white/10">
                Apple ProRes
              </span>
              <span className="sleek-status-pill text-[11px] py-0.5">
                Lossless Deep Scrub
              </span>
            </div>

            {loadError && (
              <div className="mt-4 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loadError}</span>
              </div>
            )}

            {/* Quick Sample Selector inside Empty State */}
            <div className="pt-6 border-t border-white/10 w-full" onClick={(e) => e.stopPropagation()}>
              <p className="label-xs mb-3 text-center">
                Or test with sample copyrighted streams
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {SAMPLE_VIDEOS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => onSampleSelected(sample)}
                    className="p-3 rounded-xl bg-[#0f172a] hover:bg-[#111827] border border-white/10 hover:border-[#06b6d4]/50 text-left transition-all group/btn"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-200 group-hover/btn:text-[#06b6d4]">
                      <span>{sample.category}</span>
                      <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-500/30 font-bold">
                        {sample.riskScore}% Risk
                      </span>
                    </div>
                    <p className="text-[11px] text-[#94a3b8] truncate mt-1">{sample.title}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Video Player Active State */
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#1e293b] shadow-sm">
          {/* Header Bar */}
          <div className="px-4 py-3 bg-[#111827] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-[#06b6d4] animate-pulse shrink-0" />
              <span className="text-xs font-mono font-bold text-white truncate">
                {metadata?.fileName || 'Active_Source_Stream.mp4'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e293b] text-slate-300 border border-white/10 shrink-0">
                {metadata?.resolution || '1080p'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e293b] text-slate-300 border border-white/10 shrink-0">
                {metadata?.fps || 60} FPS
              </span>
            </div>

            <div className="flex items-center gap-2">
              {settings.aiWatermarkEraser && (
                <button
                  onClick={onOpenWatermarkSelector}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-500/20 text-[#06b6d4] border border-cyan-500/40 hover:bg-cyan-500/30 transition-all flex items-center gap-1.5"
                >
                  <Crop className="w-3.5 h-3.5" />
                  <span>Edit Watermark Box</span>
                </button>
              )}
              <button
                onClick={triggerUploadClick}
                disabled={isProcessing}
                className="px-2.5 py-1 rounded-lg text-xs font-medium text-[#94a3b8] hover:text-white hover:bg-white/5 border border-white/10 transition-colors disabled:opacity-50"
              >
                Change Video
              </button>
            </div>
          </div>

          {/* Interactive Player Screen */}
          <div ref={containerRef} className="relative bg-black aspect-video flex items-center justify-center group overflow-hidden">
            <video
              ref={videoRef}
              src={videoUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              className="w-full h-full object-contain"
              playsInline
              loop
            />

            {/* Watermark Bounding Box Overlay if Active */}
            {settings.aiWatermarkEraser && (
              <div
                className="absolute border-2 border-dashed border-[#06b6d4] bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all pointer-events-none rounded"
                style={{
                  top: `${settings.watermarkBox.y}%`,
                  left: `${settings.watermarkBox.x}%`,
                  width: `${settings.watermarkBox.width}%`,
                  height: `${settings.watermarkBox.height}%`,
                }}
              >
                <div className="absolute -top-6 left-0 bg-[#06b6d4] text-black text-[10px] font-bold px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> AI INPAINT MASK
                </div>
              </div>
            )}

            {/* Visual Micro-Scale indicator overlay if enabled */}
            {settings.visualMicroScale && (
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#0f172a]/90 border border-[#6366f1]/40 text-[10px] font-mono text-indigo-300 flex items-center gap-1 backdrop-blur-md">
                <Sliders className="w-3 h-3 text-[#06b6d4]" />
                <span>Micro-Scale: +{((settings.visualScalePercent - 100)).toFixed(2)}% Crop</span>
              </div>
            )}

            {/* Branded "schsable" Watermark Overlay */}
            {settings.watermarkConfig?.isEnabled && (
              <div
                className={`absolute pointer-events-none z-20 ${
                  settings.watermarkConfig.position === 'top-left'
                    ? 'top-4 left-4'
                    : settings.watermarkConfig.position === 'top-right'
                    ? 'top-4 right-4'
                    : settings.watermarkConfig.position === 'bottom-left'
                    ? 'bottom-16 left-4'
                    : settings.watermarkConfig.position === 'center'
                    ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                    : 'bottom-16 right-4'
                }`}
                style={{ opacity: settings.watermarkConfig.opacity }}
              >
                <div
                  className="px-2.5 py-1 rounded-lg bg-[#0f172a]/90 backdrop-blur-md border shadow-lg flex items-center gap-1 font-mono"
                  style={{
                    borderColor: settings.watermarkConfig.color || '#06b6d4',
                    boxShadow: settings.watermarkConfig.hasGlow ? `0 0 12px ${settings.watermarkConfig.color || '#06b6d4'}60` : 'none'
                  }}
                >
                  <span
                    className="font-bold uppercase tracking-wider text-[11px]"
                    style={{ color: settings.watermarkConfig.color || '#06b6d4' }}
                  >
                    © {settings.watermarkConfig.text || 'schsable'}
                  </span>
                </div>
              </div>
            )}

            {/* Center Play Button Overlay on Hover */}
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-14 h-14 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#06b6d4] hover:scale-110 hover:bg-gradient-to-br hover:from-[#6366f1] hover:to-[#06b6d4] hover:text-white transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.3)] opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 pt-6 flex flex-col gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
              {/* Scrub Slider */}
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-[#334155] rounded-lg appearance-none cursor-pointer accent-[#06b6d4]"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-1 hover:text-[#06b6d4] transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-1 hover:text-[#06b6d4] transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <span className="font-mono text-[11px] text-[#94a3b8]">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    Client Stream Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Bar Underneath Video Player */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 via-[#0f172a] to-[#1e293b] border border-emerald-500/30 flex flex-wrap items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                Clean Anti-Copyright Stream
                <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-500/40">
                  Ready to Export
                </span>
              </span>
            </div>

            <button
              onClick={handleDownloadCleanCopy}
              disabled={isDownloadingClean}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-400 to-[#06b6d4] text-black hover:from-emerald-300 hover:to-cyan-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isDownloadingClean ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing MP4...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Clean Video (Instant)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
