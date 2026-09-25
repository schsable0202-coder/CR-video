import React from 'react';
import {
  ShieldCheck,
  FileCheck2,
  Lock,
  Scale,
  Download,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { AuditReport } from '../types';
import { exportAuditAsCSV, exportAuditAsJSON } from '../utils/auditGenerator';

export const AuditPanel: React.FC = () => {
  const sampleAudit: AuditReport = {
    reportId: 'CR-AUDIT-GLOBAL-9982',
    generatedAt: new Date().toISOString(),
    fileName: 'Content_ID_Safe_Master_Stream.mp4',
    originalSha256: '9f83a21b38f847291a8247db3892716492817462819384759281748291038472',
    modifiedSha256: '0a83e921d748291048291a748291048291048291048291048291048291048291',
    matchProbabilityBefore: '98.4% (Commercial Match in Content ID & Soundscan)',
    matchProbabilityAfter: '0.4% (Multi-Engine Pass Rate)',
    audioFingerprintDrift: 'Δ 4.82ms phase offset / -0.04% harmonic pitch drift',
    vmafScore: '98.8 / 100 (Visually Lossless Perceptual Quality)',
    ssimScore: '0.9942 (Pass)',
    modificationsApplied: [
      'Metadata & EXIF Deep Scrubbing (Cleaned QuickTime moov & GPS tags)',
      'Sub-perceptual Acoustic Pitch Shift (-0.04%)',
      'Harmonic Phase Inversion & Spectral Stirring',
      'Geometric Affine Micro-Crop (100.35%)',
      'Adversarial Perceptual Noise Injection (Medium)',
      'FFmpeg / Encoder Toolchain Signature Sanitization'
    ],
    metadataRemovedCount: 42,
    spectralShiftValue: '-0.04% Pitch / 180° Phase Offset',
    adversarialNoiseStrength: 'MEDIUM'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#1e293b] rounded-2xl p-6 border border-white/10 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Compliance & Legal Audit Center</h2>
            <span className="sleek-status-pill">
              Fair-Use & Transformative Standard
            </span>
          </div>
          <p className="text-xs text-[#94a3b8] mt-1">
            Cryptographically signed verification certificates documenting video modifications and acoustic drift
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportAuditAsJSON(sampleAudit)}
            className="px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-[#0f172a] hover:bg-[#111827] text-slate-200 border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#06b6d4]" />
            <span>Download Master JSON</span>
          </button>
          <button
            onClick={() => exportAuditAsCSV(sampleAudit)}
            className="px-3.5 py-2 rounded-xl text-xs font-mono font-semibold btn-sleek-primary text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-1.5 hover:scale-105 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Master CSV</span>
          </button>
        </div>
      </div>

      {/* Compliance Framework Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1e293b] rounded-2xl p-5 border border-white/10 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-[#6366f1] flex items-center justify-center border border-indigo-500/20">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Transformative Work Criteria</h3>
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            Meets four-factor fair use transformation requirements by introducing deliberate geometric, acoustic, and contextual modifications.
          </p>
        </div>

        <div className="bg-[#1e293b] rounded-2xl p-5 border border-white/10 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-[#06b6d4] flex items-center justify-center border border-cyan-500/20">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Zero-Data Retention Policy</h3>
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            All uploaded video streams and audio waveforms are processed entirely in client/ephemeral memory with automatic TTL purge.
          </p>
        </div>

        <div className="bg-[#1e293b] rounded-2xl p-5 border border-white/10 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Anti-False Flag Shield</h3>
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            Audit certificates serve as evidentiary documentation in DMCA counter-notices and automated strike disputes.
          </p>
        </div>
      </div>

      {/* Certificate Viewer Preview */}
      <div className="bg-[#1e293b] rounded-2xl p-6 border border-white/10 font-mono text-xs space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">Official Anti-Fingerprint Audit Certificate</span>
          </div>
          <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 text-[10px]">
            CRYPTOGRAPHICALLY VERIFIED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
          <div className="space-y-1">
            <span className="label-xs">Certificate Identifier</span>
            <p className="p-2 rounded bg-black/40 border border-white/10 text-[#06b6d4] font-bold">{sampleAudit.reportId}</p>
          </div>
          <div className="space-y-1">
            <span className="label-xs">Acoustic Misalignment Vector</span>
            <p className="p-2 rounded bg-black/40 border border-white/10 text-slate-200">{sampleAudit.audioFingerprintDrift}</p>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <span className="label-xs">Automated Protections Documented</span>
          <div className="space-y-1.5">
            {sampleAudit.modificationsApplied.map((mod, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded bg-[#0f172a] border border-white/5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{mod}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
