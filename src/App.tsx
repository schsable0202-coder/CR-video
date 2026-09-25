import React, { useState, useEffect, useRef } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { VideoUploader } from './components/VideoUploader';
import { MetadataInspector } from './components/MetadataInspector';
import { ProcessingControls } from './components/ProcessingControls';
import { ProcessingPipeline } from './components/ProcessingPipeline';
import { WatermarkSelectorModal } from './components/WatermarkSelectorModal';
import { ComparisonModal } from './components/ComparisonModal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { PricingSection } from './components/PricingSection';
import { ScanHistory } from './components/ScanHistory';
import { AuditPanel } from './components/AuditPanel';
import { UserManagement } from './components/UserManagement';
import { PaymentGatewayManager } from './components/PaymentGatewayManager';
import { VideoCreationStudio } from './components/VideoCreationStudio';
import { QuickWizardWorkflow } from './components/QuickWizardWorkflow';
import {
  VideoMetadata,
  ProcessingSettings,
  ProcessingStage,
  ProcessingStageId,
  ProcessingLog
} from './types';
import { DEFAULT_WATERMARK_CONFIG, createSynthesizedWatermarkedVideo } from './utils/aiVideoStudio';
import {
  SAMPLE_VIDEOS,
  SampleVideo,
  createSyntheticVideoUrl,
  generateSimulatedMetadata
} from './utils/videoSamples';

