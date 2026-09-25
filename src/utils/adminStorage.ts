import { AppUser, GatewayConfig, GatewayTransaction, PromoCode, PayoutAccount, UserRole } from '../types';

const STORAGE_KEYS = {
  USERS: 'cr_remover_users_v2',
  GATEWAYS: 'cr_remover_gateways_v2',
  TRANSACTIONS: 'cr_remover_transactions_v2',
  PROMO_CODES: 'cr_remover_promos_v2',
  PAYOUTS: 'cr_remover_payouts_v2',
  CURRENT_ADMIN: 'cr_remover_super_admin_v2',
};

export const SUPER_ADMIN_EMAIL = 'schsable@gmail.com';

export const INITIAL_SUPER_ADMIN: AppUser = {
  id: 'usr_super_admin_001',
  name: 'Sable (Super Admin)',
  email: SUPER_ADMIN_EMAIL,
  avatarUrl: '',
  role: 'super_admin',
  status: 'active',
  planId: 'enterprise',
  planName: 'Root Super Admin',
  quotaUsed: 142,
  quotaLimit: 999999,
  unlimitedQuota: true,
  registeredAt: '2025-01-15 08:30 UTC',
  lastActive: 'Just now',
  totalVideosProcessed: 489,
  apiKey: 'cr_live_sec_99a8b7c6d5e4f3a2b1_root_superadmin',
  billingStatus: 'exempt',
  country: 'United States',
  ipAddress: '192.0.2.1 (Admin Gateway)',
  notes: 'Primary Master Super Administrator with unrestricted root access to user management, payment gateways, and engine infrastructure.'
};

