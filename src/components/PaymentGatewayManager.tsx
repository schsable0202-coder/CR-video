import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Zap,
  Settings,
  DollarSign,
  ArrowUpRight,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Key,
  ShieldCheck,
  Tag,
  Plus,
  Trash2,
  Download,
  Search,
  ExternalLink,
  Sliders,
  X,
  Check,
  Building2,
  Layers,
  Coins,
  Receipt
} from 'lucide-react';
import { GatewayConfig, GatewayTransaction, PromoCode, PayoutAccount, GatewayProviderId, TransactionStatus } from '../types';
import {
  getStoredGateways,
  saveStoredGateways,
  getStoredTransactions,
  saveStoredTransactions,
  getStoredPromos,
  saveStoredPromos,
  getStoredPayouts,
  saveStoredPayouts,
  SUPER_ADMIN_EMAIL
} from '../utils/adminStorage';

export const PaymentGatewayManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'gateways' | 'transactions' | 'promos' | 'payouts'>('gateways');
  const [gateways, setGateways] = useState<GatewayConfig[]>([]);
  const [transactions, setTransactions] = useState<GatewayTransaction[]>([]);
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [payouts, setPayouts] = useState<PayoutAccount[]>([]);

  // Modals state
  const [editingGateway, setEditingGateway] = useState<GatewayConfig | null>(null);
  const [isNewPromoModalOpen, setIsNewPromoModalOpen] = useState(false);
  const [refundModalTx, setRefundModalTx] = useState<GatewayTransaction | null>(null);

  // Search and filter for transactions
  const [txSearch, setTxSearch] = useState('');
  const [txGatewayFilter, setTxGatewayFilter] = useState<string>('all');
  const [txStatusFilter, setTxStatusFilter] = useState<string>('all');

  // New promo form state
  const [newPromo, setNewPromo] = useState<Partial<PromoCode>>({
    code: '',
    discountPercentage: 20,
    discountType: 'percentage',
    appliesTo: 'all',
    maxRedemptions: 100,
    isActive: true,
    expiresAt: '2026-12-31'
  });

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    setGateways(getStoredGateways());
    setTransactions(getStoredTransactions());
    setPromos(getStoredPromos());
    setPayouts(getStoredPayouts());
  };

  // Gateway Actions
  const handleToggleGateway = (id: GatewayProviderId) => {
    const updated = gateways.map((g) => {
      if (g.id === id) {
        const nextEnabled = !g.isEnabled;
        return {
          ...g,
          isEnabled: nextEnabled,
          status: nextEnabled ? ('operational' as const) : ('disabled' as const)
        };
      }
      return g;
    });
    setGateways(updated);
    saveStoredGateways(updated);
    showToast(`Payment Gateway ${id.toUpperCase()} ${updated.find(g => g.id === id)?.isEnabled ? 'Enabled' : 'Disabled'}`);
  };

  const handleToggleTestMode = (id: GatewayProviderId) => {
    const updated = gateways.map((g) => (g.id === id ? { ...g, isTestMode: !g.isTestMode } : g));
    setGateways(updated);
    saveStoredGateways(updated);
    showToast(`Toggled ${id.toUpperCase()} environment mode`);
  };

  const handleSaveGatewayConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGateway) return;

    const updated = gateways.map((g) => (g.id === editingGateway.id ? editingGateway : g));
    setGateways(updated);
    saveStoredGateways(updated);
    setEditingGateway(null);
    showToast(`Updated API keys & configuration for ${editingGateway.name}`);
  };

  // Transaction Actions
  const handleIssueRefund = (full: boolean) => {
    if (!refundModalTx) return;

    const updated = transactions.map((t) => {
      if (t.id === refundModalTx.id) {
        return {
          ...t,
          status: full ? ('refunded' as TransactionStatus) : ('partially_refunded' as TransactionStatus)
        };
      }
      return t;
    });

    setTransactions(updated);
    saveStoredTransactions(updated);
    setRefundModalTx(null);
    showToast(`Issued ${full ? 'Full' : 'Partial'} refund for ${refundModalTx.transactionRef}`);
  };

  // Promo Code Actions
  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromo.code) {
      alert('Please provide a promo code string');
      return;
    }

    const created: PromoCode = {
      id: `prm_${Math.random().toString(36).substring(2, 8)}`,
      code: newPromo.code.toUpperCase().trim(),
      discountPercentage: newPromo.discountPercentage || 20,
      discountType: newPromo.discountType || 'percentage',
      appliesTo: newPromo.appliesTo || 'all',
      maxRedemptions: newPromo.maxRedemptions || 100,
      timesRedeemed: 0,
      isActive: true,
      expiresAt: newPromo.expiresAt || '2026-12-31',
      createdAt: new Date().toISOString().substring(0, 10),
      createdBy: SUPER_ADMIN_EMAIL
    };

    const updated = [created, ...promos];
    setPromos(updated);
    saveStoredPromos(updated);
    setIsNewPromoModalOpen(false);
    setNewPromo({
      code: '',
      discountPercentage: 20,
      discountType: 'percentage',
      appliesTo: 'all',
      maxRedemptions: 100,
      isActive: true,
      expiresAt: '2026-12-31'
    });
    showToast(`Promo Code ${created.code} created!`);
  };

  const handleTogglePromo = (id: string) => {
    const updated = promos.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p));
    setPromos(updated);
    saveStoredPromos(updated);
    showToast('Promo code status toggled');
  };

  const handleDeletePromo = (id: string) => {
    const updated = promos.filter((p) => p.id !== id);
    setPromos(updated);
    saveStoredPromos(updated);
    showToast('Promo code deleted');
  };

  const handleTriggerPayout = (accountName: string) => {
    showToast(`⚡ Instant Settlement Payout queued to ${accountName}! Processing via Automated Clearing House.`);
  };

  // Calculations
  const totalVolumeUSD = gateways.reduce((acc, g) => acc + (g.isEnabled ? g.monthlyVolumeUSD : 0), 0);
  const totalFeesUSD = Math.round(totalVolumeUSD * 0.032);
  const netRevenueUSD = totalVolumeUSD - totalFeesUSD;

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.transactionRef.toLowerCase().includes(txSearch.toLowerCase()) ||
      t.userName.toLowerCase().includes(txSearch.toLowerCase()) ||
      t.userEmail.toLowerCase().includes(txSearch.toLowerCase()) ||
      t.planName.toLowerCase().includes(txSearch.toLowerCase());

    const matchesGateway = txGatewayFilter === 'all' || t.gateway === txGatewayFilter;
    const matchesStatus = txStatusFilter === 'all' || t.status === txStatusFilter;

    return matchesSearch && matchesGateway && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e293b] border border-cyan-500/40 text-cyan-200 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 font-mono text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-[#1e293b] rounded-2xl p-6 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4 shadow-[0_0_25px_rgba(6,182,212,0.08)] relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6366f1] via-[#06b6d4] to-emerald-400 flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-white">Payment Gateway & Billing Controller</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-[#06b6d4] border border-cyan-500/40">
                <Lock className="w-3 h-3" /> PCI-DSS LEVEL 1 COMPLIANT
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-1">
              Super Admin authority to configure merchant gateways, manage API secrets, review transactions, and adjust promo codes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={() => handleTriggerPayout('JPMorgan Chase Master Account')}
            className="btn-sleek-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-105 transition-all flex items-center gap-2"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Instant Payout Batch</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1e293b] rounded-2xl p-5 border border-white/10 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#94a3b8]">
            <span className="label-xs">Monthly Processed Volume</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-[#06b6d4] flex items-center justify-center border border-cyan-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white">${totalVolumeUSD.toLocaleString()}</span>
            <span className="text-xs font-mono text-emerald-400 font-bold">+24.8% MoM</span>
          </div>
          <p className="text-[11px] text-[#94a3b8] font-mono">Across {gateways.filter((g) => g.isEnabled).length} active gateways</p>
        </div>

        <div className="bg-[#1e293b] rounded-2xl p-5 border border-white/10 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#94a3b8]">
            <span className="label-xs">Net Settlement Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-400">${netRevenueUSD.toLocaleString()}</span>
            <span className="text-xs font-mono text-emerald-400 font-bold">96.8% Net Margin</span>
          </div>
          <p className="text-[11px] text-[#94a3b8] font-mono">Est. Fees: ${totalFeesUSD.toLocaleString()}</p>
        </div>

        <div className="bg-[#1e293b] rounded-2xl p-5 border border-white/10 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#94a3b8]">
            <span className="label-xs">Active Gateways</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-[#6366f1] flex items-center justify-center border border-indigo-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white">5 / 6 Online</span>
            <span className="text-xs font-mono text-cyan-400 font-bold">99.98% Uptime</span>
          </div>
          <p className="text-[11px] text-[#94a3b8] font-mono">Multi-currency & Web3 enabled</p>
        </div>

        <div className="bg-[#1e293b] rounded-2xl p-5 border border-white/10 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#94a3b8]">
            <span className="label-xs">Chargeback & Dispute Risk</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white">0.02%</span>
            <span className="text-xs font-mono text-emerald-400 font-bold">EXCELLENT</span>
          </div>
          <p className="text-[11px] text-[#94a3b8] font-mono">Radar 3D Secure Protection Active</p>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveSubTab('gateways')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'gateways'
              ? 'bg-[#1e293b] text-[#06b6d4] border border-[#06b6d4]/40 shadow-sm'
              : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Gateway Integrations ({gateways.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('transactions')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'transactions'
              ? 'bg-[#1e293b] text-[#06b6d4] border border-[#06b6d4]/40 shadow-sm'
              : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Live Transactions ({transactions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('promos')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'promos'
              ? 'bg-[#1e293b] text-[#06b6d4] border border-[#06b6d4]/40 shadow-sm'
              : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Coupons & Promo Codes ({promos.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('payouts')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'payouts'
              ? 'bg-[#1e293b] text-[#06b6d4] border border-[#06b6d4]/40 shadow-sm'
              : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Bank Accounts & Settlements</span>
        </button>
      </div>

      {/* SubTab 1: Gateway Integrations */}
      {activeSubTab === 'gateways' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gateways.map((gw) => (
            <div
              key={gw.id}
              className={`bg-[#1e293b] rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between space-y-5 shadow-sm ${
                gw.isEnabled ? 'border-white/10 hover:border-cyan-500/40' : 'border-white/5 opacity-60'
              }`}
            >
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0f172a] border border-white/10 flex items-center justify-center font-bold text-xs text-white">
                      {gw.id === 'stripe' && <span className="text-[#6366f1] font-black">STRIPE</span>}
                      {gw.id === 'paypal' && <span className="text-[#06b6d4] font-black">PAYPAL</span>}
                      {gw.id === 'razorpay' && <span className="text-blue-400 font-black">RZP</span>}
                      {gw.id === 'paddle' && <span className="text-emerald-400 font-black">PDL</span>}
                      {gw.id === 'crypto_commerce' && <Coins className="w-5 h-5 text-amber-400" />}
                      {gw.id === 'lemon_squeezy' && <span className="text-yellow-400 font-black">🍋</span>}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{gw.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            gw.isEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                          }`}
                        />
                        <span className="text-[10px] font-mono text-[#94a3b8] uppercase">
                          {gw.isEnabled ? (gw.isTestMode ? 'TEST MODE' : 'LIVE PRODUCTION') : 'OFFLINE'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleGateway(gw.id)}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                      gw.isEnabled ? 'bg-[#06b6d4]' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        gw.isEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <p className="text-xs text-[#94a3b8] leading-relaxed min-h-[36px]">{gw.description}</p>
              </div>

              {/* Specs & Volume */}
              <div className="space-y-2.5 pt-2 border-t border-white/5 font-mono text-xs">
                <div className="flex justify-between text-[#94a3b8]">
                  <span>Monthly Throughput:</span>
                  <span className="text-white font-bold">${gw.monthlyVolumeUSD.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#94a3b8]">
                  <span>Gateway Fee:</span>
                  <span className="text-slate-300">
                    {gw.feePercentage}% + ${gw.fixedFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-[#94a3b8]">
                  <span>Currencies:</span>
                  <div className="flex gap-1">
                    {gw.currencies.slice(0, 3).map((c, i) => (
                      <span key={i} className="text-[9px] bg-[#0f172a] px-1.5 py-0.2 rounded border border-white/10 text-slate-300">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleToggleTestMode(gw.id)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold border transition-all ${
                    gw.isTestMode
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                      : 'bg-[#0f172a] text-slate-300 border-white/10 hover:text-white'
                  }`}
                >
                  {gw.isTestMode ? 'Switch to Live' : 'Switch to Test'}
                </button>

                <button
                  onClick={() => setEditingGateway(gw)}
                  className="btn-sleek-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:scale-105 transition-all"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configure API</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SubTab 2: Live Transactions */}
      {activeSubTab === 'transactions' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-[#1e293b] rounded-2xl p-4 border border-white/10 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-3" />
              <input
                type="text"
                value={txSearch}
                onChange={(e) => setTxSearch(e.target.value)}
                placeholder="Search by transaction reference, customer, or plan..."
                className="w-full bg-[#0f172a] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#06b6d4]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#94a3b8]">Gateway:</span>
              <select
                value={txGatewayFilter}
                onChange={(e) => setTxGatewayFilter(e.target.value)}
                className="bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#06b6d4]"
              >
                <option value="all">All Gateways</option>
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
                <option value="paddle">Paddle</option>
                <option value="razorpay">Razorpay</option>
                <option value="crypto_commerce">Crypto Web3</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#94a3b8]">Status:</span>
              <select
                value={txStatusFilter}
                onChange={(e) => setTxStatusFilter(e.target.value)}
                className="bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#06b6d4]"
              >
                <option value="all">All Statuses</option>
                <option value="succeeded">Succeeded</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-[#1e293b] rounded-2xl border border-white/10 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-[#111827] text-[#94a3b8] text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-4">Transaction Ref</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Gateway / Method</th>
                    <th className="py-3.5 px-4">Gross & Net</th>
                    <th className="py-3.5 px-4">Status & Risk</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{tx.transactionRef}</div>
                        <div className="text-[10px] text-[#94a3b8]">{tx.timestamp}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-sans font-bold text-slate-200">{tx.userName}</div>
                        <div className="text-[11px] text-[#94a3b8]">{tx.userEmail}</div>
                        <div className="text-[10px] text-[#06b6d4]">{tx.planName}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="uppercase font-bold text-slate-300">{tx.gateway}</div>
                        <div className="text-[10px] text-[#94a3b8]">
                          {tx.cardBrand ? `${tx.cardBrand} •••• ${tx.cardLast4}` : tx.paymentMethod.toUpperCase()}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-emerald-400 text-sm">
                          ${tx.amount.toFixed(2)} {tx.currency}
                        </div>
                        <div className="text-[10px] text-[#94a3b8]">
                          Fee: ${tx.fee.toFixed(2)} &bull; Net: ${tx.net.toFixed(2)}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                              tx.status === 'succeeded'
                                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                                : tx.status === 'refunded'
                                ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                                : 'bg-rose-950/60 text-rose-300 border-rose-500/30'
                            }`}
                          >
                            {tx.status}
                          </span>
                          <div className="text-[10px] text-slate-400">
                            Dispute Risk: <span className={tx.disputeRisk === 'low' ? 'text-emerald-400' : 'text-rose-400'}>{tx.disputeRisk.toUpperCase()}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {tx.receiptUrl && (
                            <a
                              href={tx.receiptUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-[#0f172a] hover:bg-[#334155] border border-white/10 text-[#06b6d4]"
                              title="View official receipt"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {tx.status === 'succeeded' && (
                            <button
                              onClick={() => setRefundModalTx(tx)}
                              className="px-2.5 py-1 rounded-lg bg-[#0f172a] hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 transition-colors text-[11px]"
                            >
                              Refund
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 3: Promo Codes & Coupons */}
      {activeSubTab === 'promos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Promo & Discount Codes</h3>
              <p className="text-xs text-[#94a3b8]">Create marketing discounts, partner coupon codes, and enterprise VIP vouchers</p>
            </div>

            <button
              onClick={() => setIsNewPromoModalOpen(true)}
              className="btn-sleek-primary text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-105 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Promo Code</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {promos.map((promo) => (
              <div
                key={promo.id}
                className="bg-[#1e293b] rounded-2xl p-5 border border-white/10 space-y-4 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-base text-[#06b6d4] bg-[#0f172a] px-2.5 py-1 rounded-lg border border-white/10 tracking-wider">
                      {promo.code}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                        promo.isActive
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border-white/5'
                      }`}
                    >
                      {promo.isActive ? 'ACTIVE' : 'PAUSED'}
                    </span>
                  </div>

                  <div className="pt-2">
                    <span className="text-2xl font-bold font-mono text-white">
                      {promo.discountPercentage}% OFF
                    </span>
                    <p className="text-xs text-[#94a3b8] font-mono">Applies to: {promo.appliesTo.toUpperCase()}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/5 text-[11px] font-mono text-[#94a3b8]">
                  <div className="flex justify-between">
                    <span>Redemptions:</span>
                    <span className="text-white font-bold">
                      {promo.timesRedeemed} / {promo.maxRedemptions}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expires:</span>
                    <span className="text-slate-300">{promo.expiresAt}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleTogglePromo(promo.id)}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline"
                  >
                    {promo.isActive ? 'Pause' : 'Activate'}
                  </button>

                  <button
                    onClick={() => handleDeletePromo(promo.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20"
                    title="Delete promo code"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 4: Bank Accounts & Settlements */}
      {activeSubTab === 'payouts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {payouts.map((acc) => (
              <div key={acc.id} className="bg-[#1e293b] rounded-2xl p-6 border border-white/10 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">{acc.bankName}</h4>
                      <p className="text-xs text-[#94a3b8] font-mono">{acc.accountHolder}</p>
                    </div>
                  </div>

                  {acc.isDefault && (
                    <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                      PRIMARY PAYOUT
                    </span>
                  )}
                </div>

                <div className="space-y-2 font-mono text-xs text-slate-300 bg-[#0f172a] p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">Account Number:</span>
                    <span className="font-bold text-white">{acc.accountNumberMasked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">Routing / IBAN:</span>
                    <span>{acc.routingOrIban}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">Settlement Currency:</span>
                    <span className="text-cyan-400 font-bold">{acc.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">Payout Schedule:</span>
                    <span className="text-emerald-400 uppercase font-bold">{acc.schedule}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Bank Account Verified
                  </span>
                  <button
                    onClick={() => handleTriggerPayout(acc.bankName)}
                    className="btn-sleek-primary text-white text-xs font-bold px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-105 transition-all"
                  >
                    Trigger Settlement
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Configure Gateway API Keys */}
      {editingGateway && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4 my-auto">
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#111827]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Configure {editingGateway.name}</h3>
                  <p className="text-xs text-[#94a3b8] font-mono">Super Admin Merchant API Credentials</p>
                </div>
              </div>
              <button
                onClick={() => setEditingGateway(null)}
                className="p-1.5 text-[#94a3b8] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGatewayConfig} className="p-6 space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-300 block">Publishable / Client Key</label>
                <input
                  type="text"
                  required
                  value={editingGateway.publishableKey}
                  onChange={(e) => setEditingGateway({ ...editingGateway, publishableKey: e.target.value })}
                  className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-[#06b6d4]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 block">Restricted Secret Key</label>
                <input
                  type="password"
                  required
                  value={editingGateway.secretKey}
                  onChange={(e) => setEditingGateway({ ...editingGateway, secretKey: e.target.value })}
                  className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-[#06b6d4]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 block">Webhook Signing Secret</label>
                <input
                  type="text"
                  value={editingGateway.webhookSecret}
                  onChange={(e) => setEditingGateway({ ...editingGateway, webhookSecret: e.target.value })}
                  className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-[#06b6d4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 block">Fee Percentage (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingGateway.feePercentage}
                    onChange={(e) => setEditingGateway({ ...editingGateway, feePercentage: parseFloat(e.target.value) })}
                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-[#06b6d4]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 block">Fixed Fee ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingGateway.fixedFee}
                    onChange={(e) => setEditingGateway({ ...editingGateway, fixedFee: parseFloat(e.target.value) })}
                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-[#06b6d4]"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0f172a] border border-white/10 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                  <input
                    type="checkbox"
                    checked={editingGateway.enforce3DS}
                    onChange={(e) => setEditingGateway({ ...editingGateway, enforce3DS: e.target.checked })}
                    className="accent-[#06b6d4]"
                  />
                  <span>Enforce 3D Secure / Radar Fraud Check</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                  <input
                    type="checkbox"
                    checked={editingGateway.autoCapture}
                    onChange={(e) => setEditingGateway({ ...editingGateway, autoCapture: e.target.checked })}
                    className="accent-[#06b6d4]"
                  />
                  <span>Automatic Charge Capture (Instant Settlement)</span>
                </label>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingGateway(null)}
                  className="px-4 py-2 rounded-xl text-[#94a3b8] hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-sleek-primary text-white font-bold px-5 py-2 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Gateway Settings</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Issue Refund */}
      {refundModalTx && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl space-y-4 my-auto">
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#111827]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Issue Refund Confirmation</h3>
                  <p className="text-xs text-[#94a3b8] font-mono">{refundModalTx.transactionRef}</p>
                </div>
              </div>
              <button
                onClick={() => setRefundModalTx(null)}
                className="p-1.5 text-[#94a3b8] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#0f172a] border border-white/5 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#94a3b8]">Customer:</span>
                  <span className="text-white font-bold">{refundModalTx.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94a3b8]">Total Amount:</span>
                  <span className="text-emerald-400 font-bold">${refundModalTx.amount.toFixed(2)} {refundModalTx.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94a3b8]">Gateway:</span>
                  <span className="text-cyan-400 uppercase font-bold">{refundModalTx.gateway}</span>
                </div>
              </div>

              <p className="text-[#94a3b8] text-xs">
                Refunding will immediately return the full transaction amount to the customer's original payment method.
              </p>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRefundModalTx(null)}
                  className="px-4 py-2 rounded-xl text-[#94a3b8] hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleIssueRefund(true)}
                  className="px-5 py-2 rounded-xl font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Execute Full Refund</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Promo Code */}
      {isNewPromoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl space-y-4 my-auto">
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#111827]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create Promo Voucher</h3>
                  <p className="text-xs text-[#94a3b8] font-mono">Super Admin Discount Code Generator</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewPromoModalOpen(false)}
                className="p-1.5 text-[#94a3b8] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePromo} className="p-6 space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-300 block">Promo Code Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SABLEPRO100"
                  value={newPromo.code}
                  onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value })}
                  className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-slate-200 uppercase focus:outline-none focus:border-[#06b6d4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 block">Discount %</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={newPromo.discountPercentage}
                    onChange={(e) => setNewPromo({ ...newPromo, discountPercentage: parseInt(e.target.value) })}
                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-[#06b6d4]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 block">Max Redemptions</label>
                  <input
                    type="number"
                    min="1"
                    value={newPromo.maxRedemptions}
                    onChange={(e) => setNewPromo({ ...newPromo, maxRedemptions: parseInt(e.target.value) })}
                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-[#06b6d4]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 block">Applies To Tier</label>
                <select
                  value={newPromo.appliesTo}
                  onChange={(e) => setNewPromo({ ...newPromo, appliesTo: e.target.value as any })}
                  className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-[#06b6d4]"
                >
                  <option value="all">All Plans & Tiers</option>
                  <option value="pro_creator">Creator Pro Only</option>
                  <option value="enterprise">Enterprise Only</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 block">Expiration Date</label>
                <input
                  type="date"
                  value={newPromo.expiresAt}
                  onChange={(e) => setNewPromo({ ...newPromo, expiresAt: e.target.value })}
                  className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-[#06b6d4]"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewPromoModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#94a3b8] hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-sleek-primary text-white font-bold px-5 py-2 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Create Code</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
