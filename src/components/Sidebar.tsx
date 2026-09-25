import React from 'react';
import {
  Sparkles,
  Layers,
  BarChart3,
  CreditCard,
  History,
  ShieldCheck,
  Zap,
  Sliders,
  Cpu,
  Video,
  Users,
  DollarSign,
  Crown,
  Lock,
  ExternalLink,
  Wand2
} from 'lucide-react';
import { SUPER_ADMIN_EMAIL } from '../utils/adminStorage';

export type NavTab = 'creator' | 'studio' | 'analytics' | 'history' | 'pricing' | 'audit' | 'users' | 'payments' | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isProcessing: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isProcessing
}) => {
  const mainNavItems = [
    { id: 'creator' as NavTab, label: 'AI Video Studio', icon: Wand2, badge: 'New', isGlow: true },
    { id: 'studio' as NavTab, label: 'Processor Hub', icon: Zap, badge: 'Active' },
    { id: 'analytics' as NavTab, label: 'Analytics', icon: BarChart3, badge: '99.4%' },
    { id: 'history' as NavTab, label: 'Job Library', icon: History, count: '14' },
    { id: 'pricing' as NavTab, label: 'Plans & Pricing', icon: CreditCard, promo: '20% OFF' },
    { id: 'audit' as NavTab, label: 'Compliance Audit', icon: ShieldCheck },
  ];

  const adminNavItems = [
    { id: 'users' as NavTab, label: 'User Management', icon: Users, badge: 'Root' },
    { id: 'payments' as NavTab, label: 'Payment Gateways', icon: DollarSign, badge: 'Active' },
  ];

  return (
    <aside className="w-[240px] bg-[#111827] border-r border-white/10 flex flex-col justify-between shrink-0 select-none z-20 h-full">
      <div className="overflow-y-auto custom-scrollbar">
        {/* Brand Header */}
        <div className="p-5 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#06b6d4] flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">CR-REMOVER</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-[#94a3b8] font-mono">v2.4.1 Super Admin</p>
            </div>
          </div>
        </div>

        {/* Super Admin Console Section */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-1.5 label-xs text-amber-400/90 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-400" /> Super Admin
            </span>
            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold border border-amber-500/30">
              ROOT
            </span>
          </div>
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                    : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform duration-150 ${
                      isActive
                        ? 'text-amber-400 opacity-100'
                        : 'text-[#94a3b8] opacity-75 group-hover:opacity-100'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-[#0f172a] text-[#94a3b8] border border-white/5'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mx-3 my-1 border-t border-white/10" />

        {/* General Navigation Items */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-1.5 label-xs">
            Video Engine
          </div>
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-[rgba(99,102,241,0.12)] text-[#06b6d4] font-semibold'
                    : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform duration-150 ${
                      isActive
                        ? 'text-[#06b6d4] opacity-100'
                        : 'text-[#94a3b8] opacity-75 group-hover:opacity-100'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                      isActive
                        ? 'bg-cyan-500/20 text-[#06b6d4] border border-cyan-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {item.count && (
                  <span className="text-[11px] font-mono text-[#94a3b8] group-hover:text-slate-200">
                    {item.count}
                  </span>
                )}
                {item.promo && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                    {item.promo}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Engine Pipeline Status Card */}
        <div className="p-3">
          <div className="p-3.5 rounded-xl bg-[#0f172a] border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#94a3b8] font-mono flex items-center gap-1.5 text-[11px]">
                <Cpu className="w-3.5 h-3.5 text-[#6366f1]" /> Engine Node
              </span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ONLINE
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-[#94a3b8]">
                <span>Cluster Load</span>
                <span className="text-[#06b6d4]">28.4%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-[#6366f1] to-[#06b6d4] h-full w-[28.4%] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Super Admin Profile Footer */}
      <div className="p-4 border-t border-white/10 space-y-3 bg-[#0a0f1c]/90 shrink-0">
        <div className="p-3 rounded-xl bg-[#0f172a] border border-amber-500/20 space-y-1.5 shadow-[0_0_10px_rgba(245,158,11,0.05)]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-amber-300 font-medium text-[11px] flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-400" /> Super Admin Quota
            </span>
            <span className="text-amber-300 font-mono font-bold text-[10px]">UNLIMITED</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-400 h-full w-full rounded-full" />
          </div>
        </div>

        <div className="flex items-center gap-2.5 pt-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-cyan-500 border border-amber-400/40 flex items-center justify-center text-xs font-black text-white shadow-[0_0_12px_rgba(245,158,11,0.4)] shrink-0">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-xs font-bold text-white truncate">Sable</p>
              <Crown className="w-3 h-3 text-amber-400 shrink-0" />
            </div>
            <p className="text-[10px] text-[#06b6d4] font-mono truncate">{SUPER_ADMIN_EMAIL}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