export const INITIAL_USERS: AppUser[] = [
  INITIAL_SUPER_ADMIN,
  {
    id: 'usr_adm_002',
    name: 'Alex Rivera',
    email: 'alex.rivera@creatorlabs.io',
    role: 'admin',
    status: 'active',
    planId: 'creator_pro',
    planName: 'Creator Pro (Staff)',
    quotaUsed: 88,
    quotaLimit: 500,
    unlimitedQuota: false,
    registeredAt: '2025-03-10 14:22 UTC',
    lastActive: '12 mins ago',
    totalVideosProcessed: 214,
    apiKey: 'cr_live_adm_77f8e9a2b3c4',
    billingStatus: 'exempt',
    country: 'United States',
    ipAddress: '198.51.100.45',
    notes: 'Content moderation & support administrator'
  },
  {
    id: 'usr_pro_003',
    name: 'Marcus Vance',
    email: 'marcus.vance@soundstorm.media',
    role: 'pro_creator',
    status: 'active',
    planId: 'creator_pro',
    planName: 'Creator Pro',
    quotaUsed: 184,
    quotaLimit: 250,
    unlimitedQuota: false,
    registeredAt: '2025-05-18 11:05 UTC',
    lastActive: '2 hours ago',
    totalVideosProcessed: 390,
    apiKey: 'cr_live_usr_55c4d3e2a1b9',
    billingStatus: 'paid',
    country: 'United Kingdom',
    ipAddress: '82.165.197.1',
    notes: 'Top tier gaming channel, frequent batch renderer'
  },
  {
    id: 'usr_ent_004',
    name: 'Elena Rostova',
    email: 'elena.rostova@cinepulse.net',
    role: 'enterprise',
    status: 'active',
    planId: 'enterprise',
    planName: 'Studio Enterprise',
    quotaUsed: 620,
    quotaLimit: 2000,
    unlimitedQuota: true,
    registeredAt: '2025-02-01 09:15 UTC',
    lastActive: '5 mins ago',
    totalVideosProcessed: 1420,
    apiKey: 'cr_live_ent_112233445566',
    billingStatus: 'paid',
    country: 'Canada',
    ipAddress: '142.250.190.46',
    notes: 'Syndicated documentary studio, uses automated REST API'
  },
  {
    id: 'usr_pro_005',
    name: 'David Kim',
    email: 'david.kim@nexusstream.gg',
    role: 'pro_creator',
    status: 'active',
    planId: 'creator_pro',
    planName: 'Creator Pro',
    quotaUsed: 45,
    quotaLimit: 250,
    unlimitedQuota: false,
    registeredAt: '2025-06-22 19:40 UTC',
    lastActive: '1 day ago',
    totalVideosProcessed: 98,
    apiKey: 'cr_live_usr_998877665544',
    billingStatus: 'paid',
    country: 'South Korea',
    ipAddress: '211.234.118.5',
    notes: 'Esports highlight reel editor'
  },
  {
    id: 'usr_ent_006',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@viralhub.agency',
    role: 'enterprise',
    status: 'active',
    planId: 'enterprise',
    planName: 'Studio Enterprise',
    quotaUsed: 890,
    quotaLimit: 3000,
    unlimitedQuota: true,
    registeredAt: '2025-04-12 16:30 UTC',
    lastActive: '45 mins ago',
    totalVideosProcessed: 2890,
    apiKey: 'cr_live_ent_887766554433',
    billingStatus: 'paid',
    country: 'Australia',
    ipAddress: '139.130.4.5',
    notes: 'TikTok & Reels content network agency'
  },
  {
    id: 'usr_bas_007',
    name: 'Kevin Tanaka',
    email: 'kevin.t@freelancecut.com',
    role: 'basic_creator',
    status: 'active',
    planId: 'starter',
    planName: 'Starter Trial',
    quotaUsed: 8,
    quotaLimit: 10,
    unlimitedQuota: false,
    registeredAt: '2025-07-01 10:11 UTC',
    lastActive: '3 days ago',
    totalVideosProcessed: 14,
    apiKey: 'cr_live_usr_332211009988',
    billingStatus: 'trial',
    country: 'Japan',
    ipAddress: '133.242.18.2',
    notes: 'Approaching quota limit'
  },
  {
    id: 'usr_pro_008',
    name: 'Luna Sterling',
    email: 'luna.sound@beatsmith.co',
    role: 'pro_creator',
    status: 'active',
    planId: 'creator_pro',
    planName: 'Creator Pro',
    quotaUsed: 130,
    quotaLimit: 250,
    unlimitedQuota: false,
    registeredAt: '2025-07-15 08:20 UTC',
    lastActive: '4 hours ago',
    totalVideosProcessed: 240,
    apiKey: 'cr_live_usr_445566778899',
    billingStatus: 'paid',
    country: 'Germany',
    ipAddress: '185.86.151.11',
    notes: 'Music producer testing acoustic pitch algorithms'
  },
  {
    id: 'usr_sus_009',
    name: 'Suspicious Scraper Bot',
    email: 'bot99@scrapenet-farm.cc',
    role: 'free_tier',
    status: 'suspended',
    planId: 'starter',
    planName: 'Starter Trial (Suspended)',
    quotaUsed: 10,
    quotaLimit: 10,
    unlimitedQuota: false,
    registeredAt: '2025-08-01 02:14 UTC',
    lastActive: '1 week ago',
    totalVideosProcessed: 10,
    apiKey: 'cr_revoked_key_00998877',
    billingStatus: 'past_due',
    country: 'Seychelles',
    ipAddress: '194.26.29.112',
    notes: 'Suspended by Super Admin for repeated unauthorized scraping and concurrent flood requests.'
  }
];

