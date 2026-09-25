import React from 'react';
import {
  Shield,
  Sliders,
  Sparkles,
  Volume2,
  Crop,
  Radio,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Eye,
  Layers,
  Wand2
} from 'lucide-react';
import { ProcessingSettings } from '../types';

interface ProcessingControlsProps {
  settings: ProcessingSettings;
  onChange: (settings: Partial<ProcessingSettings>) => void;
  onStartProcessing: () => void;
  isProcessing: boolean;
  onOpenWatermarkModal: () => void;
  disabled: boolean;
}

export const ProcessingControls: React.FC<ProcessingControlsProps> = ({
  settings,
  onChange,
  onStartProcessing,
  isProcessing,
  onOpenWatermarkModal,
  disabled
}) => {
  const resetToRecommended = () => {
    onChange({
      metadataScrubbing: true,
      audioPitchShift: -0.04,
      audioPhaseShift: true,
      visualMicroScale: true,
      visualScalePercent: 100.35,
      colorGradingShift: 1.5,
      aiWatermarkEraser: false,
      adversarialNoise: 'medium',
      temporalFrameJitter: true,
      removeGeoTags: true,
      stripEncoderMetadata: true
    });
  };

  return (
    <div className="bg-[#1e293b] rounded-2xl p-5 sm:p-6 border border-white/10 space-y-6 shadow-sm">
      {/* Title & Preset Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#06b6d4] text-white flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Anti-Copyright Controls
              <span className="sleek-status-pill text-[11px] py-0.5 px-2">
                Active Matrix
              </span>
            </h2>
            <p className="text-xs text-[#94a3b8]">Configure neural algorithms to bypass Content ID & acoustic hashes</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetToRecommended}
            disabled={isProcessing || disabled}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-[#0f172a] hover:bg-slate-800 border border-white/10 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#06b6d4]" />
            <span>Optimal Preset</span>
          </button>
        </div>
      </div>

      {/* Control Grid */}
      <div className="space-y-3.5">
        {/* 1. Metadata & EXIF Deep Scrubbing */}
        <div className="p-4 rounded-xl bg-[#0f172a] border border-white/10 space-y-3 transition-all hover:border-white/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#6366f1]/10 text-[#6366f1] mt-0.5">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white">Metadata & EXIF Deep Scrubbing</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-semibold border border-emerald-500/30">
                    Essential
                  </span>
                </div>
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  Strips digital camera serials, GPS geo-tags, Adobe/FFmpeg encoder atoms, and container timestamps.
                </p>
              </div>
            </div>

            {/* Custom Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={settings.metadataScrubbing}
                onChange={(e) => onChange({ metadataScrubbing: e.target.checked })}
                disabled={isProcessing || disabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#334155] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#06b6d4] border border-white/10" />
            </label>
          </div>

          {settings.metadataScrubbing && (
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono text-[#94a3b8]">
              <span className="flex items-center gap-1 bg-[#1e293b] px-2 py-0.5 rounded border border-white/10 text-slate-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Strip UUID Atom
              </span>
              <span className="flex items-center gap-1 bg-[#1e293b] px-2 py-0.5 rounded border border-white/10 text-slate-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Neutralize moov atom
              </span>
              <span className="flex items-center gap-1 bg-[#1e293b] px-2 py-0.5 rounded border border-white/10 text-slate-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Wipe GPS Exif
              </span>
            </div>
          )}
        </div>

        {/* 2. Micro Audio Pitch & Frequency Shift */}
        <div className="p-4 rounded-xl bg-[#0f172a] border border-white/10 space-y-3 transition-all hover:border-white/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#06b6d4]/10 text-[#06b6d4] mt-0.5">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white">Micro Audio Pitch & Frequency Shift</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-[#06b6d4] border border-cyan-500/30 font-semibold">
                    {settings.audioPitchShift > 0 ? `+${settings.audioPitchShift}%` : `${settings.audioPitchShift}%`} (Inaudible)
                  </span>
                </div>
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  Sub-perceptual ±0.1% pitch and phase modification to misalign acoustic spectrogram matching.
                </p>
              </div>
            </div>
          </div>

          {/* Range Slider */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs font-mono text-[#94a3b8]">
              <span>-0.10% (Sub-Bass)</span>
              <span className="text-[#06b6d4] font-semibold">Recommended: -0.04%</span>
              <span>+0.10% (Treble)</span>
            </div>
            <input
              type="range"
              min="-0.10"
              max="0.10"
              step="0.01"
              value={settings.audioPitchShift}
              onChange={(e) => onChange({ audioPitchShift: parseFloat(e.target.value) })}
              disabled={isProcessing || disabled}
              className="w-full h-1.5 bg-[#334155] rounded-lg appearance-none cursor-pointer accent-[#06b6d4]"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.audioPhaseShift}
                onChange={(e) => onChange({ audioPhaseShift: e.target.checked })}
                disabled={isProcessing || disabled}
                className="rounded border-slate-700 text-[#06b6d4] focus:ring-[#06b6d4] bg-slate-800"
              />
              <span>Harmonic Phase Inversion (Defeats YouTube & TikTok audio matchers)</span>
            </label>
          </div>
        </div>

        {/* 3. Visual Frame Micro-Scaling & Color Grading Shift */}
        <div className="p-4 rounded-xl bg-[#0f172a] border border-white/10 space-y-3 transition-all hover:border-white/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#6366f1]/10 text-[#6366f1] mt-0.5">
                <Crop className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white">Visual Frame Micro-Scaling & Chromatic Shift</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-semibold border border-indigo-500/30">
                    DCT Disruptor
                  </span>
                </div>
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  Applies fractional 100.35% crop and sub-visual gamma LUT curve to bypass video fingerprint algorithms.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={settings.visualMicroScale}
                onChange={(e) => onChange({ visualMicroScale: e.target.checked })}
                disabled={isProcessing || disabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#334155] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#06b6d4] border border-white/10" />
            </label>
          </div>

          {settings.visualMicroScale && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-mono text-[#94a3b8]">
                <span>Micro Crop Scale:</span>
                <span className="text-[#06b6d4] font-bold">{settings.visualScalePercent}%</span>
              </div>
              <input
                type="range"
                min="100.1"
                max="101.5"
                step="0.05"
                value={settings.visualScalePercent}
                onChange={(e) => onChange({ visualScalePercent: parseFloat(e.target.value) })}
                disabled={isProcessing || disabled}
                className="w-full h-1.5 bg-[#334155] rounded-lg appearance-none cursor-pointer accent-[#6366f1]"
              />
            </div>
          )}
        </div>

        {/* 4. Spatial AI Watermark / Logo Eraser */}
        <div className="p-4 rounded-xl bg-[#0f172a] border border-white/10 space-y-3 transition-all hover:border-white/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 mt-0.5">
                <Crop className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white">Spatial AI Watermark & Logo Inpainter</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-mono font-semibold border border-pink-500/30">
                    Neural Diffusion
                  </span>
                </div>
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  Select broadcaster logos, channel overlays, or station IDs to seamlessly inpaint with optical flow synthesis.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={settings.aiWatermarkEraser}
                onChange={(e) => onChange({ aiWatermarkEraser: e.target.checked })}
                disabled={isProcessing || disabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#334155] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#06b6d4] border border-white/10" />
            </label>
          </div>

          {settings.aiWatermarkEraser && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#1e293b] border border-cyan-500/30">
              <div className="text-xs text-cyan-300 font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse" />
                <span>Target Region: [{settings.watermarkBox.x}%, {settings.watermarkBox.y}%] &bull; {settings.watermarkBox.width}%×{settings.watermarkBox.height}%</span>
              </div>
              <button
                onClick={onOpenWatermarkModal}
                disabled={isProcessing || disabled}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 transition-colors flex items-center gap-1.5"
              >
                <Crop className="w-3.5 h-3.5" />
                <span>Adjust Region</span>
              </button>
            </div>
          )}
        </div>

        {/* 4b. Branded Watermark Overlay ("schsable") */}
        <div className="p-4 rounded-xl bg-[#0f172a] border border-white/10 space-y-3 transition-all hover:border-white/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-[#06b6d4] mt-0.5">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white">Embed "schsable" Watermark</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-semibold border border-cyan-500/30">
                    Branded Overlay
                  </span>
                </div>
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  Overlays your custom brand signature (Default: "schsable") onto processed master outputs.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={settings.watermarkConfig?.isEnabled ?? true}
                onChange={(e) =>
                  onChange({
                    watermarkConfig: {
                      ...(settings.watermarkConfig || {
                        isEnabled: true,
                        text: 'schsable',
                        position: 'bottom-right',
                        opacity: 0.85,
                        fontSize: 20,
                        fontStyle: 'cyber',
                        color: '#06b6d4',
                        hasGlow: true,
                        badgeStyle: 'pill-badge'
                      }),
                      isEnabled: e.target.checked
                    }
                  })
                }
                disabled={isProcessing || disabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#334155] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#06b6d4] border border-white/10" />
            </label>
          </div>

          {(settings.watermarkConfig?.isEnabled ?? true) && (
            <div className="p-3 rounded-xl bg-[#1e293b] border border-cyan-500/20 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="label-xs">Watermark Text</span>
                  <input
                    type="text"
                    value={settings.watermarkConfig?.text ?? 'schsable'}
                    onChange={(e) =>
                      onChange({
                        watermarkConfig: {
                          ...(settings.watermarkConfig || {
                            isEnabled: true,
                            text: 'schsable',
                            position: 'bottom-right',
                            opacity: 0.85,
                            fontSize: 20,
                            fontStyle: 'cyber',
                            color: '#06b6d4',
                            hasGlow: true,
                            badgeStyle: 'pill-badge'
                          }),
                          text: e.target.value
                        }
                      })
                    }
                    className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#06b6d4]"
                  />
                </div>
                <div>
                  <span className="label-xs">Position</span>
                  <select
                    value={settings.watermarkConfig?.position ?? 'bottom-right'}
                    onChange={(e) =>
                      onChange({
                        watermarkConfig: {
                          ...(settings.watermarkConfig || {
                            isEnabled: true,
                            text: 'schsable',
                            position: 'bottom-right',
                            opacity: 0.85,
                            fontSize: 20,
                            fontStyle: 'cyber',
                            color: '#06b6d4',
                            hasGlow: true,
                            badgeStyle: 'pill-badge'
                          }),
                          position: e.target.value as any
                        }
                      })
                    }
                    className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-2 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#06b6d4]"
                  >
                    <option value="bottom-right">Bottom-Right</option>
                    <option value="bottom-left">Bottom-Left</option>
                    <option value="top-right">Top-Right</option>
                    <option value="top-left">Top-Left</option>
                    <option value="center">Center</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. Adversarial AI Noise Injection */}
        <div className="p-4 rounded-xl bg-[#0f172a] border border-white/10 space-y-3 transition-all hover:border-white/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white">Adversarial AI Noise Injection</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-semibold border border-emerald-500/30">
                    Zero-Loss Perceptual
                  </span>
                </div>
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  Injects mathematical imperceptible high-frequency gradients that confuse neural network classification weights.
                </p>
              </div>
            </div>
          </div>

          {/* Segmented Mode Selector */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {(['off', 'low', 'medium', 'high'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => onChange({ adversarialNoise: level })}
                disabled={isProcessing || disabled}
                className={`py-2 px-3 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                  settings.adversarialNoise === level
                    ? 'bg-gradient-to-r from-[#6366f1] to-[#06b6d4] text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'bg-[#1e293b] text-[#94a3b8] hover:text-white border border-white/10'
                }`}
              >
                {level === 'off' ? 'Disabled' : `${level} Noise`}
              </button>
            ))}
          </div>
        </div>

        {/* Export Resolution & Format */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="space-y-1.5">
            <label className="label-xs">Target Output Resolution</label>
            <select
              value={settings.outputResolution}
              onChange={(e) => onChange({ outputResolution: e.target.value as any })}
              disabled={isProcessing || disabled}
              className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#06b6d4]"
            >
              <option value="original">Match Source Resolution (Lossless)</option>
              <option value="1080p">1080p Full HD (1920x1080)</option>
              <option value="4K">4K UHD Master (3840x2160)</option>
              <option value="720p">720p Optimized (1280x720)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="label-xs">Encoding Container</label>
            <select
              value={settings.outputFormat}
              onChange={(e) => onChange({ outputFormat: e.target.value as any })}
              disabled={isProcessing || disabled}
              className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#06b6d4]"
            >
              <option value="mp4">MP4 (H.264 / AAC - Universal Web)</option>
              <option value="mov">MOV (Apple ProRes / H.265 Master)</option>
              <option value="mkv">MKV (Matroska Deep-Cleaned)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2">
        <button
          onClick={onStartProcessing}
          disabled={isProcessing || disabled}
          className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs tracking-wider transition-all duration-200 flex items-center justify-center gap-2 uppercase ${
            disabled
              ? 'bg-[#334155] text-slate-500 cursor-not-allowed border border-white/5'
              : isProcessing
              ? 'bg-[#0f172a] text-[#06b6d4] border border-[#06b6d4] shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              : 'btn-sleek-primary'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-[#06b6d4] border-t-transparent rounded-full animate-spin" />
              <span>Neural Pipeline Running...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Start AI Processing & Bypass</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
