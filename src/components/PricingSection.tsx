import React, { useState } from 'react';
import {
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  CreditCard,
  X,
  Lock,
  ArrowRight,
  HelpCircle,
  Crown
} from 'lucide-react';
import { PricingPlan } from '../types';

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter Trial',
    priceMonthly: 0,
    priceAnnually: 0,
    description: 'Essential toolkit for occasional video creators and testing Content ID bypasses.',
    quota: '10 Videos / month',
    quotaNumber: 10,
    features: [
      '1080p Full HD Output',
      'EXIF & Metadata Deep Scrubbing',
      'Basic Acoustic Pitch Shift (±0.05%)',
      'Standard Processing Queue',
      'Community Discord Support'
    ],
    limitations: [
      'No 4K ProRes rendering',
      'Watermark eraser restricted to 1 box',
      'No API Access'
    ],
    buttonText: 'Current Plan'
  },
  {
    id: 'creator_pro',
    name: 'Creator Pro',
    priceMonthly: 49,
    priceAnnually: 39,
    badge: 'MOST POPULAR',
    popular: true,
    description: 'Designed for full-time streamers, YouTubers, editors, and podcast production networks.',
    quota: '250 Videos / month',
    quotaNumber: 250,
    features: [
      '4K UHD (60 FPS) Master Export',
      'Full EXIF, GPS & Container Purge',
      'Micro Audio Pitch & Phase Inverter',
      'Visual Micro-Crop & Affine Shift',
      'Spatial AI Watermark Inpainter (Unlimited)',
      'Adversarial AI Noise Injection (3 Levels)',
      'Priority GPU Supercomputer Queue',
      'Downloadable Compliance Audit Certificates'
    ],
    buttonText: 'Upgrade to Creator Pro'
  },
  {
    id: 'enterprise',
    name: 'Studio Enterprise',
    priceMonthly: 189,
    priceAnnually: 149,
    badge: 'AUTOMATION API',
    description: 'Automated infrastructure for media syndicates, podcast networks, and TV studios.',
    quota: 'Unlimited Feeds + REST API',
    quotaNumber: 999999,
    features: [
      'Everything in Creator Pro',
      'Unlimited 4K / 8K Master Streams',
      'REST API & Webhook Ingestion Pipeline',
      'Dedicated NVidia H100 GPU Nodes',
      'Custom LUT & Harmonic Acoustic Presets',
      'Automated Multi-Platform Strike Shield',
      '24/7 Dedicated Legal Compliance Support',
      '99.99% SLA & Custom Contracts'
    ],
    buttonText: 'Deploy Enterprise'
  }
];

