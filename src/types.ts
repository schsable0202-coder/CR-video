export interface VideoMetadata {
  fileName: string;
  fileSize: string;
  resolution: string;
  width: number;
  height: number;
  fps: number;
  codec: string;
  audioCodec: string;
  audioSampleRate: string;
  audioChannels: string;
  duration: number; // in seconds
  durationFormatted: string;
  originalHash: string;
  scrubbedHash: string;
  containerFormat: string;
  bitDepth: string;
  colorSpace: string;
  bitrate: string;
  copyrightRiskScore: number; // 0-100
  detectedPlatforms: string[];
  cameraModel?: string;
  creationDate?: string;
  encoderTag?: string;
}

export interface ProcessingSettings {
  metadataScrubbing: boolean;
  audioPitchShift: number; // e.g. -0.05% to +0.05% (default -0.04%)
  audioPhaseShift: boolean;
  visualMicroScale: boolean; // micro crop 100.25%
  visualScalePercent: number; // 100.1 to 101.5
  colorGradingShift: number; // -5 to +5
  colorCurveWarmth: number;
  aiWatermarkEraser: boolean;
  watermarkBox: {
    x: number; // percentage (0-100)
    y: number;
    width: number;
    height: number;
  };
  watermarkConfig?: WatermarkConfig;
  adversarialNoise: 'off' | 'low' | 'medium' | 'high';
  temporalFrameJitter: boolean;
  outputResolution: '1080p' | '4K' | '720p' | 'original';
  outputFps: '60fps' | '30fps' | '24fps' | 'original';
  outputFormat: 'mp4' | 'mov' | 'mkv';
  removeGeoTags: boolean;
  stripEncoderMetadata: boolean;
}

export type ProcessingStageId = 'hashing' | 'audio' | 'metadata' | 'rendering';

export interface ProcessingStage {
  id: ProcessingStageId;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
  detail: string;
}

export interface ProcessingLog {
  id: string;
  time: string;
  message: string;
  stage: ProcessingStageId;
  type: 'info' | 'success' | 'warning' | 'accent';
}

export interface AuditReport {
  reportId: string;
  generatedAt: string;
  fileName: string;
  originalSha256: string;
  modifiedSha256: string;
  matchProbabilityBefore: string;
  matchProbabilityAfter: string;
  audioFingerprintDrift: string;
  vmafScore: string;
  ssimScore: string;
  modificationsApplied: string[];
  metadataRemovedCount: number;
  spectralShiftValue: string;
  adversarialNoiseStrength: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnually: number;
  badge?: string;
  description: string;
  popular?: boolean;
  features: string[];
  limitations?: string[];
  quota: string;
  quotaNumber?: number;
  buttonText: string;
}

export type UserRole = 'super_admin' | 'admin' | 'enterprise' | 'pro_creator' | 'basic_creator' | 'free_tier';
export type UserStatus = 'active' | 'suspended' | 'pending' | 'flagged';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  planId: string;
  planName: string;
  quotaUsed: number;
  quotaLimit: number;
  unlimitedQuota: boolean;
  registeredAt: string;
  lastActive: string;
  totalVideosProcessed: number;
  apiKey: string;
  billingStatus: 'paid' | 'past_due' | 'trial' | 'exempt';
  country: string;
  ipAddress: string;
  notes?: string;
}

export type GatewayProviderId = 'stripe' | 'paypal' | 'razorpay' | 'paddle' | 'crypto_commerce' | 'lemon_squeezy';

export interface GatewayConfig {
  id: GatewayProviderId;
  name: string;
  description: string;
  logo: string;
  isEnabled: boolean;
  isTestMode: boolean;
  currencies: string[];
  defaultCurrency: string;
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
  merchantId?: string;
  enforce3DS: boolean;
  autoCapture: boolean;
  feePercentage: number;
  fixedFee: number;
  monthlyVolumeUSD: number;
  status: 'operational' | 'degraded' | 'disabled';
}

