import React, { useState } from 'react';
import {
  FileText,
  Hash,
  Activity,
  Layers,
  Cpu,
  Check,
  Copy,
  AlertTriangle,
  Music,
  Video,
  Info,
  ShieldAlert,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { VideoMetadata } from '../types';

interface MetadataInspectorProps {
  metadata: VideoMetadata | null;
  isProcessing: boolean;
}

export const MetadataInspector: React.FC<MetadataInspectorProps> = ({
  metadata,
  isProcessing
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [activeTab, setActiveTab] = useState<'stream' | 'signatures' | 'audio'>('stream');
  const [isExpanded, setIsExpanded] = useState(true);

  if (!metadata) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const riskColor =
    metadata.copyrightRiskScore > 80
      ? 'text-rose-400 bg-rose-950/40 border-rose-500/30'
      : metadata.copyrightRiskScore > 50
      ? 'text-amber-400 bg-amber-950/40 border-amber-500/30'
      : 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';

  return (
    <div className="bg-[#1e293b] rounded-2xl p-5 border border-white/10 space-y-4 shadow-sm">
      {/* Panel Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#06b6d4] text-white flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Metadata & Stream Inspector</h3>
            <p className="text-[11px] text-[#94a3b8] font-mono">Real-time Header & Atom Dissection</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border flex items-center gap-1.5 ${riskColor}`}>
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{metadata.copyrightRiskScore}% Risk Level</span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-white/5 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1 bg-[#0f172a] p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('stream')}
              className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all ${
                activeTab === 'stream'
                  ? 'bg-[#1e293b] text-[#06b6d4] font-semibold shadow-sm'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              Stream Specs
            </button>
            <button
              onClick={() => setActiveTab('signatures')}
              className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all ${
                activeTab === 'signatures'
                  ? 'bg-[#1e293b] text-[#06b6d4] font-semibold shadow-sm'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              Digital Hashes
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all ${
                activeTab === 'audio'
                  ? 'bg-[#1e293b] text-[#06b6d4] font-semibold shadow-sm'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              Audio Acoustic Tags
            </button>
          </div>

          {/* Tab 1: Stream Specs Grid */}
          {activeTab === 'stream' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 rounded-xl bg-[#0f172a] border border-white/10 space-y-1">
                <span className="label-xs">Resolution</span>
                <p className="text-xs font-semibold font-mono text-white">{metadata.resolution}</p>
                <span className="text-[10px] text-[#06b6d4] font-mono">Aspect: 16:9</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0f172a] border border-white/10 space-y-1">
                <span className="label-xs">Framerate</span>
                <p className="text-xs font-semibold font-mono text-white">{metadata.fps} FPS</p>
                <span className="text-[10px] text-[#94a3b8] font-mono">Progressive (1:1)</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0f172a] border border-white/10 space-y-1">
                <span className="label-xs">Video Codec</span>
                <p className="text-xs font-semibold font-mono text-white truncate">{metadata.codec}</p>
                <span className="text-[10px] text-[#6366f1] font-mono">AVC1 FourCC</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0f172a] border border-white/10 space-y-1">
                <span className="label-xs">Stream Bitrate</span>
                <p className="text-xs font-semibold font-mono text-white">{metadata.bitrate}</p>
                <span className="text-[10px] text-[#94a3b8] font-mono">VBR Mode</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0f172a] border border-white/10 space-y-1">
                <span className="label-xs">Audio Sample Rate</span>
                <p className="text-xs font-semibold font-mono text-white">{metadata.audioSampleRate}</p>
                <span className="text-[10px] text-[#94a3b8] font-mono">{metadata.audioChannels}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0f172a] border border-white/10 space-y-1">
                <span className="label-xs">Color Matrix</span>
                <p className="text-xs font-semibold font-mono text-white truncate">{metadata.colorSpace}</p>
                <span className="text-[10px] text-[#94a3b8] font-mono">{metadata.bitDepth}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0f172a] border border-white/10 space-y-1">
                <span className="label-xs">Encoder Signature</span>
                <p className="text-xs font-semibold font-mono text-white truncate">{metadata.encoderTag}</p>
                <span className="text-[10px] text-rose-400/90 font-mono">Fingerprintable</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0f172a] border border-white/10 space-y-1">
                <span className="label-xs">File Size</span>
                <p className="text-xs font-semibold font-mono text-white">{metadata.fileSize}</p>
                <span className="text-[10px] text-emerald-400 font-mono">Duration {metadata.durationFormatted}</span>
              </div>
            </div>
          )}

          {/* Tab 2: Hashes & Signatures */}
          {activeTab === 'signatures' && (
            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#0f172a] border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-[#94a3b8]">
                  <span className="flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-[#6366f1]" />
                    Original File Binary Hash (Content ID Key)
                  </span>
                  <button
                    onClick={() => copyToClipboard(metadata.originalHash)}
                    className="text-[#06b6d4] hover:text-white flex items-center gap-1 transition-colors"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-slate-200 break-all bg-black/40 p-2 rounded-lg border border-white/10">
                  {metadata.originalHash}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0f172a] border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-[#94a3b8]">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#06b6d4]" />
                    Target Post-Scrub Hash (Expected Pass)
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    Will Invalidate Automated Database Match
                  </span>
                </div>
                <p className="text-[#06b6d4] break-all bg-black/40 p-2 rounded-lg border border-white/10">
                  {metadata.scrubbedHash}
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Audio Spectrum & Track Tags */}
          {activeTab === 'audio' && (
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#0f172a] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-[#06b6d4]" />
                    Detected Acoustic Fingerprints
                  </span>
                  <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
                    Commercial Match Flagged
                  </span>
                </div>
                <p className="text-[#94a3b8] text-[11px]">
                  Audio track exhibits a 99.1% waveform correlation to standard digital rights registry databases.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {metadata.detectedPlatforms.map((platform, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-[#1e293b] text-[10px] font-mono text-slate-300 border border-white/10"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