export const INITIAL_GATEWAYS: GatewayConfig[] = [
  {
    id: 'stripe',
    name: 'Stripe Payments',
    description: 'Primary credit & debit card processing engine with 3D Secure 2.0 & Apple/Google Pay.',
    logo: 'stripe',
    isEnabled: true,
    isTestMode: false,
    currencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'],
    defaultCurrency: 'USD',
    publishableKey: 'pk_live_51Ny9s8K92xLmP4qR01SuperAdminMasterKey',
    secretKey: 'sk_live_51Ny9s8K92xLmP4qR99SuperAdminSecretKey_••••••••',
    webhookSecret: 'whsec_8b9a1c2d3e4f5g6h7i8j9k0l_encrypted',
    merchantId: 'acct_1Ny9s8K92xLmP4qR',
    enforce3DS: true,
    autoCapture: true,
    feePercentage: 2.9,
    fixedFee: 0.30,
    monthlyVolumeUSD: 38420,
    status: 'operational'
  },
  {
    id: 'paypal',
    name: 'PayPal Commerce',
    description: 'Global PayPal wallet checkout, Venmo, Pay in 4 installment financing.',
    logo: 'paypal',
    isEnabled: true,
    isTestMode: false,
    currencies: ['USD', 'EUR', 'GBP', 'AUD', 'CAD'],
    defaultCurrency: 'USD',
    publishableKey: 'AX_Live_PayPal_ClientID_998877665544332211',
    secretKey: 'EL_Live_PayPal_ClientSecret_••••••••••••••••••••',
    webhookSecret: 'wh_paypal_live_signature_verified',
    merchantId: 'MERCHANT_ID_SABLE_PRO',
    enforce3DS: false,
    autoCapture: true,
    feePercentage: 3.49,
    fixedFee: 0.49,
    monthlyVolumeUSD: 14890,
    status: 'operational'
  },
  {
    id: 'paddle',
    name: 'Paddle (Merchant of Record)',
    description: 'Handles worldwide SaaS VAT/GST tax compliance, invoicing, and localized localized pricing.',
    logo: 'paddle',
    isEnabled: true,
    isTestMode: false,
    currencies: ['USD', 'EUR', 'GBP', 'SGD', 'CHF'],
    defaultCurrency: 'USD',
    publishableKey: 'paddle_live_vendor_992144',
    secretKey: 'paddle_sec_api_key_••••••••••••••••••••••••',
    webhookSecret: 'pdl_wh_signature_auth_token_99',
    merchantId: 'vendor_992144',
    enforce3DS: true,
    autoCapture: true,
    feePercentage: 5.0,
    fixedFee: 0.50,
    monthlyVolumeUSD: 12450,
    status: 'operational'
  },
  {
    id: 'razorpay',
    name: 'Razorpay India',
    description: 'Seamless Indian INR processing supporting UPI (GPay/PhonePe), NetBanking, and RuPay cards.',
    logo: 'razorpay',
    isEnabled: true,
    isTestMode: false,
    currencies: ['INR', 'USD'],
    defaultCurrency: 'INR',
    publishableKey: 'rzp_live_keyId_8899001122',
    secretKey: 'rzp_live_secret_••••••••••••••••',
    webhookSecret: 'rzp_webhook_secret_hash_256',
    merchantId: 'mid_rzp_superadmin',
    enforce3DS: true,
    autoCapture: true,
    feePercentage: 2.0,
    fixedFee: 0.0,
    monthlyVolumeUSD: 8200,
    status: 'operational'
  },
  {
    id: 'crypto_commerce',
    name: 'Crypto Web3 Gateway',
    description: 'Decentralized instant settlements in USDC, USDT (Polygon/Arbitrum/Solana) and BTC.',
    logo: 'crypto',
    isEnabled: true,
    isTestMode: false,
    currencies: ['USDC', 'USDT', 'BTC', 'ETH'],
    defaultCurrency: 'USDC',
    publishableKey: '0x71C...392b (Multi-Sig Vault Address)',
    secretKey: 'kms_crypto_signer_key_••••••••••••••••',
    webhookSecret: 'web3_block_confirm_listener_active',
    merchantId: 'vault_multisig_0x71C',
    enforce3DS: false,
    autoCapture: true,
    feePercentage: 0.5,
    fixedFee: 0.0,
    monthlyVolumeUSD: 9640,
    status: 'operational'
  },
  {
    id: 'lemon_squeezy',
    name: 'Lemon Squeezy',
    description: 'Turnkey MoR solution with integrated software license keys and affiliate tracking.',
    logo: 'lemonsqueezy',
    isEnabled: false,
    isTestMode: true,
    currencies: ['USD', 'EUR'],
    defaultCurrency: 'USD',
    publishableKey: 'lmsq_test_store_id_334455',
    secretKey: 'lmsq_test_api_••••••••••••••••',
    webhookSecret: 'lmsq_wh_signing_token',
    merchantId: 'store_334455',
    enforce3DS: true,
    autoCapture: true,
    feePercentage: 5.0,
    fixedFee: 0.50,
    monthlyVolumeUSD: 0,
    status: 'disabled'
  }
];

