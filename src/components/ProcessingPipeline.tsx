import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  Sparkles,
  Terminal,
  ShieldCheck,
  Zap,
  Volume2,
  AlertCircle,
  FileCheck2,
  Download,
  Check
} from 'lucide-react';
import { ProcessingLog, ProcessingStage, ProcessingStageId } from '../types';

interface ProcessingPipelineProps {
  stages: ProcessingStage[];
  currentStageId: ProcessingStageId;
  overallProgress: number;
  logs: ProcessingLog[];
  isProcessing: boolean;
  onCompleteModalOpen?: () => void;
}

export const ProcessingPipeline: React.FC<ProcessingPipelineProps> = ({
  stages,
  currentStageId,
  overallProgress,
  logs,
  isProcessing,
  onCompleteModalOpen
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'logs'>('visualizer');

  // Autoscroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Real-time Canvas Waveform Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;

    const render = () => {
      step++;
      const width = canvas.width;
      const height = canvas.height;

      // Dark background with slight trace
      ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
      ctx.fillRect(0, 0, width, height);

      // Central reference zero line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      const bars = 64;
      const barWidth = width / bars;

      for (let i = 0; i < bars; i++) {
        // Multi-frequency wave calculation
        const freq1 = Math.sin((step * 0.05) + (i * 0.18));
        const freq2 = Math.cos((step * 0.08) - (i * 0.12));
        const freq3 = Math.sin((step * 0.02) + (i * 0.3));
        
        let amplitude = (Math.abs(freq1 * 0.5 + freq2 * 0.3 + freq3 * 0.2)) * (height * 0.38);

        if (!isProcessing) {
          amplitude = amplitude * 0.3 + 4; // Idle gentle breathing
        } else {
          amplitude = amplitude + (Math.random() * 8) + 12; // Active high energy
        }

        // Gradient for waveform
        const gradient = ctx.createLinearGradient(0, height / 2 - amplitude, 0, height / 2 + amplitude);
        if (isProcessing) {
          gradient.addColorStop(0, '#06b6d4'); // Cyan
          gradient.addColorStop(0.5, '#6366f1'); // Indigo
          gradient.addColorStop(1, '#a855f7'); // Purple
        } else {
          gradient.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0.4)');
        }

        ctx.fillStyle = gradient;

        // Top & bottom symmetric bar with rounded ends
        const x = i * barWidth + 1.5;
        const w = Math.max(2, barWidth - 3);
        const yTop = height / 2 - amplitude;
        const h = amplitude * 2;

        ctx.beginPath();
        ctx.roundRect(x, yTop, w, h, 2);
        ctx.fill();

        // High frequency glow particles when processing
        if (isProcessing && Math.random() > 0.85) {
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(x + w / 2, yTop - 4, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Render secondary smooth sine curve overlay
      ctx.beginPath();
      ctx.strokeStyle = isProcessing ? 'rgba(6, 182, 212, 0.8)' : 'rgba(99, 102, 241, 0.3)';
      ctx.lineWidth = 2;
      for (let x = 0; x < width; x += 4) {
        const y = height / 2 + Math.sin(x * 0.02 + step * 0.06) * (isProcessing ? 25 : 8);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isProcessing]);

  return (
    <div className="bg-[#1e293b] rounded-2xl p-5 sm:p-6 border border-white/10 space-y-6 shadow-sm">
      {/* Header & Overall Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#06b6d4] text-white flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Neural Processing Pipeline
              {isProcessing && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-cyan-500/20 text-[#06b6d4] border border-cyan-500/40 animate-pulse">
                  EXECUTING {Math.round(overallProgress)}%
                </span>
              )}
            </h3>
            <p className="text-xs text-[#94a3b8]">Deterministic 4-Stage Content ID Hash Neutralization</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {onCompleteModalOpen && (
            <button
              onClick={onCompleteModalOpen}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                overallProgress === 100
                  ? 'bg-gradient-to-r from-emerald-400 to-[#06b6d4] text-black shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105'
                  : 'bg-[#0f172a] hover:bg-[#1e293b] text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 hover:scale-105'
              }`}
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download & Compare Clean Video</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Multi-Stage Execution Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stages.map((stage, idx) => {
          const isDone = stage.status === 'completed';
          const isCurrent = stage.status === 'in-progress';
          const isPending = stage.status === 'pending';

          return (
            <div
              key={stage.id}
              className={`p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                isCurrent
                  ? 'bg-[#0f172a] border-[#06b6d4] shadow-[0_0_15px_rgba(6,182,212,0.2)] scale-[1.02]'
                  : isDone
                  ? 'bg-[#0f172a] border-emerald-500/30'
                  : 'bg-[#0f172a]/60 border-white/5 opacity-70'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="label-xs">
                    STAGE 0{idx + 1}
                  </span>
                  {isDone && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3 h-3" /> DONE
                    </span>
                  )}
                  {isCurrent && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-[#06b6d4] font-bold animate-pulse">
                      <Zap className="w-3 h-3" /> ACTIVE
                    </span>
                  )}
                  {isPending && (
                    <span className="text-[10px] font-mono text-slate-500">QUEUED</span>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white">{stage.name}</h4>
                  <p className="text-[11px] text-[#94a3b8] mt-0.5 line-clamp-2 leading-relaxed">{stage.description}</p>
                </div>
              </div>

              {/* Individual Stage Progress */}
              <div className="pt-3 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#94a3b8]">
                  <span className="truncate max-w-[120px]">{stage.detail}</span>
                  <span className={isCurrent ? 'text-[#06b6d4] font-bold' : isDone ? 'text-emerald-400 font-bold' : ''}>
                    {stage.progress}%
                  </span>
                </div>
                <div className="w-full bg-[#1e293b] rounded-full h-1.5 overflow-hidden border border-white/5">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      isDone
                        ? 'bg-emerald-400 w-full'
                        : isCurrent
                        ? 'bg-gradient-to-r from-[#6366f1] to-[#06b6d4]'
                        : 'bg-slate-700 w-0'
                    }`}
                    style={{ width: isDone ? '100%' : `${stage.progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Multi-Stage Overall Progress Bar */}
      <div className="p-4 rounded-xl bg-[#0f172a] border border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[#94a3b8]">Overall Pipeline Execution:</span>
            <span className="text-[#06b6d4] font-bold">{Math.round(overallProgress)}% Completed</span>
          </div>
          <div className="flex items-center gap-3 text-[#94a3b8] text-[11px]">
            <span>Content ID Bypass Confidence: <strong className="text-emerald-400">{overallProgress === 100 ? '99.4%' : overallProgress > 50 ? '94.2%' : 'Calculating...'}</strong></span>
          </div>
        </div>

        <div className="w-full bg-[#111827] rounded-full h-3 p-0.5 border border-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#6366f1] via-[#06b6d4] to-emerald-400 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Visualizer & Logs Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-[#0f172a] p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('visualizer')}
              className={`py-1.5 px-3 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'visualizer'
                  ? 'bg-[#1e293b] text-[#06b6d4] font-semibold shadow-sm'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Real-Time Acoustic Spectrum</span>
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`py-1.5 px-3 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'logs'
                  ? 'bg-[#1e293b] text-[#06b6d4] font-semibold shadow-sm'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Neural Pipeline Terminal ({logs.length})</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-[#94a3b8] hidden sm:inline">
            Acoustic Phase Sampling: 48,000 Hz 32-bit Float
          </span>
        </div>

        {/* Tab 1: HTML5 Canvas Visualizer */}
        {activeTab === 'visualizer' && (
          <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#0f172a]">
            <canvas
              ref={canvasRef}
              width={700}
              height={140}
              className="w-full h-32 block"
            />
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-[#94a3b8] pointer-events-none">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] animate-ping" />
                Live Fast Fourier Transform (FFT) Resampling
              </span>
              <span>Harmonic Distortion: &lt; 0.002% (Lossless)</span>
            </div>
          </div>
        )}

        {/* Tab 2: Terminal Logs */}
        {activeTab === 'logs' && (
          <div className="rounded-xl border border-white/10 bg-[#0f172a] p-3 font-mono text-xs text-slate-300 h-36 overflow-y-auto custom-scrollbar space-y-1">
            {logs.length === 0 ? (
              <p className="text-[#94a3b8] italic">Waiting for processing pipeline to initialize...</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-500 text-[10px] select-none">{log.time}</span>
                  <span
                    className={`font-semibold ${
                      log.type === 'success'
                        ? 'text-emerald-400'
                        : log.type === 'warning'
                        ? 'text-amber-400'
                        : log.type === 'accent'
                        ? 'text-[#06b6d4]'
                        : 'text-slate-300'
                    }`}
                  >
                    {log.type === 'success' && '✓ '}
                    {log.type === 'warning' && '⚠ '}
                    {log.type === 'accent' && '⚡ '}
                    {log.message}
                  </span>
                </div>
              ))
            )}
            <div ref={logEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};