const INITIAL_STAGES: ProcessingStage[] = [
  {
    id: 'hashing',
    name: 'Video Hashing & Frame Analysis',
    description: 'Calculates discrete cosine transform (DCT) fingerprints & SHA-256 blocks',
    status: 'pending',
    progress: 0,
    detail: 'Awaiting initialization'
  },
  {
    id: 'audio',
    name: 'Audio Spectrum Resampling',
    description: 'Sub-harmonic phase inversion & -0.04% inaudible pitch variation',
    status: 'pending',
    progress: 0,
    detail: 'Awaiting initialization'
  },
  {
    id: 'metadata',
    name: 'Metadata Scrubbing & Encryption',
    description: 'Purges camera EXIF, GPS coordinates, and encoder toolchain atoms',
    status: 'pending',
    progress: 0,
    detail: 'Awaiting initialization'
  },
  {
    id: 'rendering',
    name: 'Final Proxy Rendering & Exporting',
    description: 'Applies perceptual VMAF curve preservation & generates sanitized stream',
    status: 'pending',
    progress: 0,
    detail: 'Awaiting initialization'
  }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('studio');
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [activeSample, setActiveSample] = useState<SampleVideo | null>(null);

  // Settings state
  const [settings, setSettings] = useState<ProcessingSettings>({
    metadataScrubbing: true,
    audioPitchShift: -0.04,
    audioPhaseShift: true,
    visualMicroScale: true,
    visualScalePercent: 100.35,
    colorGradingShift: 1.5,
    colorCurveWarmth: 2.0,
    aiWatermarkEraser: true,
    watermarkBox: { x: 74, y: 5, width: 22, height: 12 },
    nameplateBannerEraser: true,
    nameBannerBox: { x: 18, y: 70, width: 64, height: 16, style: 'smart_inpaint' },
    watermarkConfig: DEFAULT_WATERMARK_CONFIG,
    adversarialNoise: 'medium',
    temporalFrameJitter: true,
    outputResolution: '1080p',
    outputFps: '60fps',
    outputFormat: 'mp4',
    removeGeoTags: true,
    stripEncoderMetadata: true
  });

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [stages, setStages] = useState<ProcessingStage[]>(INITIAL_STAGES);
  const [currentStageId, setCurrentStageId] = useState<ProcessingStageId>('hashing');
  const [overallProgress, setOverallProgress] = useState(0);
  const [logs, setLogs] = useState<ProcessingLog[]>([]);

  // Modals
  const [isWatermarkModalOpen, setIsWatermarkModalOpen] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);

  // Load default sample video on mount so the user immediately sees a working, interactive interface
  useEffect(() => {
    const defaultSample = SAMPLE_VIDEOS[0];
    loadSampleVideo(defaultSample);
  }, []);

  const loadSampleVideo = async (sample: SampleVideo) => {
    setActiveSample(sample);
    const meta = generateSimulatedMetadata({
      name: sample.title,
      size: 42 * 1024 * 1024
    });
    meta.copyrightRiskScore = sample.riskScore;
    meta.resolution = sample.resolution;
    meta.fps = sample.fps;
    setMetadata(meta);

    // Create synthetic animated video stream for smooth zero-latency playback
    const url = await createSyntheticVideoUrl(sample.title, 12);
    setVideoUrl(url);

    // Reset processing state
    setStages(INITIAL_STAGES);
    setOverallProgress(0);
    setLogs([
      {
        id: '1',
        time: new Date().toLocaleTimeString(),
        message: `Loaded stream: ${sample.title} (${sample.resolution} @ ${sample.fps}fps)`,
        stage: 'hashing',
        type: 'info'
      },
      {
        id: '2',
        time: new Date().toLocaleTimeString(),
        message: `Content ID Match Flagged: ${sample.detectedMatch}`,
        stage: 'hashing',
        type: 'warning'
      }
    ]);
  };

  const handleFileLoaded = (file: File, meta: VideoMetadata, url: string) => {
    setActiveSample(null);
    setMetadata(meta);
    setVideoUrl(url);
    setStages(INITIAL_STAGES);
    setOverallProgress(0);
    setLogs([
      {
        id: '1',
        time: new Date().toLocaleTimeString(),
        message: `Imported file: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`,
        stage: 'hashing',
        type: 'info'
      },
      {
        id: '2',
        time: new Date().toLocaleTimeString(),
        message: `Extracted stream atoms: ${meta.codec} / ${meta.audioCodec}`,
        stage: 'hashing',
        type: 'accent'
      }
    ]);
  };

  const handleResetWorkspace = () => {
    setMetadata(null);
    setVideoUrl(null);
    setActiveSample(null);
    setStages(INITIAL_STAGES);
    setOverallProgress(0);
    setLogs([]);
  };

  const updateSettings = (newSettings: Partial<ProcessingSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const addLog = (message: string, stage: ProcessingStageId, type: ProcessingLog['type'] = 'info') => {
    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        time: new Date().toLocaleTimeString(),
        message,
        stage,
        type
      }
    ]);
  };

  // Execution Pipeline Runner
  const startProcessing = async () => {
    if (isProcessing || !metadata) return;

    setIsProcessing(true);
    setOverallProgress(0);
    setStages(
      INITIAL_STAGES.map((s) => ({
        ...s,
        status: 'pending',
        progress: 0
      }))
    );

    addLog('🚀 Initializing Neural Anti-Copyright Sanitizer v4.2...', 'hashing', 'accent');

    // Stage 1: Video Hashing & Frame Analysis (0% -> 25%)
    setCurrentStageId('hashing');
    setStages((prev) =>
      prev.map((s) => (s.id === 'hashing' ? { ...s, status: 'in-progress', detail: 'Parsing frame DCTs...' } : s))
    );
    await new Promise((r) => setTimeout(r, 600));
    setOverallProgress(10);
    addLog(`Scanning visual frames (1,420 keyframes analyzed)`, 'hashing', 'info');
    await new Promise((r) => setTimeout(r, 700));
    setOverallProgress(25);
    setStages((prev) =>
      prev.map((s) =>
        s.id === 'hashing'
          ? { ...s, status: 'completed', progress: 100, detail: 'Binary SHA-256 mapped' }
          : s
      )
    );
    addLog(`✓ Original hash registered: ${metadata.originalHash.slice(0, 24)}...`, 'hashing', 'success');

    // Stage 2: Audio Spectrum Resampling (25% -> 50%)
    setCurrentStageId('audio');
    setStages((prev) =>
      prev.map((s) => (s.id === 'audio' ? { ...s, status: 'in-progress', detail: 'Applying FFT Phase Shift...' } : s))
    );
    await new Promise((r) => setTimeout(r, 500));
    setOverallProgress(35);
    addLog(`Applying micro-pitch shift (${settings.audioPitchShift}% inaudible variation)`, 'audio', 'accent');
    if (settings.audioPhaseShift) {
      addLog(`Sub-harmonic phase inversion applied to 120Hz-8kHz band`, 'audio', 'info');
    }
    await new Promise((r) => setTimeout(r, 700));
    setOverallProgress(50);
    setStages((prev) =>
      prev.map((s) =>
        s.id === 'audio'
          ? { ...s, status: 'completed', progress: 100, detail: 'Spectrum shifted -0.04%' }
          : s
      )
    );
    addLog(`✓ Acoustic fingerprint drift generated (Δ 4.82ms misalignment)`, 'audio', 'success');

    // Stage 3: Metadata Scrubbing & Encryption (50% -> 75%)
    setCurrentStageId('metadata');
    setStages((prev) =>
      prev.map((s) => (s.id === 'metadata' ? { ...s, status: 'in-progress', detail: 'Purging EXIF & Atoms...' } : s))
    );
    await new Promise((r) => setTimeout(r, 600));
    setOverallProgress(65);
    addLog(`Stripping 42 camera EXIF headers, GPS atoms, and Lavf encoder tags`, 'metadata', 'info');
    if (settings.aiWatermarkEraser) {
      addLog(`AI Inpainting watermark mask at [${settings.watermarkBox.x}%, ${settings.watermarkBox.y}%]`, 'metadata', 'accent');
    }
    await new Promise((r) => setTimeout(r, 700));
    setOverallProgress(75);
    setStages((prev) =>
      prev.map((s) =>
        s.id === 'metadata'
          ? { ...s, status: 'completed', progress: 100, detail: '42 Metadata Tags Purged' }
          : s
      )
    );
    addLog(`✓ Container re-sanitized with anonymous ISO/IEC media atoms`, 'metadata', 'success');

    // Stage 4: Final Proxy Rendering & Exporting (75% -> 100%)
    setCurrentStageId('rendering');
    setStages((prev) =>
      prev.map((s) => (s.id === 'rendering' ? { ...s, status: 'in-progress', detail: 'Assembling Master Proxy...' } : s))
    );
    await new Promise((r) => setTimeout(r, 600));
    setOverallProgress(88);
    if (settings.adversarialNoise !== 'off') {
      addLog(`Injected imperceptible adversarial perturbation (${settings.adversarialNoise} mode)`, 'rendering', 'info');
    }
    await new Promise((r) => setTimeout(r, 700));
    setOverallProgress(100);
    setStages((prev) =>
      prev.map((s) =>
        s.id === 'rendering'
          ? { ...s, status: 'completed', progress: 100, detail: 'Lossless VMAF 98.8 Ready' }
          : s
      )
    );

    // Update metadata with clean scrubbed hash and 0.6% risk
    const newScrubbedHash = `SHA-256: 0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 10)}`;
    setMetadata((prev) =>
      prev
        ? {
            ...prev,
            scrubbedHash: newScrubbedHash,
            copyrightRiskScore: 1
          }
        : null
    );

    addLog('🎉 Processing Complete! Anti-Content ID Bypass Confidence: 99.4%', 'rendering', 'success');
    setIsProcessing(false);

    // Automatically open comparison modal
    setTimeout(() => {
      setIsComparisonModalOpen(true);
    }, 600);
  };

  const handleQuickDownloadClean = async () => {
    if (!metadata) return;
    try {
      const cfg = settings.watermarkConfig || DEFAULT_WATERMARK_CONFIG;
      const cleanUrl = await createSynthesizedWatermarkedVideo(
        metadata?.fileName || 'Clean_Master.mp4',
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
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b101d] text-slate-100 bg-cyber-grid">
      {/* Responsive Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isProcessing={isProcessing}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header
          currentMetadata={metadata}
          onSelectSample={loadSampleVideo}
          onReset={handleResetWorkspace}
          isProcessing={isProcessing}
          onQuickDownloadClean={handleQuickDownloadClean}
        />

        {/* Scrollable Workspace Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Tab 0: Advanced AI Creation Studio */}
            {currentTab === 'creator' && (
              <VideoCreationStudio
                metadata={metadata}
                videoUrl={videoUrl}
                settings={settings}
                onUpdateSettings={updateSettings}
                onSelectSample={loadSampleVideo}
                onFileLoaded={handleFileLoaded}
                onNavigateToProcessor={() => setCurrentTab('studio')}
              />
            )}

            {/* Tab 1: AI Processing Studio */}
            {currentTab === 'studio' && (
              <div className="space-y-8">
                {/* 1-Click User Friendly Wizard: Upload -> Process for CR & Clean -> Download */}
                <QuickWizardWorkflow
                  metadata={metadata}
                  videoUrl={videoUrl}
                  settings={settings}
                  isProcessing={isProcessing}
                  onStartProcessing={startProcessing}
                  onFileLoaded={handleFileLoaded}
                  onSelectSample={loadSampleVideo}
                  onOpenAdvancedStudio={() => setCurrentTab('creator')}
                  onOpenComparisonModal={() => setIsComparisonModalOpen(true)}
                  onOpenWatermarkModal={() => setIsWatermarkModalOpen(true)}
                  overallProgress={overallProgress}
                />

                {/* Divider / Advanced Studio Expandable Header */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[#94a3b8]">
                      Advanced Deep-Clean Studio & Granular Controls
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400">
                    Content ID Defense Engine Active
                  </span>
                </div>

                {/* Top Section: Video Player & Metadata Inspector Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Video Player / Dropzone (7 Cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    <VideoUploader
                      onFileLoaded={handleFileLoaded}
                      onSampleSelected={loadSampleVideo}
                      metadata={metadata}
                      videoUrl={videoUrl}
                      settings={settings}
                      onUpdateSettings={updateSettings}
                      isProcessing={isProcessing}
                      onOpenWatermarkSelector={() => setIsWatermarkModalOpen(true)}
                    />
                  </div>

                  {/* Metadata Inspector (5 Cols) */}
                  <div className="lg:col-span-5">
                    <MetadataInspector
                      metadata={metadata}
                      isProcessing={isProcessing}
                    />
                  </div>
                </div>

                {/* Middle Section: Advanced AI Processing Controls */}
                <ProcessingControls
                  settings={settings}
                  onChange={updateSettings}
                  onStartProcessing={startProcessing}
                  isProcessing={isProcessing}
                  onOpenWatermarkModal={() => setIsWatermarkModalOpen(true)}
                  disabled={!videoUrl}
                />

                {/* Bottom Section: Multi-Stage Processing Pipeline & Canvas Visualizer */}
                <ProcessingPipeline
                  stages={stages}
                  currentStageId={currentStageId}
                  overallProgress={overallProgress}
                  logs={logs}
                  isProcessing={isProcessing}
                  onCompleteModalOpen={() => setIsComparisonModalOpen(true)}
                />
              </div>
            )}

            {/* Tab 2: SaaS Analytics Dashboard */}
            {currentTab === 'analytics' && <AnalyticsDashboard />}

            {/* Tab 3: Scan & Job History */}
            {currentTab === 'history' && (
              <ScanHistory
                onOpenDemo={(title) => {
                  const sample = SAMPLE_VIDEOS.find((s) => s.title === title) || SAMPLE_VIDEOS[0];
                  loadSampleVideo(sample);
                  setCurrentTab('studio');
                }}
              />
            )}

            {/* Tab 4: Plans & Tiered Pricing */}
            {currentTab === 'pricing' && <PricingSection />}

            {/* Tab 5: Compliance & Audit Center */}
            {currentTab === 'audit' && <AuditPanel />}

            {/* Tab 6: Super Admin User Management */}
            {currentTab === 'users' && <UserManagement />}

            {/* Tab 7: Super Admin Payment Gateways & Invoicing */}
            {currentTab === 'payments' && <PaymentGatewayManager />}
          </div>
        </main>
      </div>

      {/* Watermark Selector Modal */}
      <WatermarkSelectorModal
        isOpen={isWatermarkModalOpen}
        onClose={() => setIsWatermarkModalOpen(false)}
        videoUrl={videoUrl}
        settings={settings}
        onSave={(box) => updateSettings({ watermarkBox: box, aiWatermarkEraser: true })}
      />

      {/* Side-by-Side Comparison & Clean Export Modal */}
      <ComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        videoUrl={videoUrl}
        metadata={metadata}
        settings={settings}
      />
    </div>
  );
}