export type TransactionStatus = 'succeeded' | 'pending' | 'failed' | 'refunded' | 'partially_refunded' | 'disputed';

export interface GatewayTransaction {
  id: string;
  transactionRef: string;
  gateway: GatewayProviderId;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  fee: number;
  net: number;
  planName: string;
  paymentMethod: 'card' | 'paypal' | 'upi' | 'crypto' | 'bank_transfer';
  cardLast4?: string;
  cardBrand?: string;
  status: TransactionStatus;
  timestamp: string;
  disputeRisk: 'low' | 'medium' | 'high';
  receiptUrl?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discountPercentage: number;
  discountType: 'percentage' | 'fixed';
  fixedAmount?: number;
  appliesTo: 'all' | 'pro_creator' | 'enterprise';
  maxRedemptions: number;
  timesRedeemed: number;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
  createdBy: string;
}

export interface PayoutAccount {
  id: string;
  bankName: string;
  accountHolder: string;
  accountNumberMasked: string;
  routingOrIban: string;
  currency: string;
  schedule: 'daily' | 'weekly' | 'monthly' | 'manual';
  isDefault: boolean;
  status: 'verified' | 'pending_verification';
}

export type WatermarkPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'custom';

export interface WatermarkConfig {
  isEnabled: boolean;
  text: string; // default "schsable"
  position: WatermarkPosition;
  customX?: number; // 0-100%
  customY?: number; // 0-100%
  opacity: number; // 0.1 to 1.0 (e.g. 0.85)
  fontSize: number; // 12 to 36
  fontStyle: 'cyber' | 'bold' | 'minimal' | 'serif' | 'glow';
  color: string; // e.g. '#06b6d4' or '#ffffff'
  hasGlow: boolean;
  badgeStyle: 'text-only' | 'pill-badge' | 'box-stamp' | 'copyright-tag';
}

export interface VideoAnalysisResult {
  analyzedAt: string;
  viralPotentialScore: number; // 0-100
  overallQualityScore: number; // 0-100
  retentionPredictionScore: number; // 0-100
  pacingScore: number;
  speechClarityScore: number;
  audioDynamicRange: string;
  mood: string;
  tone: string;
  targetAudience: string;
  detectedNiche: string;
  bestPostingTimes: { platform: string; bestTime: string }[];
  keyMomentTimestamps: { timestamp: string; label: string; hookType: string }[];
  copyrightRiskBreakdown: {
    audioFingerprintRisk: number;
    visualFrameRisk: number;
    metadataHeaderRisk: number;
    watermarkRisk: number;
  };
  recommendations: string[];
}

export interface TrendingHashtag {
  tag: string;
  volume: string;
  reachScore: number; // 0-100
  category: 'viral' | 'niche' | 'platform' | 'seo';
  isTrending: boolean;
  selected?: boolean;
}

export interface VideoTitleOption {
  id: string;
  title: string;
  style: 'curiosity_hook' | 'seo_search' | 'controversial_shock' | 'emotional_story' | 'shorts_viral';
  styleLabel: string;
  predictedCtr: number; // e.g. 96
  charCount: number;
  badge: string;
}

export interface ThumbnailOption {
  id: string;
  title: string;
  styleName: string;
  badgeText: string;
  badgeColor: string;
  headlineText: string;
  subText: string;
  accentColor: string;
  theme: 'cyber_neon' | 'dramatic_split' | 'cinematic_minimal';
  watermarkText: string;
  previewGradient: string;
  downloadFilename: string;
}

export interface CreatedVideoProject {
  id: string;
  title: string;
  videoUrl: string;
  sourceFileName: string;
  thumbnailId: string;
  hashtags: string[];
  watermark: WatermarkConfig;
  processedAt: string;
  fileSize: string;
  resolution: string;
  sha256Clean: string;
  bypassScore: number;
}

