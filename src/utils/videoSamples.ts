import { VideoMetadata } from '../types';

export interface SampleVideo {
  id: string;
  title: string;
  category: string;
  duration: number;
  size: string;
  resolution: string;
  fps: number;
  riskScore: number;
  description: string;
  detectedMatch: string;
  videoUrl?: string;
  accentColor: string;
}

export const SAMPLE_VIDEOS: SampleVideo[] = [
  {
    id: 'sample-1',
    title: 'Twitch_Broadcast_Copyrighted_Track.mp4',
    category: 'Livestream VOD',
    duration: 38,
    size: '42.8 MB',
    resolution: '1920x1080',
    fps: 60,
    riskScore: 98,
    description: 'Contains background commercial audio track detected by YouTube & Twitch Content ID.',
    detectedMatch: 'Sony Music / UMG Audio Fingerprint #A89-2049',
    accentColor: '#ef4444'
  },
  {
    id: 'sample-2',
    title: 'UFC_Fight_Highlights_Watermarked.mov',
    category: 'Sports & TV',
    duration: 24,
    size: '89.4 MB',
    resolution: '3840x2160',
    fps: 60,
    riskScore: 94,
    description: 'Broadcaster watermark in top-right corner with strict spatial frame fingerprinting.',
    detectedMatch: 'ESPN / UFC Automated Frame Signature Block',
    accentColor: '#f97316'
  },
  {
    id: 'sample-3',
    title: 'Podcast_Interview_Snippet_4K.mkv',
    category: 'Podcast / Social',
    duration: 52,
    size: '64.1 MB',
    resolution: '1920x1080',
    fps: 30,
    riskScore: 88,
    description: 'Commercial bumper intro music and embedded Adobe Premiere camera EXIF metadata.',
    detectedMatch: 'Warner Music Group Soundscan 2024.1',
    accentColor: '#eab308'
  }
];

export function generateSimulatedMetadata(file: File | { name: string; size: number }): VideoMetadata {
  const isLarge = file.size > 50 * 1024 * 1024;
  const ext = file.name.split('.').pop()?.toUpperCase() || 'MP4';
  const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
  
  // Deterministic random hashes based on filename
  const seed = file.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hash1 = '0x' + Array.from({ length: 16 }, (_, i) => ((seed * (i + 1) * 31) % 16).toString(16)).join('');
  const hash2 = '0x' + Array.from({ length: 16 }, (_, i) => ((seed * (i + 3) * 47) % 16).toString(16)).join('');
  
  return {
    fileName: file.name,
    fileSize: sizeMb,
    resolution: isLarge ? '3840x2160 (4K UHD)' : '1920x1080 (Full HD)',
    width: isLarge ? 3840 : 1920,
    height: isLarge ? 2160 : 1080,
    fps: 60,
    codec: 'H.264 / AVC (High Profile Level 4.2)',
    audioCodec: 'AAC-LC (Stereo, 320 kbps)',
    audioSampleRate: '48.0 kHz',
    audioChannels: '2.0 (L/R)',
    duration: 38,
    durationFormatted: '00:38.20',
    originalHash: `SHA-256: ${hash1}...${hash2.slice(0, 8)}`,
    scrubbedHash: 'Pending Processing Engine...',
    containerFormat: `${ext} (QuickTime / ISO Base Media)`,
    bitDepth: '8-bit Standard Dynamic Range',
    colorSpace: 'BT.709 / sRGB (Rec.709)',
    bitrate: isLarge ? '18.4 Mbps' : '8.2 Mbps',
    copyrightRiskScore: 96,
    detectedPlatforms: ['YouTube Content ID', 'TikTok Audio Match', 'Meta Rights Manager', 'Twitch VOD Muter'],
    cameraModel: 'Sony A7S III (ILCE-7SM3)',
    creationDate: '2026-04-12 14:22:09 UTC',
    encoderTag: 'Lavf59.27.100 (FFmpeg / libx264)'
  };
}

/**
 * Creates an animated synthetic sample video canvas stream and returns a playable blob URL.
 * This guarantees smooth instant playback even without external network downloads!
 */
export function createSyntheticVideoUrl(title: string, durationSec: number = 10): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';

  const stream = canvas.captureStream(30);
  let mediaRecorder: MediaRecorder | null = null;
  
  try {
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
  } catch {
    return '';
  }

  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  mediaRecorder.start();

  let frame = 0;
  const totalFrames = durationSec * 30;
  
  function drawFrame() {
    if (!ctx) return;
    frame++;

    // Dynamic background with moving gradients
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    const hue = (frame * 1.5) % 360;
    grad.addColorStop(0, `hsl(${hue}, 60%, 15%)`);
    grad.addColorStop(0.5, `hsl(${(hue + 60) % 360}, 70%, 10%)`);
    grad.addColorStop(1, `hsl(${(hue + 120) % 360}, 80%, 8%)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Glowing grid lines
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Dynamic moving orb
    const orbX = canvas.width / 2 + Math.sin(frame * 0.05) * 300;
    const orbY = canvas.height / 2 + Math.cos(frame * 0.04) * 150;
    const orbGrad = ctx.createRadialGradient(orbX, orbY, 10, orbX, orbY, 160);
    orbGrad.addColorStop(0, 'rgba(6, 182, 212, 0.8)');
    orbGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.4)');
    orbGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = orbGrad;
    ctx.beginPath();
    ctx.arc(orbX, orbY, 160, 0, Math.PI * 2);
    ctx.fill();

    // Central graphic banner
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(canvas.width / 2 - 340, canvas.height / 2 - 110, 680, 220, 16);
    ctx.fill();
    ctx.stroke();

    // Text & Information
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 28px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CR-REMOVER PRO // FEED PREVIEW', canvas.width / 2, canvas.height / 2 - 50);

    ctx.fillStyle = '#ffffff';
    ctx.font = '500 20px Inter, sans-serif';
    ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 10);

    // Audio spectrum mock bars inside canvas
    ctx.fillStyle = '#06b6d4';
    const barCount = 28;
    const startX = canvas.width / 2 - 200;
    for (let b = 0; b < barCount; b++) {
      const h = Math.abs(Math.sin((frame + b * 5) * 0.15)) * 40 + 8;
      ctx.fillRect(startX + b * 14, canvas.height / 2 + 55 - h / 2, 8, h);
    }

    // Timecode
    const curSec = Math.floor(frame / 30);
    const ms = Math.floor((frame % 30) * 3.33);
    const timeStr = `TC: 00:00:${curSec < 10 ? '0' + curSec : curSec}.${ms < 10 ? '0' + ms : ms} (FRAME ${frame})`;
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px monospace';
    ctx.fillText(timeStr, canvas.width / 2, canvas.height / 2 + 85);

    // Watermark overlay simulation
    ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
    ctx.beginPath();
    ctx.roundRect(canvas.width - 240, 30, 200, 50, 8);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('© BROADCASTER ID', canvas.width - 140, 60);

    if (frame < totalFrames) {
      requestAnimationFrame(drawFrame);
    } else {
      mediaRecorder?.stop();
    }
  }

  drawFrame();

  return new Promise<string>((resolve) => {
    if (!mediaRecorder) return resolve('');
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve(URL.createObjectURL(blob));
    };
  }) as any;
}