export const PricingSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [checkoutCompleted, setCheckoutCompleted] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
    setCheckoutCompleted(false);
  };

  const handleCompleteCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingCheckout(true);
    setTimeout(() => {
      setIsProcessingCheckout(false);
      setCheckoutCompleted(true);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Title & Toggle Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="sleek-status-pill inline-block">
          Transparent Creator Pricing
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Scale Your Channel Without Copyright Strikes
        </h2>
        <p className="text-sm text-[#94a3b8]">
          Unleash autonomous AI neural sanitization, acoustic phase inversion, and spatial inpainting.
        </p>

        {/* Monthly / Annual Toggle */}
        <div className="inline-flex items-center gap-3 p-1.5 rounded-2xl bg-[#1e293b] border border-white/10 mt-4 shadow-sm">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              !isAnnual ? 'bg-[#0f172a] text-[#06b6d4] shadow-sm font-semibold' : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              isAnnual
                ? 'btn-sleek-primary text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] bg-emerald-400 text-black px-1.5 py-0.5 rounded font-bold">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {PRICING_PLANS.map((plan) => {
          const price = isAnnual ? plan.priceAnnually : plan.priceMonthly;
          const isPro = plan.popular;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                isPro
                  ? 'bg-[#1e293b] border-2 border-[#06b6d4] shadow-[0_0_25px_rgba(6,182,212,0.2)] scale-[1.02] z-10'
                  : 'bg-[#1e293b] border border-white/10 hover:border-white/20 shadow-sm'
              }`}
            >
              {/* Badge for Popular or Special Tier */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#6366f1] to-[#06b6d4] text-white font-bold font-mono text-[10px] tracking-wider uppercase px-3 py-1 rounded-full shadow-lg shadow-cyan-500/30">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    {isPro && <Crown className="w-5 h-5 text-amber-400" />}
                  </div>
                  <p className="text-xs text-[#94a3b8] mt-1 min-h-[36px]">{plan.description}</p>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-1 border-b border-white/10 pb-6">
                  <span className="text-4xl font-bold text-white">${price}</span>
                  <span className="text-xs font-mono text-[#94a3b8]">/ month</span>
                  {isAnnual && price > 0 && (
                    <span className="text-[11px] font-mono text-emerald-400 ml-2">billed annually</span>
                  )}
                </div>

                {/* Quota Pill */}
                <div className="p-3 rounded-xl bg-[#0f172a] border border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#94a3b8]">Monthly Quota:</span>
                  <span className="text-[#06b6d4] font-bold">{plan.quota}</span>
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  <p className="label-xs">
                    Included Features
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mt-0.5 shrink-0 border border-emerald-500/30">
                          <Check className="w-3 h-3" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3 px-5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm ${
                    isPro
                      ? 'btn-sleek-primary text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-[1.02]'
                      : 'bg-[#0f172a] hover:bg-[#111827] text-slate-200 border border-white/10 hover:border-white/20'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkout Modal Simulation */}
      {isCheckoutOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4 my-auto">
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#111827]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#06b6d4] text-white flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Secure SaaS Checkout</h3>
                  <p className="text-xs text-[#94a3b8] font-mono">256-Bit Encrypted Subscription</p>
                </div>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1.5 text-[#94a3b8] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {!checkoutCompleted ? (
                <form onSubmit={handleCompleteCheckout} className="space-y-4">
                  {/* Selected Plan Details Card */}
                  <div className="p-4 rounded-2xl bg-[#0f172a] border border-[#6366f1]/30 flex items-center justify-between">
                    <div>
                      <span className="label-xs">Selected Tier</span>
                      <h4 className="text-base font-bold text-white">{selectedPlan.name}</h4>
                      <p className="text-xs text-[#94a3b8]">{selectedPlan.quota}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold font-mono text-white">
                        ${isAnnual ? selectedPlan.priceAnnually : selectedPlan.priceMonthly}
                      </span>
                      <p className="text-[10px] text-[#94a3b8] font-mono">/ month</p>
                    </div>
                  </div>

                  {/* Payment Card Simulation Input */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-mono text-[#94a3b8] block mb-1">Card Information</label>
                      <div className="relative">
                        <input
                          type="text"
                          defaultValue="4242 4242 4242 4242"
                          className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#06b6d4]"
                        />
                        <div className="absolute right-3 top-2.5 text-xs font-mono text-[#94a3b8]">
                          VISA
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-mono text-[#94a3b8] block mb-1">Expiry Date</label>
                        <input
                          type="text"
                          defaultValue="12/28"
                          className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#06b6d4]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-[#94a3b8] block mb-1">CVC / CVV</label>
                        <input
                          type="text"
                          defaultValue="892"
                          className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#06b6d4]"
                        />
                      </div>
                    </div>

                    {/* Promo Code Input */}
                    <div className="pt-1">
                      <label className="text-xs font-mono text-[#94a3b8] block mb-1">Promo / Coupon Code</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Try CREATOR20"
                          className="flex-1 bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#06b6d4] uppercase"
                        />
                        <button
                          type="button"
                          onClick={() => setPromoApplied(true)}
                          className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#0f172a] hover:bg-[#111827] text-[#06b6d4] border border-white/10"
                        >
                          Apply
                        </button>
                      </div>
                      {promoApplied && (
                        <p className="text-[11px] font-mono text-emerald-400 mt-1">
                          ✓ Coupon applied: 20% recurring discount active
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Total & Submit */}
                  <div className="pt-3 border-t border-white/10 space-y-3">
                    <div className="flex justify-between text-xs font-mono text-slate-300">
                      <span>Instant Activation:</span>
                      <span className="text-emerald-400 font-bold">250 AI Credits Included</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessingCheckout}
                      className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider btn-sleek-primary text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                    >
                      {isProcessingCheckout ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Authorizing Subscription...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Confirm & Activate {selectedPlan.name}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Success State */
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-500/40">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-white">Plan Upgraded Successfully!</h4>
                    <p className="text-xs text-slate-300 font-mono">
                      Your account has been promoted to <strong className="text-[#06b6d4]">{selectedPlan.name}</strong>.
                    </p>
                  </div>
                  <p className="text-xs text-[#94a3b8] max-w-sm mx-auto">
                    Full 4K ProRes master rendering, unlimited watermark inpainting masks, and acoustic drift bypass algorithms are now unlocked.
                  </p>
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold btn-sleek-primary text-white hover:scale-105 transition-all uppercase tracking-wider"
                  >
                    Return to Processing Hub
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