export const INITIAL_TRANSACTIONS: GatewayTransaction[] = [
  {
    id: 'tx_998124',
    transactionRef: 'pi_3Nx9a8b7c6d5e4f3',
    gateway: 'stripe',
    userId: 'usr_ent_006',
    userName: 'Sarah Jenkins',
    userEmail: 'sarah.jenkins@viralhub.agency',
    amount: 189.00,
    currency: 'USD',
    fee: 5.78,
    net: 183.22,
    planName: 'Studio Enterprise (Monthly)',
    paymentMethod: 'card',
    cardLast4: '4242',
    cardBrand: 'Visa',
    status: 'succeeded',
    timestamp: '2026-08-28 19:45 UTC',
    disputeRisk: 'low',
    receiptUrl: 'https://pay.stripe.com/receipts/acct_1Ny9s8K/ch_3Nx9a8b/rcpt_991'
  },
  {
    id: 'tx_998123',
    transactionRef: 'PAYID-MT38492019',
    gateway: 'paypal',
    userId: 'usr_pro_003',
    userName: 'Marcus Vance',
    userEmail: 'marcus.vance@soundstorm.media',
    amount: 49.00,
    currency: 'USD',
    fee: 2.20,
    net: 46.80,
    planName: 'Creator Pro (Monthly)',
    paymentMethod: 'paypal',
    status: 'succeeded',
    timestamp: '2026-08-28 17:12 UTC',
    disputeRisk: 'low',
    receiptUrl: 'https://paypal.com/invoice/s/998123'
  },
  {
    id: 'tx_998122',
    transactionRef: '0x8f7e6d5c4b3a2190',
    gateway: 'crypto_commerce',
    userId: 'usr_ent_004',
    userName: 'Elena Rostova',
    userEmail: 'elena.rostova@cinepulse.net',
    amount: 1788.00,
    currency: 'USDC',
    fee: 8.94,
    net: 1779.06,
    planName: 'Studio Enterprise (Annual Pre-pay)',
    paymentMethod: 'crypto',
    status: 'succeeded',
    timestamp: '2026-08-28 14:03 UTC',
    disputeRisk: 'low'
  },
  {
    id: 'tx_998121',
    transactionRef: 'pay_Nz8291039482',
    gateway: 'razorpay',
    userId: 'usr_pro_005',
    userName: 'David Kim',
    userEmail: 'david.kim@nexusstream.gg',
    amount: 49.00,
    currency: 'USD',
    fee: 0.98,
    net: 48.02,
    planName: 'Creator Pro (Monthly)',
    paymentMethod: 'card',
    cardLast4: '8819',
    cardBrand: 'Mastercard',
    status: 'succeeded',
    timestamp: '2026-08-28 11:25 UTC',
    disputeRisk: 'low'
  },
  {
    id: 'tx_998120',
    transactionRef: 'pdl_txn_5544332211',
    gateway: 'paddle',
    userId: 'usr_pro_008',
    userName: 'Luna Sterling',
    userEmail: 'luna.sound@beatsmith.co',
    amount: 468.00,
    currency: 'USD',
    fee: 23.90,
    net: 444.10,
    planName: 'Creator Pro (Annual Subscription)',
    paymentMethod: 'card',
    cardLast4: '1124',
    cardBrand: 'Visa',
    status: 'succeeded',
    timestamp: '2026-08-27 22:15 UTC',
    disputeRisk: 'low'
  },
  {
    id: 'tx_998119',
    transactionRef: 'pi_3Nw89012345678',
    gateway: 'stripe',
    userId: 'usr_sus_009',
    userName: 'Suspicious Scraper Bot',
    userEmail: 'bot99@scrapenet-farm.cc',
    amount: 49.00,
    currency: 'USD',
    fee: 0.00,
    net: 0.00,
    planName: 'Creator Pro Attempt',
    paymentMethod: 'card',
    cardLast4: '0002',
    cardBrand: 'Prepaid Visa',
    status: 'failed',
    timestamp: '2026-08-27 03:40 UTC',
    disputeRisk: 'high'
  }
];

