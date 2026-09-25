import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  HardDrive,
  Activity,
  Layers,
  CheckCircle2,
  Calendar,
  Zap,
  Globe,
  Radio
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '12m'>('30d');

  const scansChartRef = useRef<HTMLCanvasElement>(null);
  const donutChartRef = useRef<HTMLCanvasElement>(null);
  const bypassChartRef = useRef<HTMLCanvasElement>(null);

  const scansChartInstance = useRef<ChartJS | null>(null);
  const donutChartInstance = useRef<ChartJS | null>(null);
  const bypassChartInstance = useRef<ChartJS | null>(null);

  useEffect(() => {
    // 1. Monthly Scans & Processed Videos Line/Bar Chart
    if (scansChartRef.current) {
      if (scansChartInstance.current) scansChartInstance.current.destroy();

      const ctx = scansChartRef.current.getContext('2d');
      if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 250);
        gradient.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0.02)');

        const labels =
          timeRange === '30d'
            ? ['Day 1-5', 'Day 6-10', 'Day 11-15', 'Day 16-20', 'Day 21-25', 'Day 26-30']
            : timeRange === '90d'
            ? ['Month 1 (W1-2)', 'Month 1 (W3-4)', 'Month 2 (W1-2)', 'Month 2 (W3-4)', 'Month 3 (W1-2)', 'Month 3 (W3-4)']
            : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const dataPoints =
          timeRange === '30d'
            ? [142, 198, 230, 310, 285, 394]
            : timeRange === '90d'
            ? [580, 720, 890, 1120, 1340, 1580]
            : [1200, 1450, 1820, 2100, 2450, 3100, 3800, 4200, 4900, 5600, 6400, 7850];

        scansChartInstance.current = new ChartJS(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [
              {
                label: 'Processed & Cleared Videos',
                data: dataPoints,
                borderColor: '#06b6d4',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#ffffff',
                pointRadius: 4,
                pointHoverRadius: 7
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#0f172a',
                titleColor: '#38bdf8',
                bodyColor: '#f1f5f9',
                borderColor: '#334155',
                borderWidth: 1,
                padding: 12,
                displayColors: false
              }
            },
            scales: {
              x: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 11 } }
              },
              y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 11 } }
              }
            }
          }
        });
      }
    }

    // 2. Storage Usage Donut Chart
    if (donutChartRef.current) {
      if (donutChartInstance.current) donutChartInstance.current.destroy();

      const ctx = donutChartRef.current.getContext('2d');
      if (ctx) {
        donutChartInstance.current = new ChartJS(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Rendered Master 4K', '1080p Web Proxies', 'Acoustic Waveforms', 'Audit Certs'],
            datasets: [
              {
                data: [42.6, 28.4, 14.2, 4.8],
                backgroundColor: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b'],
                borderColor: '#0f172a',
                borderWidth: 3,
                hoverOffset: 6
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  color: '#94a3b8',
                  font: { family: 'Inter', size: 11 },
                  padding: 12
                }
              }
            }
          }
        });
      }
    }

    // 3. Bypass Success Rate Curve
    if (bypassChartRef.current) {
      if (bypassChartInstance.current) bypassChartInstance.current.destroy();

      const ctx = bypassChartRef.current.getContext('2d');
      if (ctx) {
        bypassChartInstance.current = new ChartJS(ctx, {
          type: 'bar',
          data: {
            labels: ['YouTube Content ID', 'TikTok Sound Match', 'Meta Rights Mgr', 'Twitch VOD Filter', 'Kick Streaming'],
            datasets: [
              {
                label: 'Bypass Success %',
                data: [99.2, 99.7, 99.1, 99.8, 100.0],
                backgroundColor: [
                  'rgba(99, 102, 241, 0.8)',
                  'rgba(6, 182, 212, 0.8)',
                  'rgba(16, 185, 129, 0.8)',
                  'rgba(245, 158, 11, 0.8)',
                  'rgba(236, 72, 153, 0.8)'
                ],
                borderRadius: 8,
                borderWidth: 0
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#0f172a',
                callbacks: {
                  label: (context) => `Success Rate: ${context.parsed.y}%`
                }
              }
            },
            scales: {
              y: {
                min: 95,
                max: 100,
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: {
                  color: '#94a3b8',
                  callback: (val) => `${val}%`,
                  font: { family: 'JetBrains Mono', size: 11 }
                }
              },
              x: {
                grid: { display: false },
                ticks: { color: '#cbd5e1', font: { size: 11 } }
              }
            }
          }
        });
      }
    }

    return () => {
      scansChartInstance.current?.destroy();
      donutChartInstance.current?.destroy();
      bypassChartInstance.current?.destroy();
    };
  }, [timeRange]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Range Selector */}
      <div className="bg-[#1e293b] rounded-2xl p-6 border border-white/10 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">SaaS Analytics & Neural Network Performance</h2>
            <span className="sleek-status-pill">
              Live Fleet Status
            </span>
          </div>
          <p className="text-xs text-[#94a3b8] mt-1">
            Real-time telemetry measuring automated Content ID evasion, acoustic drift, and cluster throughput
          </p>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center gap-1 bg-[#0f172a] p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setTimeRange('30d')}
            className={`py-1.5 px-3 rounded-lg font-medium transition-all ${
              timeRange === '30d' ? 'bg-[#1e293b] text-[#06b6d4] font-semibold shadow-sm' : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setTimeRange('90d')}
            className={`py-1.5 px-3 rounded-lg font-medium transition-all ${
              timeRange === '90d' ? 'bg-[#1e293b] text-[#06b6d4] font-semibold shadow-sm' : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            Last Quarter
          </button>
          <button
            onClick={() => setTimeRange('12m')}
            className={`py-1.5 px-3 rounded-lg font-medium transition-all ${
              timeRange === '12m' ? 'bg-[#1e293b] text-[#06b6d4] font-semibold shadow-sm' : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            12 Months
          </button>
        </div>
      </div>

      {/* 4 Top KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1e293b] rounded-2xl p-5 border border-white/10 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#94a3b8]">
            <span className="label-xs">Bypass Success Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">99.4%</span>
            <span className="text-xs font-mono text-emerald-400 font-bold">+0.3% vs avg</span>
          </div>
          <p className="text-[11px] text-[#94a3b8] font-mono">14,289 videos verified clean</p>
        </div>

        <div className="bg-[#1e293b] rounded-2xl p-5 border border-white/10 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#94a3b8]">
            <span className="label-xs">Total Cleaned Feeds</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-[#06b6d4] flex items-center justify-center border border-cyan-500/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">3,892</span>
            <span className="text-xs font-mono text-[#06b6d4] font-bold">+18.4% this mo</span>
          </div>
          <p className="text-[11px] text-[#94a3b8] font-mono">Avg processing time: 3.4s</p>
        </div>

        <div className="bg-[#1e293b] rounded-2xl p-5 border border-white/10 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#94a3b8]">
            <span className="label-xs">Cloud Vault Storage</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-[#6366f1] flex items-center justify-center border border-indigo-500/20">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">90.0 GB</span>
            <span className="text-xs font-mono text-[#94a3b8]">/ 500 GB</span>
          </div>
          <p className="text-[11px] text-[#94a3b8] font-mono">18% quota consumed</p>
        </div>

        <div className="bg-[#1e293b] rounded-2xl p-5 border border-white/10 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#94a3b8]">
            <span className="label-xs">Acoustic Inaudibility</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">99.98%</span>
            <span className="text-xs font-mono text-purple-400 font-bold">Lossless VMAF</span>
          </div>
          <p className="text-[11px] text-[#94a3b8] font-mono">Zero perceptible artifacting</p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Scans Chart (2 Columns) */}
        <div className="lg:col-span-2 bg-[#1e293b] rounded-2xl p-6 border border-white/10 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Monthly Scans & Neural Processing Volume</h3>
              <p className="text-xs text-[#94a3b8]">Total automated renders through AI protection grid</p>
            </div>
            <span className="text-xs font-mono text-[#06b6d4] bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30 font-bold">
              +28% MoM Growth
            </span>
          </div>

          <div className="h-64 w-full">
            <canvas ref={scansChartRef} />
          </div>
        </div>

        {/* Cloud Storage Donut Chart (1 Column) */}
        <div className="bg-[#1e293b] rounded-2xl p-6 border border-white/10 space-y-4 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-base font-bold text-white">Storage Allocation Breakdown</h3>
            <p className="text-xs text-[#94a3b8]">Encrypted temporary proxy cache</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center relative">
            <canvas ref={donutChartRef} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
              <span className="text-xs text-[#94a3b8] font-mono">Used</span>
              <span className="text-xl font-bold font-mono text-white">90 GB</span>
            </div>
          </div>

          <div className="text-center text-xs text-[#94a3b8] font-mono pt-2 border-t border-white/10">
            Auto-purge cleans cache after 7 days
          </div>
        </div>
      </div>

      {/* Platform Breakdown Chart */}
      <div className="bg-[#1e293b] rounded-2xl p-6 border border-white/10 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Content ID Bypass Rate by Ecosystem</h3>
            <p className="text-xs text-[#94a3b8]">Verified automated strike evasion metrics across major platforms</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30 font-bold">
            99.4% Platform Average
          </span>
        </div>

        <div className="h-60 w-full">
          <canvas ref={bypassChartRef} />
        </div>
      </div>
    </div>
  );
};
