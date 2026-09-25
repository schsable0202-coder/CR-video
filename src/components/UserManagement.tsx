import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  Crown,
  Key,
  Edit3,
  Trash2,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Activity,
  Zap,
  HardDrive,
  Mail,
  Globe,
  Clock,
  Filter,
  RefreshCw,
  X,
  Plus,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { AppUser, UserRole, UserStatus } from '../types';
import {
  getStoredUsers,
  saveStoredUsers,
  SUPER_ADMIN_EMAIL,
  INITIAL_SUPER_ADMIN
} from '../utils/adminStorage';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals state
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [viewingAuditUser, setViewingAuditUser] = useState<AppUser | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // New user form state
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'pro_creator' as UserRole,
    planId: 'creator_pro',
    planName: 'Creator Pro',
    quotaLimit: 250,
    unlimitedQuota: false,
    country: 'United States',
    notes: ''
  });

  // Success toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const loaded = getStoredUsers();
    setUsers(loaded);
  };

  const handleSaveUsers = (updated: AppUser[]) => {
    setUsers(updated);
    saveStoredUsers(updated);
  };

  const handleCopyApiKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
    showToast('API Key copied to clipboard');
  };

  const handleToggleStatus = (user: AppUser) => {
    if (user.email === SUPER_ADMIN_EMAIL) {
      showToast('Super Admin account cannot be suspended');
      return;
    }
    const newStatus: UserStatus = user.status === 'active' ? 'suspended' : 'active';
    const updated = users.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u));
    handleSaveUsers(updated);
    showToast(`User ${user.name} is now ${newStatus.toUpperCase()}`);
  };

  const handleRegenerateApiKey = (user: AppUser) => {
    const newKey = `cr_live_${Math.random().toString(36).substring(2, 10)}_${Math.random().toString(36).substring(2, 10)}`;
    const updated = users.map((u) => (u.id === user.id ? { ...u, apiKey: newKey } : u));
    handleSaveUsers(updated);
    showToast(`New API key generated for ${user.name}`);
  };

  const handleDeleteUser = (user: AppUser) => {
    if (user.email === SUPER_ADMIN_EMAIL) {
      showToast('Cannot delete Root Super Admin account');
      return;
    }
    if (window.confirm(`Are you sure you want to delete user ${user.name} (${user.email})?`)) {
      const updated = users.filter((u) => u.id !== user.id);
      handleSaveUsers(updated);
      showToast(`User ${user.name} deleted successfully`);
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) {
      alert('Please provide a name and email');
      return;
    }

    const newUser: AppUser = {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role,
      status: 'active',
      planId: newUserForm.planId,
      planName: newUserForm.role === 'enterprise' ? 'Studio Enterprise' : newUserForm.role === 'super_admin' ? 'Root Super Admin' : 'Creator Pro',
      quotaUsed: 0,
      quotaLimit: newUserForm.unlimitedQuota ? 999999 : newUserForm.quotaLimit,
      unlimitedQuota: newUserForm.unlimitedQuota,
      registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      lastActive: 'Just registered',
      totalVideosProcessed: 0,
      apiKey: `cr_live_${Math.random().toString(36).substring(2, 12)}`,
      billingStatus: 'paid',
      country: newUserForm.country,
      ipAddress: '127.0.0.1 (Direct Provision)',
      notes: newUserForm.notes || 'Provisioned by Super Admin'
    };

    const updated = [newUser, ...users];
    handleSaveUsers(updated);
    setIsAddUserModalOpen(false);
    setNewUserForm({
      name: '',
      email: '',
      role: 'pro_creator',
      planId: 'creator_pro',
      planName: 'Creator Pro',
      quotaLimit: 250,
      unlimitedQuota: false,
      country: 'United States',
      notes: ''
    });
    showToast(`User ${newUser.name} created successfully!`);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updated = users.map((u) => (u.id === editingUser.id ? editingUser : u));
    handleSaveUsers(updated);
    setEditingUser(null);
    showToast(`User settings for ${editingUser.name} updated!`);
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate high-level stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const enterpriseUsers = users.filter((u) => u.role === 'enterprise').length;
  const totalProcessed = users.reduce((acc, u) => acc + u.totalVideosProcessed, 0);

  const getRoleBadge = (role: UserRole, email?: string) => {
    if (email === SUPER_ADMIN_EMAIL || role === 'super_admin') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-gradient-to-r from-amber-500/20 to-cyan-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
          <Crown className="w-3 h-3 text-amber-400" />
          SUPER ADMIN
        </span>
      );
    }
    if (role === 'admin') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          <ShieldCheck className="w-3 h-3 text-indigo-400" />
          ADMIN
        </span>
      );
    }
    if (role === 'enterprise') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
          <Zap className="w-3 h-3 text-purple-400" />
          ENTERPRISE
        </span>
      );
    }
    if (role === 'pro_creator') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
          PRO CREATOR
        </span>
      );
    }
    if (role === 'basic_creator') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-slate-800 text-slate-300 border border-white/10">
          BASIC
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono text-slate-400 bg-slate-800/60 border border-white/5">
        FREE TIER
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e293b] border border-cyan-500/40 text-cyan-200 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 font-mono text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner: Super Admin Mode Activated */}
      <div className="bg-[#1e293b] rounded-2xl p-6 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4 shadow-[0_0_25px_rgba(245,158,11,0.08)] relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(245,158,11,0.4)] shrink-0">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-white">Super Admin User Management Console</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <ShieldCheck className="w-3 h-3" /> ROOT ACCESS: {SUPER_ADMIN_EMAIL}
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-1">
              Full authority to manage creator accounts, adjust quota limits, generate API tokens, and enforce access controls.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="btn-sleek-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-105 transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Provision New User</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1e293b] rounded-2xl p-5 border border-white/10 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#94a3b8]">
            <span className="label-xs">Registered Creators</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-[#06b6d4] flex items-center justify-center border border-cyan-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white">{totalUsers}</span>
            <span className="text-xs font-mono text-emerald-400 font-bold">100% Verified</span>
          </div>
          <p className="text-[11px] text-[#94a3b8] font-mono">{activeUsers} active / {totalUsers - activeUsers} suspended</p>
        </div>

        <div className="bg-[#1e293b] rounded-2xl p-5 border border-white/10 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#94a3b8]">
            <span className="label-xs">Enterprise Accounts</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white">{enterpriseUsers}</span>
            <span className="text-xs font-mono text-purple-400 font-bold">Unlimited GPU Nodes</span>
          </div>
          <p className="text-[11px] text-[#94a3b8] font-mono">Automated API Webhook Ingestion</p>
        </div>

        <div className="bg-[#1e293b] rounded-2xl p-5 border border-white/10 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#94a3b8]">
            <span className="label-xs">Total Videos Cleared</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white">{totalProcessed.toLocaleString()}</span>
            <span className="text-xs font-mono text-emerald-400 font-bold">99.4% Pass Rate</span>
          </div>
          <p className="text-[11px] text-[#94a3b8] font-mono">0.6% Content ID Strike Rate</p>
        </div>

        <div className="bg-[#1e293b] rounded-2xl p-5 border border-white/10 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#94a3b8]">
            <span className="label-xs">Super Admin Role</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold font-mono text-amber-300 truncate max-w-[140px]">{SUPER_ADMIN_EMAIL.split('@')[0]}</span>
            <span className="text-xs font-mono text-amber-400 font-bold">ROOT #001</span>
          </div>
          <p className="text-[11px] text-[#94a3b8] font-mono">Unlimited Master Permissions</p>
        </div>
      </div>

      {/* Search, Filter and Actions Toolbar */}
      <div className="bg-[#1e293b] rounded-2xl p-4 border border-white/10 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, country, user ID, or IP..."
            className="w-full bg-[#0f172a] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#06b6d4]"
          />
        </div>

        {/* Role Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#94a3b8] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Role:
          </span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#06b6d4]"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="enterprise">Enterprise</option>
            <option value="pro_creator">Pro Creator</option>
            <option value="basic_creator">Basic Creator</option>
            <option value="free_tier">Free Tier</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#94a3b8]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#06b6d4]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
          </select>
        </div>

        <button
          onClick={loadUsers}
          className="p-2 rounded-xl bg-[#0f172a] hover:bg-[#334155] border border-white/10 text-[#94a3b8] hover:text-white transition-colors"
          title="Reload users"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Users Table */}
      <div className="bg-[#1e293b] rounded-2xl border border-white/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#111827] text-[#94a3b8] text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">Role & Access</th>
                <th className="py-3.5 px-4">Quota & Usage</th>
                <th className="py-3.5 px-4">Billing & Status</th>
                <th className="py-3.5 px-4">Activity & API Key</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => {
                const isSuperAdmin = user.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
                const quotaPercent = user.unlimitedQuota ? 0 : Math.min(100, Math.round((user.quotaUsed / user.quotaLimit) * 100));

                return (
                  <tr
                    key={user.id}
                    className={`hover:bg-white/5 transition-colors group ${
                      isSuperAdmin ? 'bg-amber-500/5 hover:bg-amber-500/10' : ''
                    } ${user.status === 'suspended' ? 'opacity-60 bg-rose-500/5' : ''}`}
                  >
                    {/* User Profile */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSuperAdmin
                              ? 'bg-gradient-to-br from-amber-500 to-cyan-500 text-white shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                              : user.status === 'suspended'
                              ? 'bg-rose-900/60 text-rose-300 border border-rose-700/50'
                              : 'bg-[#334155] text-slate-200 border border-white/10'
                          }`}
                        >
                          {user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white font-sans text-sm truncate">{user.name}</span>
                            {isSuperAdmin && (
                              <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            )}
                          </div>
                          <div className="text-[11px] text-[#94a3b8] flex items-center gap-1.5 truncate">
                            <Mail className="w-3 h-3 text-[#6366f1]" />
                            <span>{user.email}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Globe className="w-2.5 h-2.5" />
                            <span>{user.country}</span> &bull; <span>{user.ipAddress}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        {getRoleBadge(user.role, user.email)}
                        <p className="text-[10px] text-[#94a3b8]">{user.planName}</p>
                      </div>
                    </td>

                    {/* Quota */}
                    <td className="py-4 px-4">
                      <div className="space-y-1.5 max-w-[160px]">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-300">
                            {user.quotaUsed} {user.unlimitedQuota ? 'renders' : `/ ${user.quotaLimit}`}
                          </span>
                          <span className={user.unlimitedQuota ? 'text-purple-400 font-bold' : quotaPercent > 80 ? 'text-amber-400 font-bold' : 'text-[#06b6d4]'}>
                            {user.unlimitedQuota ? 'UNLIMITED' : `${quotaPercent}%`}
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          {user.unlimitedQuota ? (
                            <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full w-full rounded-full" />
                          ) : (
                            <div
                              className={`h-full rounded-full ${
                                quotaPercent > 90
                                  ? 'bg-rose-500'
                                  : quotaPercent > 70
                                  ? 'bg-amber-500'
                                  : 'bg-gradient-to-r from-[#6366f1] to-[#06b6d4]'
                              }`}
                              style={{ width: `${quotaPercent}%` }}
                            />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500">{user.totalVideosProcessed} lifetime jobs</p>
                      </div>
                    </td>

                    {/* Status & Billing */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              user.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                            }`}
                          />
                          <span
                            className={`text-xs font-bold uppercase ${
                              user.status === 'active' ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {user.status}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${
                            user.billingStatus === 'exempt'
                              ? 'bg-purple-950/60 text-purple-300 border-purple-500/30'
                              : user.billingStatus === 'paid'
                              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                              : user.billingStatus === 'trial'
                              ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30'
                              : 'bg-rose-950/60 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {user.billingStatus.toUpperCase()}
                        </span>
                      </div>
                    </td>

                    {/* API Key & Last Active */}
                    <td className="py-4 px-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <code className="bg-[#0f172a] px-2 py-0.5 rounded border border-white/10 text-[10px] text-slate-300 truncate max-w-[120px]">
                            {user.apiKey.substring(0, 14)}...
                          </code>
                          <button
                            onClick={() => handleCopyApiKey(user.id, user.apiKey)}
                            className="p-1 rounded bg-[#0f172a] hover:bg-[#334155] text-[#94a3b8] hover:text-white"
                            title="Copy API key"
                          >
                            {copiedKeyId === user.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="text-[10px] text-[#94a3b8] flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>Active: {user.lastActive}</span>
                        </div>
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-1.5 rounded-lg bg-[#0f172a] hover:bg-[#334155] border border-white/10 text-slate-300 hover:text-[#06b6d4] transition-colors"
                          title="Edit User & Quota"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleRegenerateApiKey(user)}
                          className="p-1.5 rounded-lg bg-[#0f172a] hover:bg-[#334155] border border-white/10 text-slate-300 hover:text-amber-300 transition-colors"
                          title="Regenerate API Key"
                        >
                          <Key className="w-3.5 h-3.5" />
                        </button>

                        {!isSuperAdmin && (
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              user.status === 'active'
                                ? 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-400'
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                            }`}
                            title={user.status === 'active' ? 'Suspend User' : 'Reactivate User'}
                          >
                            {user.status === 'active' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          </button>
                        )}

                        {!isSuperAdmin && (
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Provision New User */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4 my-auto">
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#111827]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#06b6d4] text-white flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Provision New Creator Account</h3>
                  <p className="text-xs text-[#94a3b8]">Create credentials and set custom processing limits</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1.5 text-[#94a3b8] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-300 block">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Blake"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-[#06b6d4]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 block">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="creator@network.com"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-[#06b6d4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 block">Role & Permissions</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as UserRole })}
                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-[#06b6d4]"
                  >
                    <option value="pro_creator">Pro Creator</option>
                    <option value="enterprise">Enterprise Studio</option>
                    <option value="admin">Administrator</option>
                    <option value="super_admin">Super Administrator</option>
                    <option value="basic_creator">Basic Creator</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 block">Country</label>
                  <input
                    type="text"
                    value={newUserForm.country}
                    onChange={(e) => setNewUserForm({ ...newUserForm, country: e.target.value })}
                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-[#06b6d4]"
                  />
                </div>
              </div>

              {/* Quota Settings */}
              <div className="p-3.5 rounded-xl bg-[#0f172a] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-200 font-bold">Monthly Processing Quota Limit</label>
                  <label className="flex items-center gap-2 cursor-pointer text-cyan-300">
                    <input
                      type="checkbox"
                      checked={newUserForm.unlimitedQuota}
                      onChange={(e) => setNewUserForm({ ...newUserForm, unlimitedQuota: e.target.checked })}
                      className="accent-[#06b6d4]"
                    />
                    <span>Unlimited Quota</span>
                  </label>
                </div>

                {!newUserForm.unlimitedQuota && (
                  <div>
                    <div className="flex justify-between text-[#94a3b8] mb-1">
                      <span>Renders per month:</span>
                      <span className="text-[#06b6d4] font-bold">{newUserForm.quotaLimit} Videos</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="2000"
                      step="10"
                      value={newUserForm.quotaLimit}
                      onChange={(e) => setNewUserForm({ ...newUserForm, quotaLimit: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-[#334155] rounded accent-[#06b6d4] cursor-pointer"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 block">Internal Notes</label>
                <input
                  type="text"
                  placeholder="e.g. VIP podcast network account"
                  value={newUserForm.notes}
                  onChange={(e) => setNewUserForm({ ...newUserForm, notes: e.target.value })}
                  className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-[#06b6d4]"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#94a3b8] hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-sleek-primary text-white font-bold px-5 py-2 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit User & Quota */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4 my-auto">
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#111827]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Edit User: {editingUser.name}</h3>
                  <p className="text-xs text-[#94a3b8]">{editingUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 text-[#94a3b8] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="p-6 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 block">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-[#06b6d4]"
                  >
                    <option value="super_admin">Super Administrator</option>
                    <option value="admin">Administrator</option>
                    <option value="enterprise">Enterprise Studio</option>
                    <option value="pro_creator">Pro Creator</option>
                    <option value="basic_creator">Basic Creator</option>
                    <option value="free_tier">Free Tier</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 block">Status</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as UserStatus })}
                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-[#06b6d4]"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Quota Adjuster */}
              <div className="p-3.5 rounded-xl bg-[#0f172a] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-slate-200 font-bold">Monthly Quota Limit</label>
                  <label className="flex items-center gap-2 cursor-pointer text-cyan-300">
                    <input
                      type="checkbox"
                      checked={editingUser.unlimitedQuota}
                      onChange={(e) => setEditingUser({ ...editingUser, unlimitedQuota: e.target.checked })}
                      className="accent-[#06b6d4]"
                    />
                    <span>Unlimited</span>
                  </label>
                </div>

                {!editingUser.unlimitedQuota && (
                  <div>
                    <div className="flex justify-between text-[#94a3b8] mb-1">
                      <span>Monthly Video Limit:</span>
                      <span className="text-[#06b6d4] font-bold">{editingUser.quotaLimit} Videos</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="5000"
                      step="10"
                      value={editingUser.quotaLimit}
                      onChange={(e) => setEditingUser({ ...editingUser, quotaLimit: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-[#334155] rounded accent-[#06b6d4] cursor-pointer"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px]">
                  <span className="text-[#94a3b8]">Currently Used:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{editingUser.quotaUsed} videos</span>
                    <button
                      type="button"
                      onClick={() => setEditingUser({ ...editingUser, quotaUsed: 0 })}
                      className="text-cyan-400 hover:text-cyan-300 underline text-[10px]"
                    >
                      Reset to 0
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 block">Admin Notes</label>
                <textarea
                  rows={2}
                  value={editingUser.notes || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, notes: e.target.value })}
                  className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-[#06b6d4]"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-[#94a3b8] hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-sleek-primary text-white font-bold px-5 py-2 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