export const INITIAL_PROMO_CODES: PromoCode[] = [
  {
    id: 'prm_001',
    code: 'SUPERADMIN100',
    discountPercentage: 100,
    discountType: 'percentage',
    appliesTo: 'all',
    maxRedemptions: 9999,
    timesRedeemed: 42,
    isActive: true,
    expiresAt: '2030-12-31',
    createdAt: '2025-01-01',
    createdBy: SUPER_ADMIN_EMAIL
  },
  {
    id: 'prm_002',
    code: 'CREATOR20',
    discountPercentage: 20,
    discountType: 'percentage',
    appliesTo: 'pro_creator',
    maxRedemptions: 500,
    timesRedeemed: 184,
    isActive: true,
    expiresAt: '2026-12-31',
    createdAt: '2025-05-01',
    createdBy: SUPER_ADMIN_EMAIL
  },
  {
    id: 'prm_003',
    code: 'ENTERPRISE50',
    discountPercentage: 50,
    discountType: 'percentage',
    appliesTo: 'enterprise',
    maxRedemptions: 50,
    timesRedeemed: 18,
    isActive: true,
    expiresAt: '2026-11-30',
    createdAt: '2025-06-15',
    createdBy: SUPER_ADMIN_EMAIL
  },
  {
    id: 'prm_004',
    code: 'LAUNCHVIP',
    discountPercentage: 30,
    discountType: 'percentage',
    appliesTo: 'all',
    maxRedemptions: 200,
    timesRedeemed: 198,
    isActive: true,
    expiresAt: '2026-10-01',
    createdAt: '2025-07-01',
    createdBy: SUPER_ADMIN_EMAIL
  }
];

export const INITIAL_PAYOUTS: PayoutAccount[] = [
  {
    id: 'pay_acc_01',
    bankName: 'JPMorgan Chase & Co.',
    accountHolder: 'CR-Remover Global LLC (Sable Root)',
    accountNumberMasked: '•••••••• 8821',
    routingOrIban: '021000021 (Routing)',
    currency: 'USD',
    schedule: 'daily',
    isDefault: true,
    status: 'verified'
  },
  {
    id: 'pay_acc_02',
    bankName: 'Barclays International UK',
    accountHolder: 'CR-Remover EU Operations',
    accountNumberMasked: '•••••••• 3390',
    routingOrIban: 'GB29BARC20000087654321',
    currency: 'GBP / EUR',
    schedule: 'weekly',
    isDefault: false,
    status: 'verified'
  }
];

// Helper functions for persistent storage
export function getStoredUsers(): AppUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const users = JSON.parse(raw);
    // Ensure Super Admin is always present and matches schsable@gmail.com
    const hasSuperAdmin = users.some((u: AppUser) => u.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase());
    if (!hasSuperAdmin) {
      users.unshift(INITIAL_SUPER_ADMIN);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
    return users;
  } catch (e) {
    console.error('Failed to load users from localStorage', e);
    return INITIAL_USERS;
  }
}

export function saveStoredUsers(users: AppUser[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users to localStorage', e);
  }
}

export function getStoredGateways(): GatewayConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GATEWAYS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.GATEWAYS, JSON.stringify(INITIAL_GATEWAYS));
      return INITIAL_GATEWAYS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load gateways from localStorage', e);
    return INITIAL_GATEWAYS;
  }
}

export function saveStoredGateways(gateways: GatewayConfig[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GATEWAYS, JSON.stringify(gateways));
  } catch (e) {
    console.error('Failed to save gateways to localStorage', e);
  }
}

export function getStoredTransactions(): GatewayTransaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load transactions from localStorage', e);
    return INITIAL_TRANSACTIONS;
  }
}

export function saveStoredTransactions(transactions: GatewayTransaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (e) {
    console.error('Failed to save transactions to localStorage', e);
  }
}

export function getStoredPromos(): PromoCode[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROMO_CODES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROMO_CODES, JSON.stringify(INITIAL_PROMO_CODES));
      return INITIAL_PROMO_CODES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load promos from localStorage', e);
    return INITIAL_PROMO_CODES;
  }
}

export function saveStoredPromos(promos: PromoCode[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROMO_CODES, JSON.stringify(promos));
  } catch (e) {
    console.error('Failed to save promos to localStorage', e);
  }
}

export function getStoredPayouts(): PayoutAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PAYOUTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PAYOUTS, JSON.stringify(INITIAL_PAYOUTS));
      return INITIAL_PAYOUTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load payouts from localStorage', e);
    return INITIAL_PAYOUTS;
  }
}

export function saveStoredPayouts(payouts: PayoutAccount[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PAYOUTS, JSON.stringify(payouts));
  } catch (e) {
    console.error('Failed to save payouts to localStorage', e);
  }
}
