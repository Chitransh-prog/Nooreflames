'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  Truck,
  Image as ImageIcon,
  Tag,
  Rocket,
  Save,
  Search,
  Plus,
  Edit2,
  Edit3,
  Trash2,
  CheckCircle2,
  Eye,
  EyeOff,
  ExternalLink,
  RefreshCw,
  Film,
  Play,
  Volume2,
  LogOut,
  Upload,
  Sparkles,
  Sliders,
  FileText,
  X,
  Layers,
  MessageSquare,
  Send,
  Phone,
  Users,
  CheckSquare,
  Square,
  Check,
  AlertCircle,
  Clock,
  Copy,
  Filter,
  Mail,
  Download,
  UserPlus,
  MapPin,
  ShoppingBag,
  MessageCircle,
  ChevronDown,
  Calendar,
  UserCheck,
  Shield,
  ShieldCheck,
  Key,
  Lock,
  UserCog,
} from 'lucide-react';
import { StoreData, Product, Order, Coupon, VideoPlaylistItem } from '@/lib/store';
import { WHATSAPP_SENDER_PHONE, getWhatsAppLink, getFormattedWhatsAppNumber } from '@/lib/whatsapp';
import {
  AdminRole,
  AdminTab,
  AdminTeamUser,
  ROLE_DEFINITIONS,
  ALL_ADMIN_TABS,
  DEFAULT_ROLE_PERMISSIONS,
  getAllowedTabsForRole,
  canRoleAccessTab,
  INITIAL_TEAM_MEMBERS,
} from '@/lib/rbac';

export default function AdminClient({
  initialData,
  currentUser,
  envSenderPhone,
}: {
  initialData: StoreData;
  currentUser?: { email: string; role: AdminRole; name?: string };
  envSenderPhone?: string;
}) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const navContainerRef = useRef<HTMLElement>(null);

  // Auto-scroll active tab into view in mobile bottom dock
  useEffect(() => {
    if (navContainerRef.current) {
      const activeBtn = navContainerRef.current.querySelector<HTMLElement>('.admin-bottom-nav-item.active, .admin-nav-item.active');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeTab]);

  const [storeData, setStoreData] = useState<StoreData>(() => ({
    ...initialData,
    orders: Array.isArray(initialData?.orders) ? initialData.orders : [],
    products: Array.isArray(initialData?.products) ? initialData.products : [],
    coupons: Array.isArray(initialData?.coupons) ? initialData.coupons : [],
  }));
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Helper to attach authorization header if admin token is stored in localStorage
  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('nf_admin_token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // Role-Based Access Control (RBAC) state
  const [activeRole, setActiveRole] = useState<AdminRole>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nf_active_role') as AdminRole;
      if (saved && ROLE_DEFINITIONS[saved]) return saved;
    }
    return currentUser?.role || 'administrator';
  });

  // Dynamic Customizable Role Permissions (Admin Controlled)
  const [rolePermissions, setRolePermissions] = useState<Record<AdminRole, AdminTab[]>>(() => {
    if (initialData?.rolePermissions && typeof initialData.rolePermissions === 'object') {
      return initialData.rolePermissions;
    }
    return DEFAULT_ROLE_PERMISSIONS;
  });
  const [isSavingPermissions, setIsSavingPermissions] = useState(false);
  const [hasUnsavedPermissions, setHasUnsavedPermissions] = useState(false);
  const [permissionNotice, setPermissionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Individual staff member custom tab overrides modal state
  const [editingMemberTabs, setEditingMemberTabs] = useState<AdminTeamUser | null>(null);
  const [memberCustomTabs, setMemberCustomTabs] = useState<AdminTab[]>([]);
  const [isSavingMemberTabs, setIsSavingMemberTabs] = useState(false);

  // Role Specifier & Credential Management state
  const [specifierSearch, setSpecifierSearch] = useState('');
  const [specifierRoleFilter, setSpecifierRoleFilter] = useState<'all' | AdminRole>('all');
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [editingCredMember, setEditingCredMember] = useState<AdminTeamUser | null>(null);
  const [editCredName, setEditCredName] = useState('');
  const [editCredUsername, setEditCredUsername] = useState('');
  const [editCredEmail, setEditCredEmail] = useState('');
  const [editCredPassword, setEditCredPassword] = useState('');
  const [editCredRole, setEditCredRole] = useState<AdminRole>('editor');
  const [editCredPhone, setEditCredPhone] = useState('');
  const [editCredStatus, setEditCredStatus] = useState<'active' | 'suspended'>('active');
  const [editCredTabs, setEditCredTabs] = useState<AdminTab[]>([]);
  const [isSavingCreds, setIsSavingCreds] = useState(false);
  const [copiedCredId, setCopiedCredId] = useState<string | null>(null);

  const [teamMembers, setTeamMembers] = useState<AdminTeamUser[]>(() => {
    return Array.isArray(initialData?.adminUsers) && initialData.adminUsers.length > 0
      ? initialData.adminUsers
      : INITIAL_TEAM_MEMBERS;
  });

  const [usersSubTab, setUsersSubTab] = useState<'patrons' | 'team'>('patrons');
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamUsername, setNewTeamUsername] = useState('');
  const [newTeamEmail, setNewTeamEmail] = useState('');
  const [newTeamRole, setNewTeamRole] = useState<AdminRole>('editor');
  const [newTeamPassword, setNewTeamPassword] = useState('nooreflames');
  const [newTeamPhone, setNewTeamPhone] = useState('+919289289800');
  const [isSubmittingTeam, setIsSubmittingTeam] = useState(false);
  const [teamActionNotice, setTeamActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Compute allowed tabs for active role (dynamically driven by rolePermissions)
  const allowedTabs: AdminTab[] = useMemo(() => {
    return getAllowedTabsForRole(activeRole, undefined, rolePermissions);
  }, [activeRole, rolePermissions]);

  // Tab permission checker
  const canAccessTab = (tab: AdminTab) => allowedTabs.includes(tab);

  // Auto-switch to first permitted tab if activeTab is not allowed
  useEffect(() => {
    if (!allowedTabs.includes(activeTab as AdminTab)) {
      if (allowedTabs.length > 0) {
        setActiveTab(allowedTabs[0] as any);
      }
    }
  }, [activeRole, allowedTabs, activeTab]);

  const handleRoleSwitch = (newRole: AdminRole) => {
    setActiveRole(newRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nf_active_role', newRole);
    }
    const newAllowed = getAllowedTabsForRole(newRole, undefined, rolePermissions);
    if (!newAllowed.includes(activeTab as AdminTab) && newAllowed.length > 0) {
      setActiveTab(newAllowed[0] as any);
    }
  };

  const loadTeamMembers = async () => {
    try {
      const res = await fetch('/api/admin/team', {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        if (Array.isArray(data.teamMembers)) {
          setTeamMembers(data.teamMembers);
        }
        if (data.rolePermissions && typeof data.rolePermissions === 'object') {
          setRolePermissions(data.rolePermissions);
        }
      }
    } catch (err) {
      console.error('Failed to load team members:', err);
    }
  };

  const handleSaveTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamEmail.trim()) {
      setTeamActionNotice({ type: 'error', message: 'Email address is required.' });
      return;
    }
    setIsSubmittingTeam(true);
    setTeamActionNotice(null);
    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: newTeamName.trim(),
          username: (newTeamUsername.trim() || newTeamEmail.trim().split('@')[0]).toLowerCase().replace(/[^a-z0-9_.-]/g, ''),
          email: newTeamEmail.trim(),
          role: newTeamRole,
          password: newTeamPassword.trim(),
          phone: newTeamPhone.trim(),
          status: 'active',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTeamActionNotice({ type: 'success', message: data.message || 'Staff member added successfully!' });
        await loadTeamMembers();
        setShowAddTeamModal(false);
        setNewTeamName('');
        setNewTeamUsername('');
        setNewTeamEmail('');
        setNewTeamRole('editor');
        setNewTeamPassword('nooreflames');
        setTimeout(() => setTeamActionNotice(null), 4000);
      } else {
        setTeamActionNotice({ type: 'error', message: data.message || 'Failed to save staff member.' });
      }
    } catch (err: any) {
      setTeamActionNotice({ type: 'error', message: err?.message || 'Network error saving staff member.' });
    } finally {
      setIsSubmittingTeam(false);
    }
  };

  const handleQuickRoleChange = async (member: AdminTeamUser, updatedRole: AdminRole) => {
    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          id: member.id,
          email: member.email,
          name: member.name,
          role: updatedRole,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTeamActionNotice({ type: 'success', message: `Updated ${member.name}'s role to ${ROLE_DEFINITIONS[updatedRole].name}!` });
        await loadTeamMembers();
        setTimeout(() => setTeamActionNotice(null), 4000);
      } else {
        setTeamActionNotice({ type: 'error', message: data.message || 'Failed to update role.' });
      }
    } catch (err: any) {
      setTeamActionNotice({ type: 'error', message: err?.message || 'Error updating role.' });
    }
  };

  const handleDeleteTeamMember = async (member: AdminTeamUser) => {
    if (!confirm(`Are you sure you want to remove staff member "${member.name}" (${member.email})?`)) return;
    try {
      const res = await fetch(`/api/admin/team?id=${encodeURIComponent(member.id)}&email=${encodeURIComponent(member.email)}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setTeamActionNotice({ type: 'success', message: 'Staff member removed successfully.' });
        await loadTeamMembers();
        setTimeout(() => setTeamActionNotice(null), 3500);
      } else {
        setTeamActionNotice({ type: 'error', message: data.message || 'Could not remove staff member.' });
      }
    } catch (err: any) {
      setTeamActionNotice({ type: 'error', message: err?.message || 'Error removing staff member.' });
    }
  };

  // Toggle tab access for a specific role in the permissions matrix
  const handleToggleRoleTab = (role: AdminRole, tab: AdminTab) => {
    if (role === 'administrator') {
      // Administrator always retains permanent master access to all tabs
      return;
    }
    setRolePermissions((prev) => {
      const currentTabs = prev[role] || DEFAULT_ROLE_PERMISSIONS[role] || [];
      const exists = currentTabs.includes(tab);
      const updatedTabs = exists
        ? currentTabs.filter((t) => t !== tab)
        : [...currentTabs, tab];
      return {
        ...prev,
        [role]: updatedTabs,
      };
    });
    setHasUnsavedPermissions(true);
  };

  // Persist role permissions changes to backend storage (Neon DB / store.json)
  const handleSaveRolePermissions = async () => {
    setIsSavingPermissions(true);
    setPermissionNotice(null);
    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          action: 'update_role_permissions',
          rolePermissions,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPermissionNotice({
          type: 'success',
          message: 'Role tab access permissions saved and updated across the Commerce Hub!',
        });
        setHasUnsavedPermissions(false);
        if (data.rolePermissions) {
          setRolePermissions(data.rolePermissions);
        }
        setTimeout(() => setPermissionNotice(null), 4500);
      } else {
        setPermissionNotice({
          type: 'error',
          message: data.message || 'Failed to save role permissions.',
        });
      }
    } catch (err: any) {
      setPermissionNotice({
        type: 'error',
        message: err?.message || 'Network error saving role permissions.',
      });
    } finally {
      setIsSavingPermissions(false);
    }
  };

  // Reset role permissions matrix to default factory presets
  const handleResetRolePermissions = async () => {
    if (!confirm('Reset all role tab permissions back to default factory presets?')) return;
    setIsSavingPermissions(true);
    setPermissionNotice(null);
    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          action: 'reset_role_permissions',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRolePermissions(DEFAULT_ROLE_PERMISSIONS);
        setHasUnsavedPermissions(false);
        setPermissionNotice({
          type: 'success',
          message: 'Role tab permissions restored to factory defaults.',
        });
        setTimeout(() => setPermissionNotice(null), 4000);
      } else {
        setPermissionNotice({
          type: 'error',
          message: data.message || 'Failed to reset role permissions.',
        });
      }
    } catch (err: any) {
      setPermissionNotice({
        type: 'error',
        message: err?.message || 'Network error resetting permissions.',
      });
    } finally {
      setIsSavingPermissions(false);
    }
  };

  // Open custom tabs modal for an individual staff member
  const handleOpenMemberTabsModal = (member: AdminTeamUser) => {
    setEditingMemberTabs(member);
    const initialTabs =
      Array.isArray(member.customAllowedTabs) && member.customAllowedTabs.length > 0
        ? member.customAllowedTabs
        : rolePermissions[member.role] || DEFAULT_ROLE_PERMISSIONS[member.role] || [];
    setMemberCustomTabs([...initialTabs]);
  };

  // Save customized tabs for an individual staff member
  const handleSaveMemberCustomTabs = async () => {
    if (!editingMemberTabs) return;
    setIsSavingMemberTabs(true);
    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          id: editingMemberTabs.id,
          email: editingMemberTabs.email,
          name: editingMemberTabs.name,
          role: editingMemberTabs.role,
          customAllowedTabs: memberCustomTabs,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTeamActionNotice({
          type: 'success',
          message: `Custom tab access updated for ${editingMemberTabs.name}!`,
        });
        await loadTeamMembers();
        setEditingMemberTabs(null);
        setTimeout(() => setTeamActionNotice(null), 4000);
      } else {
        alert(data.message || 'Failed to update custom tabs.');
      }
    } catch (err: any) {
      alert(err?.message || 'Network error saving custom tabs.');
    } finally {
      setIsSavingMemberTabs(false);
    }
  };

  // Open modal to edit staff member credentials (username, password, role, tabs)
  const handleOpenEditCredModal = (member: AdminTeamUser) => {
    setEditingCredMember(member);
    setEditCredName(member.name || '');
    setEditCredUsername(member.username || (member.email ? member.email.split('@')[0] : ''));
    setEditCredEmail(member.email || '');
    setEditCredPassword(member.password || 'nooreflames');
    setEditCredRole(member.role || 'editor');
    setEditCredPhone(member.phone || '');
    setEditCredStatus(member.status || 'active');
    const initialTabs =
      Array.isArray(member.customAllowedTabs) && member.customAllowedTabs.length > 0
        ? member.customAllowedTabs
        : rolePermissions[member.role] || DEFAULT_ROLE_PERMISSIONS[member.role] || [];
    setEditCredTabs([...initialTabs]);
  };

  // Save updated staff credentials and role access
  const handleSaveEditCreds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCredMember) return;
    if (!editCredUsername.trim()) {
      alert('Username is required for the staff member.');
      return;
    }
    if (!editCredPassword.trim()) {
      alert('Password is required for the staff member.');
      return;
    }

    setIsSavingCreds(true);
    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          id: editingCredMember.id,
          name: editCredName.trim(),
          username: editCredUsername.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, ''),
          email: editCredEmail.trim(),
          password: editCredPassword.trim(),
          role: editCredRole,
          phone: editCredPhone.trim(),
          status: editCredStatus,
          customAllowedTabs: editCredTabs,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTeamActionNotice({
          type: 'success',
          message: `Credentials & role access updated for ${editCredName || editCredUsername}!`,
        });
        await loadTeamMembers();
        setEditingCredMember(null);
        setTimeout(() => setTeamActionNotice(null), 4000);
      } else {
        alert(data.message || 'Failed to update credentials.');
      }
    } catch (err: any) {
      alert(err?.message || 'Network error updating credentials.');
    } finally {
      setIsSavingCreds(false);
    }
  };

  const togglePasswordReveal = (memberId: string) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }));
  };

  const copyCredText = (text: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedCredId(id);
    setTimeout(() => setCopiedCredId(null), 2500);
  };

  // WhatsApp CRM and Open-WA state
  const [customers, setCustomers] = useState<any[]>([]);

  // Registered Users Directory State
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'with-phone' | 'buyers' | 'welcome-sent' | 'pending-welcome'>('all');
  const [userSort, setUserSort] = useState<'newest' | 'oldest' | 'spend' | 'orders' | 'name'>('newest');
  const [selectedUserDetail, setSelectedUserDetail] = useState<any | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserAddress, setNewUserAddress] = useState('');
  const [newUserPincode, setNewUserPincode] = useState('');
  const [sendWelcomeOnCreate, setSendWelcomeOnCreate] = useState(true);
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);
  const [userActionNotice, setUserActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [resendingWelcomeId, setResendingWelcomeId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [whatsappStatus, setWhatsappStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [whatsappFeedback, setWhatsappFeedback] = useState<string | null>(null);
  const [customWaRecipient, setCustomWaRecipient] = useState('');
  const [customWaName, setCustomWaName] = useState('');
  const [customWaTemplate, setCustomWaTemplate] = useState<'welcome' | 'offer' | 'custom'>('welcome');
  const [customWaMessage, setCustomWaMessage] = useState(
    '✨ *Special Atelier Offer for {name}!* ✨\n\nEnjoy an exclusive 15% VIP discount on all handcrafted flacons and candles today with code *VIP15*.\n\nShop now: https://nooreflames.vercel.app'
  );
  const [whatsappDirectLink, setWhatsappDirectLink] = useState<string | null>(null);

  // Dynamic Dispatch Phone & Gateway sync (prioritized from .env / .env.local)
  const [activeDispatchPhone, setActiveDispatchPhone] = useState<string>(() => {
    return (
      envSenderPhone ||
      process.env.NEXT_PUBLIC_WHATSAPP_SENDER_PHONE ||
      (storeData?.siteSettings as any)?.whatsappPhone ||
      '+918368291472'
    );
  });
  const [isEditingDispatchPhone, setIsEditingDispatchPhone] = useState(false);
  const [dispatchPhoneInput, setDispatchPhoneInput] = useState(activeDispatchPhone);
  const [isSavingDispatchPhone, setIsSavingDispatchPhone] = useState(false);
  const [gatewayStatusInfo, setGatewayStatusInfo] = useState<{ connected: boolean; senderPhone?: string; gatewayUrl?: string } | null>(null);
  const [isRefreshingGateway, setIsRefreshingGateway] = useState(false);

  const fetchLiveGatewayStatus = async () => {
    setIsRefreshingGateway(true);
    try {
      const res = await fetch('/api/whatsapp/status');
      const data = await res.json();
      if (data.success) {
        setGatewayStatusInfo({
          connected: data.connected !== false,
          senderPhone: data.senderPhone,
          gatewayUrl: data.gatewayUrl || 'https://nooreflames.onrender.com',
        });
        if (data.senderPhone) {
          setActiveDispatchPhone(data.senderPhone);
          setDispatchPhoneInput(data.senderPhone);
        }
      }
    } catch (_) {
    } finally {
      setIsRefreshingGateway(false);
    }
  };

  useEffect(() => {
    if (envSenderPhone) {
      setActiveDispatchPhone(envSenderPhone);
      setDispatchPhoneInput(envSenderPhone);
    }
    fetchLiveGatewayStatus();
  }, [envSenderPhone]);

  const handleSaveDispatchPhone = async () => {
    const clean = dispatchPhoneInput.trim();
    if (!clean) return;
    setIsSavingDispatchPhone(true);
    try {
      setActiveDispatchPhone(clean);
      const updatedSiteSettings = {
        ...(storeData?.siteSettings || {}),
        whatsappPhone: clean,
        phone: clean,
      };
      setStoreData((prev) => ({
        ...prev,
        siteSettings: updatedSiteSettings as any,
      }));

      // Persist to store API
      await fetch('/api/store', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...storeData,
          siteSettings: updatedSiteSettings,
        }),
      });

      // Also persist to /api/whatsapp/status
      await fetch('/api/whatsapp/status', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ senderPhone: clean }),
      }).catch(() => {});

      setIsEditingDispatchPhone(false);
    } catch (err: any) {
      alert('Error updating dispatch phone: ' + err?.message);
    } finally {
      setIsSavingDispatchPhone(false);
    }
  };

  // Bulk Broadcast to All Registered Users State
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [bulkBroadcastTemplate, setBulkBroadcastTemplate] = useState<'vip15' | 'welcome' | 'launch' | 'secret' | 'custom'>('vip15');
  const [bulkBroadcastCoupon, setBulkBroadcastCoupon] = useState('VIP15');
  const [bulkBroadcastMessage, setBulkBroadcastMessage] = useState(
    '✨ *Exclusive Atelier Invitation for {name}!* ✨\n\nHello {name},\n\nWe have reserved a limited artisanal batch of our signature extrait flacons and sculptural candles for our registered patrons.\n\n🎁 Enjoy an exclusive *15% OFF* your order today with VIP Code: *{coupon}*\n\n🕯️ *Explore Collections:* {siteUrl}\n\nReply directly to this WhatsApp chat for bespoke fragrance recommendations!\n\nWarm regards,\n*NOOR-E-FLAMES Atelier*\n_Where Fragrance Meets Flames_'
  );
  const [bulkCustomerSearch, setBulkCustomerSearch] = useState('');
  const [broadcastDelayMs, setBroadcastDelayMs] = useState<number>(800);
  const [previewCustomerIndex, setPreviewCustomerIndex] = useState<number>(0);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastProgress, setBroadcastProgress] = useState<{
    current: number;
    total: number;
    currentName: string;
    currentPhone: string;
    status: 'idle' | 'running' | 'completed' | 'cancelled';
    results: any[];
  }>({
    current: 0,
    total: 0,
    currentName: '',
    currentPhone: '',
    status: 'idle',
    results: [],
  });
  const broadcastAbortRef = useRef<boolean>(false);

  const loadCustomers = async () => {
    try {
      const res = await fetch('/api/customers');
      const data = await res.json();
      if (data.success && Array.isArray(data.customers)) {
        setCustomers(data.customers);
        // By default select all registered customers with a phone number
        const validIds = data.customers
          .filter((c: any) => c.phone && String(c.phone).replace(/\D/g, '').slice(-10).length === 10)
          .map((c: any) => c.id || c.phone || c.email);
        setSelectedCustomerIds((prev) => (prev.length === 0 ? validIds : prev));
      }
    } catch (err) {
      console.error('Failed to load customers:', err);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const copyToClipboard = (text: string, fieldId: string) => {
    if (!text) return;
    try {
      navigator.clipboard?.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (_) {}
  };

  const filteredUsers = useMemo(() => {
    return customers
      .filter((u: any) => {
        if (userSearch.trim()) {
          const q = userSearch.toLowerCase().trim();
          const nameMatch = String(u.name || '').toLowerCase().includes(q);
          const emailMatch = String(u.email || '').toLowerCase().includes(q);
          const phoneMatch = String(u.phone || '').includes(q);
          const addressMatch = String(u.address || '').toLowerCase().includes(q);
          const idMatch = String(u.id || '').toLowerCase().includes(q);
          if (!nameMatch && !emailMatch && !phoneMatch && !addressMatch && !idMatch) {
            return false;
          }
        }

        if (userFilter === 'with-phone') return u.hasValidPhone || (u.phone && String(u.phone).replace(/\D/g, '').length >= 10);
        if (userFilter === 'buyers') return (u.ordersCount || 0) > 0;
        if (userFilter === 'welcome-sent') return !!u.welcomeSent;
        if (userFilter === 'pending-welcome') return !u.welcomeSent && (u.hasValidPhone || (u.phone && String(u.phone).replace(/\D/g, '').length >= 10));

        return true;
      })
      .sort((a: any, b: any) => {
        if (userSort === 'newest') {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        if (userSort === 'oldest') {
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        }
        if (userSort === 'spend') {
          return (Number(b.totalSpend) || 0) - (Number(a.totalSpend) || 0);
        }
        if (userSort === 'orders') {
          return (Number(b.ordersCount) || 0) - (Number(a.ordersCount) || 0);
        }
        if (userSort === 'name') {
          return String(a.name || '').localeCompare(String(b.name || ''));
        }
        return 0;
      });
  }, [customers, userSearch, userFilter, userSort]);

  const totalRegisteredUsers = customers.length;
  const usersWithValidPhone = customers.filter((u: any) => u.hasValidPhone || (u.phone && String(u.phone).replace(/\D/g, '').length >= 10)).length;
  const usersWithWelcomeSent = customers.filter((u: any) => u.welcomeSent).length;
  const activeBuyerUsers = customers.filter((u: any) => (u.ordersCount || 0) > 0).length;
  const totalUserSpend = customers.reduce((acc: number, curr: any) => acc + (Number(curr.totalSpend) || 0), 0);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail.trim()) {
      alert('Email address is required');
      return;
    }
    setIsSubmittingUser(true);
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName.trim(),
          email: newUserEmail.trim(),
          phone: newUserPhone.trim(),
          address: newUserAddress.trim(),
          pincode: newUserPincode.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUserActionNotice({ type: 'success', message: `Patron "${newUserName || newUserEmail}" registered successfully!` });
        setShowAddUserModal(false);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPhone('');
        setNewUserAddress('');
        setNewUserPincode('');
        await loadCustomers();
        setTimeout(() => setUserActionNotice(null), 4000);
      } else {
        alert(data.message || 'Failed to create customer');
      }
    } catch (err: any) {
      alert('Error creating customer: ' + err?.message);
    } finally {
      setIsSubmittingUser(false);
    }
  };

  const handleDeleteUser = async (user: any) => {
    if (!confirm(`Are you sure you want to remove patron "${user.name || user.email}"?`)) return;
    setDeletingUserId(user.id);
    try {
      const param = user.id ? `id=${encodeURIComponent(user.id)}` : `email=${encodeURIComponent(user.email)}`;
      const res = await fetch(`/api/customers?${param}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setUserActionNotice({ type: 'success', message: `Patron "${user.name || user.email}" removed from directory.` });
        if (selectedUserDetail?.id === user.id) setSelectedUserDetail(null);
        await loadCustomers();
        setTimeout(() => setUserActionNotice(null), 4000);
      } else {
        alert(data.message || 'Failed to delete customer');
      }
    } catch (err: any) {
      alert('Error deleting patron: ' + err?.message);
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleResendWelcome = async (user: any) => {
    const cleanPhone = String(user.phone || '').replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      alert('This patron does not have a valid 10-digit phone number');
      return;
    }
    setResendingWelcomeId(user.id || user.phone);
    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          template: 'welcome',
          variables: { name: user.name || 'Valued Patron' },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUserActionNotice({ type: 'success', message: `Welcome message delivered to ${user.name || cleanPhone}!` });
        await loadCustomers();
        setTimeout(() => setUserActionNotice(null), 4000);
      } else {
        alert(data.error || 'Failed to send WhatsApp message. Make sure the gateway is running.');
      }
    } catch (err: any) {
      alert('Error dispatching welcome message: ' + err?.message);
    } finally {
      setResendingWelcomeId(null);
    }
  };

  const exportUsersCSV = () => {
    if (customers.length === 0) {
      alert('No patrons to export');
      return;
    }
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Orders Count', 'Total Spent (INR)', 'Address', 'Pincode', 'Welcome Sent', 'Registration Date'];
    const rows = customers.map((c: any) => [
      c.id || '',
      `"${(c.name || '').replace(/"/g, '""')}"`,
      c.email || '',
      c.phone ? `'${c.phone}` : '',
      c.ordersCount || 0,
      c.totalSpend || 0,
      `"${(c.address || '').replace(/"/g, '""')}"`,
      c.pincode || '',
      c.welcomeSent ? 'YES' : 'NO',
      c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : '',
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nooreflames_registered_patrons_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const applyBroadcastPreset = (preset: 'vip15' | 'welcome' | 'launch' | 'secret') => {
    setBulkBroadcastTemplate(preset);
    if (preset === 'vip15') {
      setBulkBroadcastCoupon('VIP15');
      setBulkBroadcastMessage(
        '✨ *Exclusive Atelier Invitation for {name}!* ✨\n\nHello {name},\n\nWe have reserved a limited artisanal batch of our signature extrait flacons and sculptural candles for our registered patrons.\n\n🎁 Enjoy an exclusive *15% OFF* your order today with VIP Code: *{coupon}*\n\n🕯️ *Explore Collections:* {siteUrl}\n\nReply directly to this WhatsApp chat for bespoke fragrance recommendations!\n\nWarm regards,\n*NOOR-E-FLAMES Atelier*\n_Where Fragrance Meets Flames_'
      );
    } else if (preset === 'welcome') {
      setBulkBroadcastCoupon('WELCOME10');
      setBulkBroadcastMessage(
        '✨ *Welcome to Noor-E-Flames Atelier, {name}!* ✨\n\nHello {name}, thank you for registering with us! Explore our signature handcrafted candles and luxury extrait de parfums.\n\n🎁 *VIP Welcome Gift:* Enjoy *10% OFF* your first purchase with Code: *{coupon}*\n\n🕯️ *Explore Our Handcrafted Blends:* {siteUrl}\n\nIf you ever need personalized scent recommendations, simply reply here!\n\nWarm regards,\n*NOOR-E-FLAMES Atelier*'
      );
    } else if (preset === 'launch') {
      setBulkBroadcastCoupon('NOOR20');
      setBulkBroadcastMessage(
        '🕯️ *New Artisanal Drop for {name}!* 🕯️\n\nDear {name},\n\nOur master perfumers have just unveiled our newest botanical collection at Noor-E-Flames Atelier. Hand-poured with pure soy wax and rare botanical extraits.\n\n✨ As a registered patron, enjoy *20% OFF* orders above ₹999 with VIP Code: *{coupon}*\n\n🌟 *Discover The New Creations:* {siteUrl}\n\nBest wishes,\n*NOOR-E-FLAMES Atelier*'
      );
    } else if (preset === 'secret') {
      setBulkBroadcastCoupon('DUO1499');
      setBulkBroadcastMessage(
        '🕯️ *A Fragrant Secret for {name}* 🕯️\n\nHello {name},\n\nExperience our Whispered Surprises Secret Message Candle & pure crystal attars. Looking for a tranquil evening ritual or a heartfelt gift?\n\n🎁 Special Atelier Pairing: Any 2 full-size luxury flacons for ₹1,499 today!\n\n✨ Claim privilege now: {siteUrl}\n\nWarmly,\n*NOOR-E-FLAMES*'
      );
    }
  };

  const insertTokenIntoBroadcast = (token: string) => {
    setBulkBroadcastMessage((prev) => {
      const needsSpace = prev.length > 0 && !prev.endsWith(' ') && !prev.endsWith('\n');
      return prev + (needsSpace ? ' ' : '') + token + ' ';
    });
  };

  const getPersonalizedPreviewText = (text: string, recipient: any) => {
    const rawName = (recipient?.name || '').trim() || 'Valued Patron';
    const firstName = rawName.split(/\s+/)[0] || 'Valued Patron';
    const phone = recipient?.phone ? `+91 ${recipient.phone}` : '+91 92892 89800';
    const email = recipient?.email || 'patron@example.com';
    return text
      .replace(/[\{\[]\s*name\s*[\}\]]/gi, rawName)
      .replace(/[\{\[]\s*customerName\s*[\}\]]/gi, rawName)
      .replace(/[\{\[]\s*firstName\s*[\}\]]/gi, firstName)
      .replace(/[\{\[]\s*first_name\s*[\}\]]/gi, firstName)
      .replace(/[\{\[]\s*phone\s*[\}\]]/gi, phone)
      .replace(/[\{\[]\s*email\s*[\}\]]/gi, email)
      .replace(/[\{\[]\s*coupon\s*[\}\]]/gi, bulkBroadcastCoupon || 'WELCOME10')
      .replace(/[\{\[]\s*brand\s*[\}\]]/gi, 'NOOR-E-FLAMES Atelier')
      .replace(/[\{\[]\s*brandName\s*[\}\]]/gi, 'NOOR-E-FLAMES Atelier')
      .replace(/[\{\[]\s*siteUrl\s*[\}\]]/gi, 'https://nooreflames.vercel.app')
      .replace(/[\{\[]\s*url\s*[\}\]]/gi, 'https://nooreflames.vercel.app');
  };

  const handleBroadcastToAllSelected = async () => {
    const validCustomers = customers.filter(
      (c) =>
        selectedCustomerIds.includes(c.id || c.phone || c.email) &&
        Boolean(c.phone && String(c.phone).replace(/\D/g, '').slice(-10).length === 10)
    );

    if (validCustomers.length === 0) {
      alert('Please select at least one registered user with a valid 10-digit WhatsApp phone number.');
      return;
    }

    if (!bulkBroadcastMessage.trim()) {
      alert('Please enter a message template.');
      return;
    }

    setShowBroadcastModal(true);
    setIsBroadcasting(true);
    broadcastAbortRef.current = false;
    setBroadcastProgress({
      current: 0,
      total: validCustomers.length,
      currentName: validCustomers[0]?.name || '',
      currentPhone: validCustomers[0]?.phone || '',
      status: 'running',
      results: [],
    });

    const accumulatedResults: any[] = [];
    let deliveredCount = 0;

    for (let i = 0; i < validCustomers.length; i++) {
      if (broadcastAbortRef.current) {
        setBroadcastProgress((prev) => ({
          ...prev,
          status: 'cancelled',
        }));
        break;
      }

      const c = validCustomers[i];
      const cleanPhone = String(c.phone).replace(/\D/g, '').slice(-10);
      const recipientName = (c.name || '').trim() || 'Valued Patron';

      setBroadcastProgress((prev) => ({
        ...prev,
        current: i + 1,
        currentName: recipientName,
        currentPhone: cleanPhone,
      }));

      const personalizedText = getPersonalizedPreviewText(bulkBroadcastMessage, c);
      const directWaLink = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(personalizedText)}`;

      try {
        const res = await fetch('/api/whatsapp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: cleanPhone,
            name: recipientName,
            type: 'custom',
            customText: bulkBroadcastMessage,
            templateVars: {
              name: recipientName,
              coupon: bulkBroadcastCoupon,
              brand: 'NOOR-E-FLAMES Atelier',
              siteUrl: 'https://nooreflames.vercel.app',
            },
          }),
        });

        const data = await res.json();
        const isLive = data.success && data.result?.provider !== 'simulated' && data.result?.provider !== 'fallback';
        if (isLive) deliveredCount++;

        accumulatedResults.push({
          id: c.id,
          name: recipientName,
          phone: cleanPhone,
          email: c.email || '',
          personalizedText,
          success: Boolean(data.success),
          isLiveDelivered: isLive,
          provider: data.result?.provider || 'fallback',
          directWaLink: data.result?.directWaLink || directWaLink,
          error: data.message || data.result?.error,
          sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        });
      } catch (sendErr: any) {
        accumulatedResults.push({
          id: c.id,
          name: recipientName,
          phone: cleanPhone,
          email: c.email || '',
          personalizedText,
          success: false,
          isLiveDelivered: false,
          provider: 'error',
          directWaLink,
          error: sendErr?.message || 'Network error',
          sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        });
      }

      setBroadcastProgress((prev) => ({
        ...prev,
        results: [...accumulatedResults],
      }));

      if (i < validCustomers.length - 1 && !broadcastAbortRef.current) {
        await new Promise((resolve) => setTimeout(resolve, Math.max(300, broadcastDelayMs)));
      }
    }

    setIsBroadcasting(false);
    setBroadcastProgress((prev) => ({
      ...prev,
      status: broadcastAbortRef.current ? 'cancelled' : 'completed',
    }));

    loadCustomers();
  };

  const handleSendWhatsApp = async (phone: string, name: string, type: 'welcome' | 'custom', customText?: string) => {
    setWhatsappStatus('sending');
    setWhatsappFeedback(null);
    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          name: (name || '').trim() || 'Valued Patron',
          type,
          customText,
          templateVars: { name: (name || '').trim() || 'Valued Patron' },
        }),
      });
      const data = await res.json();
      if (data.result?.directWaLink) {
        setWhatsappDirectLink(data.result.directWaLink);
      }
      if (data.success && data.result?.provider !== 'simulated' && data.result?.provider !== 'fallback') {
        setWhatsappStatus('sent');
        setWhatsappFeedback(`✓ WhatsApp message dispatched to ${name} (${phone}) via ${data.result?.provider || 'Open-WA'}!`);
        loadCustomers();
        setTimeout(() => {
          setWhatsappStatus('idle');
          setWhatsappFeedback(null);
        }, 6000);
      } else {
        setWhatsappStatus('error');
        setWhatsappFeedback(
          data.message ||
            'WhatsApp gateway is offline or QR code not yet scanned. Click "Send via WhatsApp Web Now" below to send immediately.'
        );
      }
    } catch (err: any) {
      setWhatsappStatus('error');
      setWhatsappFeedback(err?.message || 'Network error dispatching WhatsApp message');
    }
  };

  // Products filtering & modal
  const [productSearch, setProductSearch] = useState('');
  const [productCategory, setProductCategory] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Orders filtering & detail
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Offers modal
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isNewCoupon, setIsNewCoupon] = useState(false);
  const [couponSaveStatus, setCouponSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Product save status for inline modal feedback
  const [productSaveStatus, setProductSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Enhanced Product Edit Modal states
  const [activeModalTab, setActiveModalTab] = useState<
    'basics' | 'variants' | 'media' | 'story' | 'notes' | 'specs' | 'seo'
  >('basics');
  const [rawNotes, setRawNotes] = useState({
    top: '',
    heart: '',
    base: '',
    ingredients: '',
  });
  const [uploadingMainImage, setUploadingMainImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // Upload helper hitting /api/upload
  const handleUploadImage = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        return data.url;
      } else {
        alert(data.error || 'Upload failed');
        return null;
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      alert('Upload failed: ' + (err.message || 'Network error'));
      return null;
    }
  };



  // Reload store data
  const loadData = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('nf_admin_token') : null;
      const res = await fetch('/api/store', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (data && typeof data === 'object') {
        setStoreData({
          ...data,
          orders: Array.isArray(data.orders) ? data.orders : [],
          products: Array.isArray(data.products) ? data.products : [],
          coupons: Array.isArray(data.coupons) ? data.coupons : [],
        });
      }
    } catch (err) {
      console.error('Failed to load store data:', err);
    }
  };

  // Always sync fresh store state from disk on mount
  useEffect(() => {
    loadData();
  }, []);

  // Safe references to guarantee no runtime TypeError
  const orders = Array.isArray(storeData?.orders) ? storeData.orders : [];
  const products = Array.isArray(storeData?.products) ? storeData.products : [];
  const coupons = Array.isArray(storeData?.coupons) ? storeData.coupons : [];

  // Save changes to API
  const handleSaveChanges = async () => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(storeData),
      });
      const result = await res.json();
      if (result.success) {
        setSaveStatus('saved');
        await loadData();
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        console.error('Failed to save store changes:', result);
        alert(result.message || 'Failed to save store changes. Please re-login if session expired.');
        setSaveStatus('error');
      }
    } catch (err: any) {
      console.error('Network error saving changes:', err);
      alert('Network error saving changes: ' + (err?.message || 'Check connection'));
      setSaveStatus('error');
    }
  };

  // Save product changes to state AND immediately persist to server
  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    setProductSaveStatus('saving');

    const sanitizedSlug = (editingProduct.slug || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const parsedPrice = Number(editingProduct.price) || 0;
    const parsedOriginalPrice = editingProduct.originalPrice ? Number(editingProduct.originalPrice) : undefined;

    // Ensure variants are synced with the product's base price and original price
    let finalVariants = editingProduct.variants && editingProduct.variants.length > 0
      ? editingProduct.variants.map((v, i) =>
          i === 0
            ? {
                ...v,
                price: parsedPrice,
                originalPrice: parsedOriginalPrice,
              }
            : {
                ...v,
                price: Number(v.price) || parsedPrice,
                originalPrice: v.originalPrice ? Number(v.originalPrice) : undefined,
              }
        )
      : (editingProduct.category === 'candles'
          ? [
              { name: 'Standard Jar (300g)', price: parsedPrice, originalPrice: parsedOriginalPrice },
              { name: 'Luxe Arch Gift Set', price: parsedPrice + 399, originalPrice: parsedOriginalPrice ? parsedOriginalPrice + 499 : undefined },
            ]
          : [
              { name: '50ml Eau de Parfum Flacon', price: parsedPrice, originalPrice: parsedOriginalPrice },
              { name: '100ml Grand Flacon', price: parsedPrice + 699, originalPrice: parsedOriginalPrice ? parsedOriginalPrice + 899 : undefined },
              { name: '10ml Pocket Flacon', price: 699 },
            ]);

    const finalProduct: Product = {
      ...editingProduct,
      price: parsedPrice,
      originalPrice: parsedOriginalPrice,
      stockCount: editingProduct.stockCount !== undefined ? Number(editingProduct.stockCount) : 50,
      slug: sanitizedSlug || undefined,
      metaTitle: (editingProduct.metaTitle || '').trim() || undefined,
      metaDescription: (editingProduct.metaDescription || '').trim() || undefined,
      imageAlt: (editingProduct.imageAlt || '').trim() || undefined,
      galleryAlt: editingProduct.galleryAlt || [],
      topNotes: rawNotes.top ? rawNotes.top.split(',').map((s) => s.trim()).filter(Boolean) : [],
      heartNotes: rawNotes.heart ? rawNotes.heart.split(',').map((s) => s.trim()).filter(Boolean) : [],
      baseNotes: rawNotes.base ? rawNotes.base.split(',').map((s) => s.trim()).filter(Boolean) : [],
      ingredients: rawNotes.ingredients ? rawNotes.ingredients.split(',').map((s) => s.trim()).filter(Boolean) : [],
      gallery: editingProduct.gallery || [],
      variants: finalVariants,
    };

    const updatedProducts = isNewProduct
      ? [finalProduct, ...products]
      : products.map((p) => (p.id === finalProduct.id ? finalProduct : p));

    const updatedStore: StoreData = { ...storeData, products: updatedProducts };
    setStoreData(updatedStore);

    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(updatedStore),
      });
      const result = await res.json();
      if (result.success) {
        setProductSaveStatus('saved');
        await loadData();
        setTimeout(() => {
          setProductSaveStatus('idle');
          setEditingProduct(null);
        }, 1000);
      } else {
        console.error('Failed to save product:', result);
        alert(result.message || 'Failed to save product. Please re-login if session expired.');
        setProductSaveStatus('error');
      }
    } catch (err: any) {
      console.error('Failed to save product:', err);
      alert('Network error saving product: ' + (err?.message || 'Check connection'));
      setProductSaveStatus('error');
    }
  };

  // Save coupon changes to state AND immediately persist to server
  const handleSaveCoupon = async () => {
    if (!editingCoupon || !editingCoupon.code.trim()) return;
    setCouponSaveStatus('saving');

    const cleanCode = editingCoupon.code.trim().toUpperCase();
    const sanitizedCoupon: Coupon = {
      ...editingCoupon,
      code: cleanCode,
      discountPercent: Number(editingCoupon.discountPercent) || 0,
      discountAmount: editingCoupon.discountAmount ? Number(editingCoupon.discountAmount) : undefined,
      fixedPrice: editingCoupon.fixedPrice ? Number(editingCoupon.fixedPrice) : undefined,
      minOrder: Number(editingCoupon.minOrder) || 0,
      description: editingCoupon.description || `${cleanCode} promotional discount`,
      isActive: Boolean(editingCoupon.isActive),
      freeShipping: Boolean(editingCoupon.freeShipping),
    };

    let updatedCoupons: Coupon[];
    if (isNewCoupon) {
      const exists = coupons.some((c) => c.code.toUpperCase() === cleanCode);
      if (exists) {
        updatedCoupons = coupons.map((c) =>
          c.code.toUpperCase() === cleanCode ? sanitizedCoupon : c
        );
      } else {
        updatedCoupons = [sanitizedCoupon, ...coupons];
      }
    } else {
      updatedCoupons = coupons.map((c) =>
        c.code.toUpperCase() === cleanCode ? sanitizedCoupon : c
      );
    }

    const updatedStore: StoreData = { ...storeData, coupons: updatedCoupons };
    setStoreData(updatedStore);

    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(updatedStore),
      });
      const result = await res.json();
      if (result.success) {
        setCouponSaveStatus('saved');
        await loadData();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('noor_coupons_updated'));
        }
        setTimeout(() => {
          setCouponSaveStatus('idle');
          setEditingCoupon(null);
        }, 800);
      } else {
        console.error('Failed to save coupon:', result);
        alert(result.message || 'Failed to save coupon.');
        setCouponSaveStatus('error');
      }
    } catch (err: any) {
      console.error('Failed to save coupon:', err);
      alert('Network error saving coupon: ' + (err?.message || 'Check connection'));
      setCouponSaveStatus('error');
    }
  };

  const handleDeleteCoupon = async (codeToDelete: string) => {
    if (!confirm(`Are you sure you want to permanently delete coupon "${codeToDelete}"?`)) return;

    const updatedCoupons = coupons.filter((c) => c.code !== codeToDelete);
    const updatedStore: StoreData = { ...storeData, coupons: updatedCoupons };
    setStoreData(updatedStore);

    try {
      await fetch('/api/store', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(updatedStore),
      });
      await loadData();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('noor_coupons_updated'));
      }
    } catch (err) {
      console.error('Failed to delete coupon:', err);
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    // Optimistic UI update
    setStoreData({
      ...storeData,
      orders: orders.map((o) =>
        o.id === orderId ? { ...o, deliveryStatus: newStatus } : o
      ),
    });

    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, deliveryStatus: newStatus }),
      });
    } catch (err) {
      console.error('Error updating order:', err);
      loadData();
    }
  };

  // Dashboard calculations from real live orders (no dummy additions)
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
  const activeOrdersCount = orders.filter(
    (o) => o.deliveryStatus !== 'delivered' && o.deliveryStatus !== 'cancelled'
  ).length;
  const totalSkusCount = products.length;
  const activeOffersCount = coupons.filter((c) => c.isActive).length;
  const activeCouponCodes = coupons.filter((c) => c.isActive).map((c) => c.code);

  const inTransitCount = orders.filter((o) => o.deliveryStatus === 'in-transit').length;
  const dispatchedCount = orders.filter((o) => o.deliveryStatus === 'dispatched').length;

  const handleLogout = async () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('nf_visual_edit_active');
        sessionStorage.removeItem('nf_toolbar_dismissed');
      }
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Cache-Control': 'no-cache, no-store' },
      });
    } finally {
      window.location.href = '/admin/login';
    }
  };

  return (
    <div className="admin-layout">
      {/* 1. Left Navigation Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-brand-main-wrap">
            <div className="admin-brand-logo-wrap">
              <img
                src="/images/logo/logo-dark.png"
                alt="Noor-e-Flames"
                className="admin-brand-logo-img"
              />
            </div>
            <div className="admin-brand-info">
              <div className="admin-brand-title font-serif">COMMERCE HUB</div>
              <div className="admin-brand-sub">Where Fragrance Meets Flames</div>
            </div>
          </div>
          <Link href="/" target="_blank" className="admin-mobile-store-link">
            <Eye size={13} />
            <span>Storefront</span>
          </Link>
        </div>

        <nav className="admin-sidebar-nav" ref={navContainerRef} aria-label="Admin Navigation">
          {canAccessTab('dashboard') && (
            <button
              className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>
          )}

          {canAccessTab('users') && (
            <button
              className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('users');
                loadCustomers();
              }}
            >
              <Users size={18} />
              <span>Registered Users</span>
              <span className="nav-badge-count highlight">{customers.length}</span>
            </button>
          )}

          {canAccessTab('products') && (
            <button
              className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <Package size={18} />
              <span>Products & SKUs</span>
              <span className="nav-badge-count">{totalSkusCount}</span>
            </button>
          )}

          {canAccessTab('orders') && (
            <button
              className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <Truck size={18} />
              <span>Delivery & Orders</span>
              <span className="nav-badge-count highlight">{orders.length}</span>
            </button>
          )}

          {canAccessTab('banners') && (
            <button
              className={`admin-nav-item ${activeTab === 'banners' ? 'active' : ''}`}
              onClick={() => setActiveTab('banners')}
            >
              <ImageIcon size={18} />
              <span>Banners & Media</span>
            </button>
          )}

          {canAccessTab('offers') && (
            <button
              className={`admin-nav-item ${activeTab === 'offers' ? 'active' : ''}`}
              onClick={() => setActiveTab('offers')}
            >
              <Tag size={18} />
              <span>Codes & Offers</span>
            </button>
          )}

          {canAccessTab('sync') && (
            <button
              className={`admin-nav-item ${activeTab === 'sync' ? 'active' : ''}`}
              onClick={() => setActiveTab('sync')}
            >
              <Rocket size={18} />
              <span>Sync & Deploy</span>
            </button>
          )}

          {canAccessTab('whatsapp') && (
            <button
              className={`admin-nav-item ${activeTab === 'whatsapp' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('whatsapp');
                loadCustomers();
              }}
            >
              <MessageSquare size={18} />
              <span>WhatsApp CRM</span>
              {customers.length > 0 && <span className="nav-badge-count">{customers.length}</span>}
            </button>
          )}

          {canAccessTab('roles') && (
            <button
              className={`admin-nav-item ${activeTab === 'roles' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('roles');
                loadTeamMembers();
              }}
            >
              <ShieldCheck size={18} />
              <span>Role Specifier</span>
              <span className="nav-badge-count" style={{ background: '#4F46E5', color: '#fff', fontSize: '9px', fontWeight: 800 }}>CREDS</span>
            </button>
          )}
        </nav>

        <div className="admin-sidebar-footer">
          <div
            style={{
              padding: '10px 12px',
              marginBottom: '10px',
              background: '#F9F7F2',
              border: '1px solid rgba(187, 165, 142, 0.3)',
              borderRadius: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
              <div style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.12em', color: '#8A7258', textTransform: 'uppercase' }}>
                ✦ Staff Account
              </div>
              <span
                style={{
                  fontSize: '9.5px',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '10px',
                  background: ROLE_DEFINITIONS[activeRole]?.bgColor || '#FEF2F2',
                  color: ROLE_DEFINITIONS[activeRole]?.color || '#991B1B',
                  border: `1px solid ${ROLE_DEFINITIONS[activeRole]?.borderColor || '#FECACA'}`,
                }}
              >
                {ROLE_DEFINITIONS[activeRole]?.badge || 'Staff'}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#121212', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentUser?.email || 'nooreflamesadmin@gmail.com'}
            </div>
          </div>

          <Link href="/" target="_blank" className="btn-view-storefront">
            <Eye size={16} />
            <span>View Live Storefront</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              width: '100%',
              marginTop: '8px',
              padding: '10px 14px',
              backgroundColor: 'rgba(220, 38, 38, 0.08)',
              border: '1px solid rgba(220, 38, 38, 0.25)',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.16)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.08)';
            }}
          >
            <LogOut size={14} />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="admin-main">
        {/* Top Header Bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <h1 className="admin-topbar-title font-serif">
              {activeTab === 'dashboard' && '📊 Executive Dashboard'}
              {activeTab === 'users' && '👥 Registered Users & Patrons Directory'}
              {activeTab === 'products' && '📦 Products Catalog & SKUs'}
              {activeTab === 'orders' && '🚚 Live Orders & Deliveries'}
              {activeTab === 'banners' && '🖼️ Hero & Promo Banners Manager'}
              {activeTab === 'offers' && '🏷️ Discount Codes & Offers'}
              {activeTab === 'sync' && '🚀 Storefront Sync & Deploy'}
              {activeTab === 'whatsapp' && '💬 WhatsApp CRM & Open-WA Automation'}
              {activeTab === 'roles' && '🛡️ Role Specifier — Credentials & Tab Permissions'}
            </h1>
          </div>

          <div className="admin-topbar-actions">
            {/* Active Role Badge & Simulator Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FAF8F5', padding: '4px 8px 4px 10px', borderRadius: '10px', border: '1px solid rgba(187, 165, 142, 0.35)' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  background: ROLE_DEFINITIONS[activeRole]?.bgColor || '#FEF2F2',
                  border: `1px solid ${ROLE_DEFINITIONS[activeRole]?.borderColor || '#FECACA'}`,
                  color: ROLE_DEFINITIONS[activeRole]?.color || '#991B1B',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                <span>{ROLE_DEFINITIONS[activeRole]?.emoji}</span>
                <span>{ROLE_DEFINITIONS[activeRole]?.name}</span>
              </div>

              <select
                value={activeRole}
                onChange={(e) => handleRoleSwitch(e.target.value as AdminRole)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(187, 165, 142, 0.4)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: '#121212',
                  cursor: 'pointer',
                  outline: 'none',
                }}
                title="Switch active role to test tab permissions and access control in real time"
              >
                <option value="administrator">👑 Administrator (8 Tabs)</option>
                <option value="editor">✏️ Editor ({getAllowedTabsForRole('editor', undefined, rolePermissions).length} Tabs)</option>
                <option value="content_manager">🎨 Content Manager ({getAllowedTabsForRole('content_manager', undefined, rolePermissions).length} Tabs)</option>
                <option value="operations">📦 Operations & Support ({getAllowedTabsForRole('operations', undefined, rolePermissions).length} Tabs)</option>
                <option value="viewer">👁️ Read-Only Viewer ({getAllowedTabsForRole('viewer', undefined, rolePermissions).length} Tabs)</option>
              </select>
            </div>

            <Link
              href="/?visualEdit=true"
              target="_blank"
              className="btn-admin-visual-edit"
              title="Open live storefront with Visual In-Place Editing active (Admin Only)"
            >
              <Edit3 size={15} />
              <span>Visual Edit Storefront</span>
            </Link>

            <button
              onClick={handleSaveChanges}
              disabled={saveStatus === 'saving'}
              className="btn-admin-save"
            >
              {saveStatus === 'saving' ? (
                <>
                  <RefreshCw size={15} className="spin" />
                  <span>Saving...</span>
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <CheckCircle2 size={15} color="#22c55e" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </header>

        <div className="admin-content-body">
          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {activeTab === 'dashboard' && canAccessTab('dashboard') && (
            <div className="tab-dashboard-view">
              {/* 4 Stat KPI Cards */}
              <div className="admin-kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-label">TOTAL STORE REVENUE</div>
                  <div className="kpi-value font-serif">₹{totalRevenue.toLocaleString('en-IN')}</div>
                  <div className="kpi-sub">
                    {orders.length > 0 ? `${orders.length} orders placed` : 'Live sales total'}
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-label">ACTIVE ORDERS</div>
                  <div className="kpi-value font-serif">{activeOrdersCount}</div>
                  <div className="kpi-sub">
                    {inTransitCount} In Transit · {dispatchedCount} Dispatched
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-label">CATALOG SKUS</div>
                  <div className="kpi-value font-serif">{totalSkusCount}</div>
                  <div className="kpi-sub">Candles, Perfumes & Attars</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-label">ACTIVE OFFERS</div>
                  <div className="kpi-value font-serif">{activeOffersCount}</div>
                  <div className="kpi-sub">
                    {activeCouponCodes.length > 0 ? activeCouponCodes.join(', ') : 'No active codes'}
                  </div>
                </div>
              </div>

              {/* Recent Live Orders Section */}
              <div className="admin-card-section">
                <div className="section-card-header">
                  <div className="section-card-title">
                    <span>📦 Recent Live Orders</span>
                  </div>
                  {orders.length > 0 && (
                    <button
                      className="btn-card-action"
                      onClick={() => setActiveTab('orders')}
                    >
                      View All Orders →
                    </button>
                  )}
                </div>

                {orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '52px 24px', color: '#707070' }}>
                    <Package size={42} color="#8A7258" style={{ margin: '0 auto 14px', opacity: 0.85 }} />
                    <h4 style={{ color: '#121212', margin: '0 0 6px 0', fontSize: '16px', fontWeight: 600 }}>
                      No Customer Orders Yet
                    </h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#707070', maxWidth: '380px', marginInline: 'auto' }}>
                      When customers purchase items from your live storefront, their orders and tracking info will automatically appear here.
                    </p>
                  </div>
                ) : (
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ORDER ID</th>
                          <th>CUSTOMER</th>
                          <th>DESTINATION</th>
                          <th>AMOUNT</th>
                          <th>PAYMENT</th>
                          <th>DELIVERY STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id} onClick={() => setSelectedOrder(order)} className="clickable-row">
                            <td className="font-mono order-id-text">{order.id}</td>
                            <td>{order.customer}</td>
                            <td className="destination-text">{order.destination}</td>
                            <td className="amount-text font-serif">₹{(Number(order.amount) || 0).toLocaleString('en-IN')}</td>
                            <td>{order.payment}</td>
                            <td>
                              <span className={`status-pill ${order.deliveryStatus}`}>
                                {order.deliveryStatus.toUpperCase().replace('-', ' ')}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: REGISTERED USERS DIRECTORY & TEAM ROLES */}
          {activeTab === 'users' && canAccessTab('users') && (
            <div className="tab-users-view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Sub-navigation: Registered Patrons vs Staff Team Roles */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderBottom: '1.5px solid rgba(187, 165, 142, 0.25)', paddingBottom: '14px' }}>
                <div style={{ display: 'inline-flex', background: '#F0ECE1', padding: '4px', borderRadius: '10px', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setUsersSubTab('patrons')}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: usersSubTab === 'patrons' ? 700 : 500,
                      background: usersSubTab === 'patrons' ? '#FFFFFF' : 'transparent',
                      color: usersSubTab === 'patrons' ? '#121212' : '#707070',
                      cursor: 'pointer',
                      boxShadow: usersSubTab === 'patrons' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Users size={15} />
                    <span>Registered Patrons ({customers.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUsersSubTab('team');
                      loadTeamMembers();
                    }}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: usersSubTab === 'team' ? 700 : 500,
                      background: usersSubTab === 'team' ? '#FFFFFF' : 'transparent',
                      color: usersSubTab === 'team' ? '#121212' : '#707070',
                      cursor: 'pointer',
                      boxShadow: usersSubTab === 'team' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Shield size={15} color="#8A7258" />
                    <span>Staff Roles & Permissions ({teamMembers.length})</span>
                  </button>
                </div>

                {usersSubTab === 'patrons' ? (
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(true)}
                    className="btn-admin-save"
                    style={{ fontSize: '12.5px', padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <UserPlus size={15} />
                    <span>Add New Patron</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddTeamModal(true)}
                    className="btn-admin-save"
                    style={{ fontSize: '12.5px', padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <UserPlus size={15} />
                    <span>Add Staff Member</span>
                  </button>
                )}
              </div>

              {/* SUB-TAB 1: REGISTERED PATRONS DIRECTORY */}
              {usersSubTab === 'patrons' && (
                <>
              {/* Toast / Action Notice */}
              {userActionNotice && (
                <div
                  style={{
                    padding: '14px 20px',
                    borderRadius: '12px',
                    background: userActionNotice.type === 'success' ? '#F0FDF4' : '#FEF2F2',
                    border: `1px solid ${userActionNotice.type === 'success' ? '#86EFAC' : '#FECACA'}`,
                    color: userActionNotice.type === 'success' ? '#166534' : '#991B1B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '13.5px',
                    fontWeight: 600,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} />
                    <span>{userActionNotice.message}</span>
                  </div>
                  <button
                    onClick={() => setUserActionNotice(null)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* 4 Stat KPI Cards */}
              <div className="admin-kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-label">TOTAL REGISTERED PATRONS</div>
                  <div className="kpi-value font-serif">{totalRegisteredUsers}</div>
                  <div className="kpi-sub">
                    <Users size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    Active customer accounts & order checkouts
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-label">VERIFIED WHATSAPP CONTACTS</div>
                  <div className="kpi-value font-serif" style={{ color: '#166534' }}>{usersWithValidPhone}</div>
                  <div className="kpi-sub">
                    <Phone size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    Direct CRM & Welcome automation reachable
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-label">ACTIVE BUYERS (PLACED ORDERS)</div>
                  <div className="kpi-value font-serif" style={{ color: '#854D0E' }}>{activeBuyerUsers}</div>
                  <div className="kpi-sub">
                    <ShoppingBag size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {totalRegisteredUsers > 0 ? `${Math.round((activeBuyerUsers / totalRegisteredUsers) * 100)}% conversion rate` : '0%'}
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-label">PATRON LIFETIME VALUE</div>
                  <div className="kpi-value font-serif" style={{ color: '#8A7258' }}>₹{totalUserSpend.toLocaleString('en-IN')}</div>
                  <div className="kpi-sub">
                    <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    Total cumulative revenue from patrons
                  </div>
                </div>
              </div>

              {/* Main Directory Card */}
              <div className="admin-editor-card" style={{ padding: '24px' }}>
                {/* Header & Controls Toolbar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8A7258' }}>
                      <Users size={20} />
                    </div>
                    <div>
                      <h2 className="editor-card-title font-serif" style={{ margin: 0, padding: 0, border: 'none', fontSize: '18px' }}>
                        Patrons & User Profiles
                      </h2>
                      <p style={{ margin: 0, fontSize: '12.5px', color: '#707070' }}>
                        Showing {filteredUsers.length} of {customers.length} registered accounts
                      </p>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      className="btn-admin-secondary"
                      onClick={exportUsersCSV}
                      style={{ padding: '8px 14px', fontSize: '12.5px' }}
                      title="Export all registered users as a CSV file"
                    >
                      <Download size={14} />
                      <span>Export CSV</span>
                    </button>

                    <button
                      className="btn-admin-secondary"
                      onClick={loadCustomers}
                      style={{ padding: '8px 14px', fontSize: '12.5px' }}
                      title="Reload fresh user records from database"
                    >
                      <RefreshCw size={14} />
                      <span>Refresh</span>
                    </button>

                    <button
                      className="btn-admin-save"
                      onClick={() => setShowAddUserModal(true)}
                      style={{ padding: '8px 16px', fontSize: '12.5px' }}
                    >
                      <UserPlus size={14} />
                      <span>Add New Patron</span>
                    </button>
                  </div>
                </div>

                {/* Filters, Search & Sort Bar */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '22px', padding: '14px', background: '#FAF8F5', borderRadius: '12px', border: '1px solid rgba(187, 165, 142, 0.25)' }}>
                  {/* Search Input */}
                  <div style={{ flex: '1 1 260px', position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8A7258', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      placeholder="Search by name, email, 10-digit phone, city, or ID..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px 9px 36px',
                        borderRadius: '8px',
                        border: '1px solid #D5C9BE',
                        background: '#FFFFFF',
                        fontSize: '13px',
                        outline: 'none',
                        color: '#121212',
                      }}
                    />
                    {userSearch && (
                      <button
                        onClick={() => setUserSearch('')}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Filter Dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Filter size={14} style={{ color: '#8A7258' }} />
                    <select
                      value={userFilter}
                      onChange={(e: any) => setUserFilter(e.target.value)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #D5C9BE',
                        background: '#FFFFFF',
                        fontSize: '12.5px',
                        color: '#121212',
                        fontWeight: 600,
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="all">All Patrons ({customers.length})</option>
                      <option value="with-phone">Verified WhatsApp ({usersWithValidPhone})</option>
                      <option value="buyers">Active Buyers ({activeBuyerUsers})</option>
                      <option value="welcome-sent">Welcome Gift Sent ({usersWithWelcomeSent})</option>
                      <option value="pending-welcome">Pending Welcome ({Math.max(0, usersWithValidPhone - usersWithWelcomeSent)})</option>
                    </select>
                  </div>

                  {/* Sort Dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#707070', fontWeight: 600 }}>Sort:</span>
                    <select
                      value={userSort}
                      onChange={(e: any) => setUserSort(e.target.value)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #D5C9BE',
                        background: '#FFFFFF',
                        fontSize: '12.5px',
                        color: '#121212',
                        fontWeight: 600,
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="newest">Newest Registered</option>
                      <option value="oldest">Oldest First</option>
                      <option value="spend">Highest Lifetime Spend</option>
                      <option value="orders">Most Orders Placed</option>
                      <option value="name">Name (A–Z)</option>
                    </select>
                  </div>
                </div>

                {/* Table of Registered Users */}
                {filteredUsers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '56px 20px', color: '#707070' }}>
                    <Users size={40} style={{ margin: '0 auto 14px auto', opacity: 0.35, color: '#8A7258' }} />
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#121212', marginBottom: '6px' }}>
                      {userSearch || userFilter !== 'all' ? 'No patrons match your search or filter' : 'No registered users yet'}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#707070', maxWidth: '440px', margin: '0 auto 18px auto' }}>
                      {userSearch || userFilter !== 'all'
                        ? 'Try clearing the search box or selecting "All Patrons" to see the complete list.'
                        : 'When users sign up on your storefront or checkout an order, their complete details and order history will automatically appear here.'}
                    </p>
                    {(userSearch || userFilter !== 'all') ? (
                      <button
                        className="btn-admin-secondary"
                        onClick={() => { setUserSearch(''); setUserFilter('all'); }}
                        style={{ padding: '8px 16px', fontSize: '12.5px' }}
                      >
                        Reset Filters
                      </button>
                    ) : (
                      <button
                        className="btn-admin-save"
                        onClick={() => setShowAddUserModal(true)}
                        style={{ padding: '8px 16px', fontSize: '12.5px' }}
                      >
                        <UserPlus size={14} />
                        <span>Add First Patron</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1.5px solid rgba(187, 165, 142, 0.35)', background: '#F8F6F1', textAlign: 'left', color: '#707070' }}>
                          <th style={{ padding: '12px 14px' }}>Patron Profile</th>
                          <th style={{ padding: '12px 14px' }}>Contact Information</th>
                          <th style={{ padding: '12px 14px' }}>Orders & Value</th>
                          <th style={{ padding: '12px 14px' }}>Shipping Address</th>
                          <th style={{ padding: '12px 14px' }}>WhatsApp Welcome</th>
                          <th style={{ padding: '12px 14px' }}>Joined Date</th>
                          <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user: any, idx: number) => {
                          const cleanPhone = String(user.phone || '').replace(/\D/g, '').slice(-10);
                          const initials = (user.name || user.email || 'P')
                            .split(' ')
                            .map((w: string) => w[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase();
                          const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
                          const ordersCount = Number(user.ordersCount) || 0;
                          const totalSpend = Number(user.totalSpend) || 0;
                          const waChatLink = cleanPhone.length === 10
                            ? `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`✨ Hello ${user.name || 'Patron'}! Greetings from NOOR-E-FLAMES Atelier.`)}`
                            : null;

                          return (
                            <tr
                              key={user.id || user.email || idx}
                              style={{
                                borderBottom: '1px solid rgba(187, 165, 142, 0.18)',
                                transition: 'background .15s',
                              }}
                              className="admin-user-row"
                            >
                              {/* 1. Patron / Avatar */}
                              <td style={{ padding: '14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div
                                    style={{
                                      width: '38px',
                                      height: '38px',
                                      borderRadius: '50%',
                                      background: 'linear-gradient(135deg, #2D241E 0%, #524237 100%)',
                                      color: '#D4AF37',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontWeight: 700,
                                      fontSize: '13px',
                                      letterSpacing: '0.5px',
                                      flexShrink: 0,
                                      border: '1.5px solid rgba(212, 175, 55, 0.35)',
                                    }}
                                  >
                                    {initials}
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: 700, color: '#121212', fontSize: '13.5px' }}>
                                      {user.name || 'Valued Patron'}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#8A7258', fontFamily: 'monospace' }}>
                                      ID: {user.id || 'cust_' + idx}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* 2. Contact Information */}
                              <td style={{ padding: '14px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  {user.email ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px' }}>
                                      <Mail size={13} style={{ color: '#8A7258', flexShrink: 0 }} />
                                      <a href={`mailto:${user.email}`} style={{ color: '#121212', textDecoration: 'none' }}>
                                        {user.email}
                                      </a>
                                      <button
                                        onClick={() => copyToClipboard(user.email, `email_${user.id || idx}`)}
                                        title="Copy email address"
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#999', display: 'flex' }}
                                      >
                                        <Copy size={11} color={copiedField === `email_${user.id || idx}` ? '#166534' : '#999'} />
                                      </button>
                                    </div>
                                  ) : (
                                    <span style={{ color: '#999', fontSize: '12px' }}>No email</span>
                                  )}

                                  {cleanPhone.length === 10 ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px' }}>
                                      <Phone size={13} style={{ color: '#166534', flexShrink: 0 }} />
                                      <a href={`tel:+91${cleanPhone}`} style={{ color: '#166534', fontWeight: 600, textDecoration: 'none', fontFamily: 'monospace' }}>
                                        +91 {cleanPhone.slice(0, 5)} {cleanPhone.slice(5)}
                                      </a>
                                      <button
                                        onClick={() => copyToClipboard(`+91${cleanPhone}`, `phone_${user.id || idx}`)}
                                        title="Copy phone number"
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#999', display: 'flex' }}
                                      >
                                        <Copy size={11} color={copiedField === `phone_${user.id || idx}` ? '#166534' : '#999'} />
                                      </button>
                                    </div>
                                  ) : (
                                    <span style={{ color: '#999', fontSize: '11.5px', fontStyle: 'italic' }}>
                                      No phone registered
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* 3. Orders & Spend */}
                              <td style={{ padding: '14px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span
                                      style={{
                                        display: 'inline-block',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        background: ordersCount > 0 ? 'rgba(212, 175, 55, 0.15)' : '#F3F4F6',
                                        color: ordersCount > 0 ? '#7B6224' : '#6B7280',
                                        border: ordersCount > 0 ? '1px solid rgba(212, 175, 55, 0.35)' : '1px solid #E5E7EB',
                                      }}
                                    >
                                      {ordersCount} {ordersCount === 1 ? 'Order' : 'Orders'}
                                    </span>
                                    {ordersCount > 0 && (
                                      <span style={{ fontWeight: 700, color: '#121212', fontSize: '13px' }} className="font-serif">
                                        ₹{totalSpend.toLocaleString('en-IN')}
                                      </span>
                                    )}
                                  </div>
                                  {user.lastOrderId && (
                                    <div style={{ fontSize: '11px', color: '#707070' }}>
                                      Latest: <span style={{ fontFamily: 'monospace' }}>{user.lastOrderId}</span>
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* 4. Shipping Address */}
                              <td style={{ padding: '14px', maxWidth: '180px' }}>
                                {user.address ? (
                                  <div style={{ fontSize: '12px', color: '#4B5563', lineHeight: 1.4 }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                                      <MapPin size={12} style={{ color: '#8A7258', flexShrink: 0, marginTop: '2px' }} />
                                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                        {user.address}
                                      </span>
                                    </div>
                                    {user.pincode && (
                                      <span style={{ fontSize: '11px', color: '#707070', marginLeft: '16px' }}>
                                        Pin: {user.pincode}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span style={{ color: '#9CA3AF', fontSize: '12px', fontStyle: 'italic' }}>
                                    Not provided
                                  </span>
                                )}
                              </td>

                              {/* 5. WhatsApp Welcome Status */}
                              <td style={{ padding: '14px' }}>
                                {cleanPhone.length === 10 ? (
                                  user.welcomeSent ? (
                                    <span
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '11.5px',
                                        fontWeight: 700,
                                        background: '#DCFCE7',
                                        color: '#15803D',
                                        border: '1px solid #BBF7D0',
                                      }}
                                    >
                                      <CheckCircle2 size={12} />
                                      <span>Welcome Sent (10% OFF)</span>
                                    </span>
                                  ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <span
                                        style={{
                                          display: 'inline-block',
                                          padding: '3px 8px',
                                          borderRadius: '20px',
                                          fontSize: '11px',
                                          fontWeight: 700,
                                          background: '#FEF3C7',
                                          color: '#92400E',
                                          border: '1px solid #FDE68A',
                                        }}
                                      >
                                        Pending
                                      </span>
                                      <button
                                        onClick={() => handleResendWelcome(user)}
                                        disabled={resendingWelcomeId === (user.id || user.phone)}
                                        style={{
                                          padding: '3px 8px',
                                          borderRadius: '6px',
                                          border: '1px solid #166534',
                                          background: '#166534',
                                          color: '#FFFFFF',
                                          fontSize: '11px',
                                          fontWeight: 700,
                                          cursor: 'pointer',
                                          whiteSpace: 'nowrap',
                                        }}
                                        title="Dispatch automated WhatsApp welcome message"
                                      >
                                        {resendingWelcomeId === (user.id || user.phone) ? 'Sending...' : 'Send Now'}
                                      </button>
                                    </div>
                                  )
                                ) : (
                                  <span style={{ color: '#9CA3AF', fontSize: '11.5px' }}>
                                    No phone
                                  </span>
                                )}
                              </td>

                              {/* 6. Joined Date */}
                              <td style={{ padding: '14px', fontSize: '12px', color: '#707070', whiteSpace: 'nowrap' }}>
                                {joinDate}
                              </td>

                              {/* 7. Quick Actions */}
                              <td style={{ padding: '14px', textAlign: 'right' }}>
                                <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                                  {waChatLink && (
                                    <a
                                      href={waChatLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        background: '#25D366',
                                        color: '#FFFFFF',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textDecoration: 'none',
                                      }}
                                      title="Open direct WhatsApp conversation"
                                    >
                                      <MessageCircle size={15} />
                                    </a>
                                  )}

                                  <button
                                    onClick={() => setSelectedUserDetail(user)}
                                    style={{
                                      width: '32px',
                                      height: '32px',
                                      borderRadius: '8px',
                                      background: '#FAF8F5',
                                      border: '1px solid #D5C9BE',
                                      color: '#707070',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                    title="View full profile & order history"
                                  >
                                    <Eye size={15} />
                                  </button>

                                  <button
                                    onClick={() => handleDeleteUser(user)}
                                    disabled={deletingUserId === user.id}
                                    style={{
                                      width: '32px',
                                      height: '32px',
                                      borderRadius: '8px',
                                      background: '#FEF2F2',
                                      border: '1px solid #FECACA',
                                      color: '#EF4444',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      opacity: deletingUserId === user.id ? 0.5 : 1,
                                    }}
                                    title="Delete patron from directory"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* MODAL 1: ADD NEW PATRON MODAL */}
              {showAddUserModal && (
                <div
                  style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(18, 18, 18, 0.75)',
                    backdropFilter: 'blur(5px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                  }}
                >
                  <div
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      maxWidth: '520px',
                      width: '100%',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                      border: '1.5px solid rgba(187, 165, 142, 0.5)',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ padding: '20px 24px', background: '#FAF8F5', borderBottom: '1px solid rgba(187, 165, 142, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <UserPlus size={18} style={{ color: '#8A7258' }} />
                        <h3 className="font-serif" style={{ margin: 0, fontSize: '17px', color: '#121212' }}>
                          Register New Patron
                        </h3>
                      </div>
                      <button
                        onClick={() => setShowAddUserModal(false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#707070' }}
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <form onSubmit={handleCreateUser} style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                            Full Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Aria Montgomery"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #D5C9BE', fontSize: '13.5px', outline: 'none' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                            Email Address <span style={{ color: '#EF4444' }}>*</span>
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. patron@example.com"
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #D5C9BE', fontSize: '13.5px', outline: 'none' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                            WhatsApp Phone Number (10 digits)
                          </label>
                          <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8A7258', fontSize: '13px', fontWeight: 600 }}>
                              +91
                            </span>
                            <input
                              type="tel"
                              placeholder="9289289800"
                              value={newUserPhone}
                              onChange={(e) => setNewUserPhone(e.target.value)}
                              style={{ width: '100%', padding: '10px 12px 10px 48px', borderRadius: '8px', border: '1px solid #D5C9BE', fontSize: '13.5px', outline: 'none' }}
                            />
                          </div>
                          <span style={{ fontSize: '11px', color: '#707070', marginTop: '4px', display: 'block' }}>
                            Used for automated welcome coupon & order dispatch notifications.
                          </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                              Street Address
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Suite 4B, Atelier Towers"
                              value={newUserAddress}
                              onChange={(e) => setNewUserAddress(e.target.value)}
                              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #D5C9BE', fontSize: '13.5px', outline: 'none' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                              Pincode
                            </label>
                            <input
                              type="text"
                              placeholder="110043"
                              value={newUserPincode}
                              onChange={(e) => setNewUserPincode(e.target.value)}
                              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #D5C9BE', fontSize: '13.5px', outline: 'none' }}
                            />
                          </div>
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', cursor: 'pointer', fontSize: '12.5px', color: '#374151' }}>
                          <input
                            type="checkbox"
                            checked={sendWelcomeOnCreate}
                            onChange={(e) => setSendWelcomeOnCreate(e.target.checked)}
                          />
                          <span>Send automated WhatsApp welcome message with 10% coupon immediately</span>
                        </label>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
                        <button
                          type="button"
                          className="btn-admin-secondary"
                          onClick={() => setShowAddUserModal(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmittingUser}
                          className="btn-admin-save"
                        >
                          {isSubmittingUser ? 'Registering...' : 'Save & Register Patron'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* MODAL 2: DETAILED PATRON PROFILE & ORDER HISTORY MODAL */}
              {selectedUserDetail && (
                <div
                  style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(18, 18, 18, 0.75)',
                    backdropFilter: 'blur(5px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                  }}
                >
                  <div
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      maxWidth: '720px',
                      width: '100%',
                      maxHeight: '90vh',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                      border: '1.5px solid rgba(187, 165, 142, 0.5)',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Modal Header */}
                    <div style={{ padding: '20px 24px', background: '#FAF8F5', borderBottom: '1px solid rgba(187, 165, 142, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #2D241E 0%, #524237 100%)',
                            color: '#D4AF37',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '15px',
                            border: '1.5px solid rgba(212, 175, 55, 0.35)',
                          }}
                        >
                          {(selectedUserDetail.name || selectedUserDetail.email || 'P')
                            .split(' ')
                            .map((w: string) => w[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-serif" style={{ margin: 0, fontSize: '18px', color: '#121212' }}>
                            {selectedUserDetail.name || 'Valued Patron'}
                          </h3>
                          <div style={{ fontSize: '12px', color: '#707070' }}>
                            Patron Account ID: <span style={{ fontFamily: 'monospace' }}>{selectedUserDetail.id}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedUserDetail(null)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#707070' }}
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Modal Body */}
                    <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
                      {/* Contact Info Cards */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                        <div style={{ padding: '14px', borderRadius: '10px', background: '#FAF8F5', border: '1px solid #E5E7EB' }}>
                          <div style={{ fontSize: '11px', color: '#8A7258', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Email Address</div>
                          <div style={{ fontSize: '13px', color: '#121212', wordBreak: 'break-all' }}>{selectedUserDetail.email || 'None'}</div>
                        </div>

                        <div style={{ padding: '14px', borderRadius: '10px', background: '#FAF8F5', border: '1px solid #E5E7EB' }}>
                          <div style={{ fontSize: '11px', color: '#8A7258', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>WhatsApp Phone</div>
                          <div style={{ fontSize: '13px', color: '#166534', fontWeight: 600, fontFamily: 'monospace' }}>
                            {selectedUserDetail.phone ? `+91 ${String(selectedUserDetail.phone).replace(/\D/g, '').slice(-10)}` : 'None'}
                          </div>
                        </div>

                        <div style={{ padding: '14px', borderRadius: '10px', background: '#FAF8F5', border: '1px solid #E5E7EB' }}>
                          <div style={{ fontSize: '11px', color: '#8A7258', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Member Since</div>
                          <div style={{ fontSize: '13px', color: '#121212' }}>
                            {selectedUserDetail.createdAt ? new Date(selectedUserDetail.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                          </div>
                        </div>
                      </div>

                      {/* Orders Summary KPI Row */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(212, 175, 55, 0.08)', border: '1px solid rgba(212, 175, 55, 0.25)', textAlign: 'center' }}>
                          <div style={{ fontSize: '11px', color: '#8A7258', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Total Orders Placed</div>
                          <div className="font-serif" style={{ fontSize: '24px', fontWeight: 700, color: '#121212' }}>
                            {selectedUserDetail.ordersCount || (selectedUserDetail.orders?.length || 0)}
                          </div>
                        </div>

                        <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(37, 211, 102, 0.08)', border: '1px solid rgba(37, 211, 102, 0.25)', textAlign: 'center' }}>
                          <div style={{ fontSize: '11px', color: '#166534', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Lifetime Spend Value</div>
                          <div className="font-serif" style={{ fontSize: '24px', fontWeight: 700, color: '#166534' }}>
                            ₹{(Number(selectedUserDetail.totalSpend) || 0).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>

                      {/* Shipping Address Details */}
                      {selectedUserDetail.address && (
                        <div style={{ padding: '14px 18px', borderRadius: '10px', background: '#FAF8F5', border: '1px solid #E5E7EB' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#8A7258', marginBottom: '4px' }}>
                            <MapPin size={13} />
                            <span>Saved Delivery Address</span>
                          </div>
                          <p style={{ margin: 0, fontSize: '13px', color: '#374151', lineHeight: 1.5 }}>
                            {selectedUserDetail.address}
                            {selectedUserDetail.pincode && ` — PIN: ${selectedUserDetail.pincode}`}
                          </p>
                        </div>
                      )}

                      {/* Order History Table */}
                      <div>
                        <h4 className="font-serif" style={{ fontSize: '14px', marginBottom: '10px', color: '#121212' }}>
                          📦 Order History ({selectedUserDetail.orders?.length || 0})
                        </h4>
                        {selectedUserDetail.orders && selectedUserDetail.orders.length > 0 ? (
                          <div style={{ borderRadius: '10px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                              <thead>
                                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', textAlign: 'left', color: '#6B7280' }}>
                                  <th style={{ padding: '10px 12px' }}>Order ID</th>
                                  <th style={{ padding: '10px 12px' }}>Items</th>
                                  <th style={{ padding: '10px 12px' }}>Amount</th>
                                  <th style={{ padding: '10px 12px' }}>Status</th>
                                  <th style={{ padding: '10px 12px' }}>Payment</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedUserDetail.orders.map((ord: any) => (
                                  <tr key={ord.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 600 }}>{ord.id}</td>
                                    <td style={{ padding: '10px 12px' }}>
                                      {Array.isArray(ord.items)
                                        ? ord.items.map((i: any) => `${i.title || i.name} (x${i.quantity || 1})`).join(', ')
                                        : '—'}
                                    </td>
                                    <td style={{ padding: '10px 12px', fontWeight: 700 }} className="font-serif">₹{ord.amount || ord.total || 0}</td>
                                    <td style={{ padding: '10px 12px' }}>
                                      <span className={`status-pill ${ord.deliveryStatus || 'processing'}`}>
                                        {String(ord.deliveryStatus || 'processing').toUpperCase()}
                                      </span>
                                    </td>
                                    <td style={{ padding: '10px 12px', color: '#6B7280' }}>{ord.payment || 'Prepaid'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p style={{ margin: 0, fontSize: '12.5px', color: '#9CA3AF', fontStyle: 'italic' }}>
                            No orders placed by this patron yet.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div style={{ padding: '16px 24px', background: '#FAF8F5', borderTop: '1px solid rgba(187, 165, 142, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        onClick={() => handleDeleteUser(selectedUserDetail)}
                        style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Trash2 size={14} />
                        <span>Remove Patron</span>
                      </button>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        {selectedUserDetail.phone && String(selectedUserDetail.phone).replace(/\D/g, '').slice(-10).length === 10 && (
                          <a
                            href={`https://wa.me/91${String(selectedUserDetail.phone).replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(`Hello ${selectedUserDetail.name || 'Patron'}, from NOOR-E-FLAMES Atelier!`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-admin-save"
                            style={{ padding: '8px 16px', fontSize: '12.5px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          >
                            <MessageCircle size={15} />
                            <span>WhatsApp Patron</span>
                          </a>
                        )}
                        <button
                          className="btn-admin-secondary"
                          onClick={() => setSelectedUserDetail(null)}
                          style={{ padding: '8px 16px', fontSize: '12.5px' }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
                </>
              )}

              {/* SUB-TAB 2: STAFF ROLES & ACCESS PERMISSIONS */}
              {usersSubTab === 'team' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  {/* Team Notice Banner */}
                  {teamActionNotice && (
                    <div
                      style={{
                        padding: '14px 20px',
                        borderRadius: '12px',
                        background: teamActionNotice.type === 'success' ? '#F0FDF4' : '#FEF2F2',
                        border: `1px solid ${teamActionNotice.type === 'success' ? '#86EFAC' : '#FECACA'}`,
                        color: teamActionNotice.type === 'success' ? '#166534' : '#991B1B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '13.5px',
                        fontWeight: 600,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle2 size={16} />
                        <span>{teamActionNotice.message}</span>
                      </div>
                      <button
                        onClick={() => setTeamActionNotice(null)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  {/* Staff Role KPI Stats */}
                  <div className="admin-kpi-grid">
                    <div className="kpi-card">
                      <div className="kpi-label">TOTAL STAFF MEMBERS</div>
                      <div className="kpi-value font-serif">{teamMembers.length}</div>
                      <div className="kpi-sub">
                        <Users size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        Active backoffice team users
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-label">MASTER ADMINISTRATORS</div>
                      <div className="kpi-value font-serif" style={{ color: '#991B1B' }}>
                        {teamMembers.filter((m) => m.role === 'administrator').length}
                      </div>
                      <div className="kpi-sub">
                        <Shield size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        Full unrestricted master access (8/8 Tabs)
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-label">CATALOG & CONTENT LEADS</div>
                      <div className="kpi-value font-serif" style={{ color: '#1D4ED8' }}>
                        {teamMembers.filter((m) => m.role === 'editor' || m.role === 'content_manager').length}
                      </div>
                      <div className="kpi-sub">
                        <Edit2 size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        Products, Banners, Offers & Media
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-label">OPERATIONS & SUPPORT</div>
                      <div className="kpi-value font-serif" style={{ color: '#047857' }}>
                        {teamMembers.filter((m) => m.role === 'operations' || m.role === 'viewer').length}
                      </div>
                      <div className="kpi-sub">
                        <Truck size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        Orders, WhatsApp Concierge & Logistics
                      </div>
                    </div>
                  </div>

                  {/* Role Permissions Reference Matrix Card */}
                  <div className="admin-editor-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <h3 className="editor-card-title font-serif" style={{ margin: 0 }}>
                            🛡️ Role Access & Tab Permissions Matrix
                          </h3>
                          {hasUnsavedPermissions && (
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                padding: '3px 9px',
                                borderRadius: '12px',
                                background: '#FEF3C7',
                                color: '#92400E',
                                border: '1px solid #FDE68A',
                                letterSpacing: '0.02em',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D97706', display: 'inline-block' }} />
                              Unsaved Role Changes
                            </span>
                          )}
                        </div>
                        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6B7280' }}>
                          Directly control which tabs and capabilities each staff role can access in the Commerce Hub. Click any toggle to grant or revoke tab visibility, then click <strong>Save Role Permissions</strong> to persist.
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          disabled={isSavingPermissions}
                          onClick={handleSaveRolePermissions}
                          className="btn-admin-save"
                          style={{
                            fontSize: '12.5px',
                            padding: '9px 18px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: hasUnsavedPermissions ? '#991B1B' : '#121212',
                            borderColor: hasUnsavedPermissions ? '#7F1D1D' : '#121212',
                            color: '#FFFFFF',
                            cursor: isSavingPermissions ? 'not-allowed' : 'pointer',
                            boxShadow: hasUnsavedPermissions ? '0 4px 14px rgba(153, 27, 27, 0.3)' : 'none',
                            transition: 'all 0.2s',
                          }}
                          title="Save customized tab permissions for all staff roles"
                        >
                          <Save size={15} />
                          <span>{isSavingPermissions ? 'Saving...' : hasUnsavedPermissions ? 'Save Role Changes *' : 'Save Role Permissions'}</span>
                        </button>

                        <button
                          type="button"
                          disabled={isSavingPermissions}
                          onClick={handleResetRolePermissions}
                          style={{
                            fontSize: '12.5px',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            background: '#FAF8F5',
                            border: '1.5px solid rgba(187, 165, 142, 0.4)',
                            color: '#707070',
                            cursor: isSavingPermissions ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontWeight: 600,
                          }}
                          title="Restore factory preset permissions"
                        >
                          <RefreshCw size={14} className={isSavingPermissions ? 'animate-spin' : ''} />
                          <span>Reset Defaults</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowAddTeamModal(true)}
                          style={{
                            fontSize: '12.5px',
                            padding: '8px 15px',
                            borderRadius: '8px',
                            background: '#8A7258',
                            border: 'none',
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontWeight: 600,
                          }}
                        >
                          <UserPlus size={15} />
                          <span>Add Staff Member</span>
                        </button>
                      </div>
                    </div>

                    {/* Permissions Notice Banner */}
                    {permissionNotice && (
                      <div
                        style={{
                          marginBottom: '16px',
                          padding: '12px 18px',
                          borderRadius: '10px',
                          background: permissionNotice.type === 'success' ? '#F0FDF4' : '#FEF2F2',
                          border: `1px solid ${permissionNotice.type === 'success' ? '#86EFAC' : '#FECACA'}`,
                          color: permissionNotice.type === 'success' ? '#166534' : '#991B1B',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '13px',
                          fontWeight: 600,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CheckCircle2 size={16} />
                          <span>{permissionNotice.message}</span>
                        </div>
                        <button
                          onClick={() => setPermissionNotice(null)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
                        >
                          <X size={15} />
                        </button>
                      </div>
                    )}

                    <div className="admin-table-wrapper" style={{ overflowX: 'auto' }}>
                      <table className="admin-table" style={{ fontSize: '12px' }}>
                        <thead>
                          <tr style={{ background: '#FAF8F5' }}>
                            <th style={{ minWidth: '190px' }}>STAFF ROLE</th>
                            <th style={{ textAlign: 'center' }}>📊 DASHBOARD</th>
                            <th style={{ textAlign: 'center' }}>👥 USERS</th>
                            <th style={{ textAlign: 'center' }}>📦 PRODUCTS</th>
                            <th style={{ textAlign: 'center' }}>🚚 ORDERS</th>
                            <th style={{ textAlign: 'center' }}>🖼️ BANNERS</th>
                            <th style={{ textAlign: 'center' }}>🏷️ OFFERS</th>
                            <th style={{ textAlign: 'center' }}>🚀 SYNC</th>
                            <th style={{ textAlign: 'center' }}>💬 WHATSAPP</th>
                            <th style={{ textAlign: 'center' }}>ACTIVE ACCESS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(['administrator', 'editor', 'content_manager', 'operations', 'viewer'] as AdminRole[]).map((rKey) => {
                            const rDef = ROLE_DEFINITIONS[rKey];
                            const isMasterAdmin = rKey === 'administrator';
                            const rTabs = isMasterAdmin
                              ? ['dashboard', 'users', 'products', 'orders', 'banners', 'offers', 'sync', 'whatsapp']
                              : rolePermissions[rKey] || DEFAULT_ROLE_PERMISSIONS[rKey] || [];

                            return (
                              <tr key={rKey} style={{ background: isMasterAdmin ? '#FFFDF8' : undefined }}>
                                <td style={{ padding: '12px 14px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '18px' }}>{rDef.emoji}</span>
                                    <div>
                                      <div style={{ fontWeight: 700, color: rDef.color }}>{rDef.name}</div>
                                      <div style={{ fontSize: '11px', color: '#6B7280' }}>
                                        {isMasterAdmin ? 'Permanent master access (system protected)' : rDef.description}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {ALL_ADMIN_TABS.map((tab) => {
                                  if (isMasterAdmin) {
                                    return (
                                      <td key={tab.id} style={{ textAlign: 'center', padding: '10px 6px' }}>
                                        <div
                                          style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '4px',
                                            padding: '5px 9px',
                                            borderRadius: '6px',
                                            background: '#FEF2F2',
                                            border: '1px solid #FECACA',
                                            color: '#991B1B',
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            cursor: 'not-allowed',
                                            userSelect: 'none',
                                          }}
                                          title="Administrator always has permanent access to all tabs"
                                        >
                                          <Lock size={11} />
                                          <span>Always</span>
                                        </div>
                                      </td>
                                    );
                                  }

                                  const isAllowed = rTabs.includes(tab.id);

                                  return (
                                    <td key={tab.id} style={{ textAlign: 'center', padding: '10px 6px' }}>
                                      <button
                                        type="button"
                                        onClick={() => handleToggleRoleTab(rKey, tab.id)}
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          gap: '5px',
                                          padding: '5px 10px',
                                          borderRadius: '6px',
                                          border: isAllowed ? '1.5px solid #86EFAC' : '1.5px solid #E5E7EB',
                                          background: isAllowed ? '#F0FDF4' : '#FFFFFF',
                                          color: isAllowed ? '#166534' : '#9CA3AF',
                                          fontWeight: 700,
                                          fontSize: '11.5px',
                                          cursor: 'pointer',
                                          transition: 'all 0.15s ease',
                                          boxShadow: isAllowed ? '0 1px 3px rgba(22, 101, 52, 0.08)' : 'none',
                                        }}
                                        title={`Click to ${isAllowed ? 'revoke' : 'grant'} ${tab.label} access for ${rDef.name}`}
                                      >
                                        {isAllowed ? (
                                          <>
                                            <CheckCircle2 size={12} color="#166534" />
                                            <span>Active</span>
                                          </>
                                        ) : (
                                          <>
                                            <span style={{ fontSize: '11px', fontWeight: 800 }}>✕</span>
                                            <span>Off</span>
                                          </>
                                        )}
                                      </button>
                                    </td>
                                  );
                                })}

                                <td style={{ textAlign: 'center', padding: '12px 14px' }}>
                                  <span
                                    style={{
                                      fontSize: '11.5px',
                                      fontWeight: 700,
                                      padding: '3px 10px',
                                      borderRadius: '12px',
                                      background: rDef.bgColor,
                                      color: rDef.color,
                                      border: `1px solid ${rDef.borderColor}`,
                                      display: 'inline-block',
                                    }}
                                  >
                                    {rTabs.length} / 8 Tabs
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Staff Directory Table */}
                  <div className="admin-editor-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <h3 className="editor-card-title font-serif" style={{ margin: 0 }}>
                          👥 Backoffice Staff Directory ({teamMembers.length})
                        </h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6B7280' }}>
                          Assign roles or customize tab access overrides for individual team members.
                        </p>
                      </div>
                      <span style={{ fontSize: '12px', color: '#8A7258', background: '#FAF8F5', padding: '5px 12px', borderRadius: '8px', border: '1px solid rgba(187, 165, 142, 0.3)' }}>
                        🔒 Role access applies instantly upon staff login
                      </span>
                    </div>

                    <div className="admin-table-wrapper">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>STAFF MEMBER</th>
                            <th>CONTACT EMAIL & PHONE</th>
                            <th>ASSIGNED ROLE</th>
                            <th>ACCESSIBLE TABS</th>
                            <th>STATUS</th>
                            <th style={{ textAlign: 'right' }}>ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teamMembers.map((member) => {
                            const rDef = ROLE_DEFINITIONS[member.role] || ROLE_DEFINITIONS.administrator;
                            const isMasterAdmin = member.email === 'nooreflamesadmin@gmail.com' || member.id === 'team_super_admin';
                            const memberTabs = getAllowedTabsForRole(member.role, member.customAllowedTabs, rolePermissions);
                            const hasCustomTabs = Array.isArray(member.customAllowedTabs) && member.customAllowedTabs.length > 0;

                            return (
                              <tr key={member.id}>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div
                                      style={{
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: '50%',
                                        background: rDef.bgColor,
                                        border: `1.5px solid ${rDef.borderColor}`,
                                        color: rDef.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        fontSize: '14px',
                                      }}
                                    >
                                      {rDef.emoji}
                                    </div>
                                    <div>
                                      <div style={{ fontWeight: 700, color: '#121212' }}>{member.name}</div>
                                      <div style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'monospace' }}>ID: {member.id}</div>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#121212' }}>{member.email}</div>
                                  <div style={{ fontSize: '11.5px', color: '#6B7280' }}>{member.phone || '—'}</div>
                                </td>
                                <td>
                                  {isMasterAdmin ? (
                                    <span
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        padding: '4px 10px',
                                        borderRadius: '12px',
                                        background: rDef.bgColor,
                                        color: rDef.color,
                                        border: `1px solid ${rDef.borderColor}`,
                                        fontSize: '11.5px',
                                        fontWeight: 700,
                                      }}
                                    >
                                      👑 Master Administrator (Permanent)
                                    </span>
                                  ) : (
                                    <select
                                      value={member.role}
                                      onChange={(e) => handleQuickRoleChange(member, e.target.value as AdminRole)}
                                      style={{
                                        padding: '5px 8px',
                                        borderRadius: '8px',
                                        border: `1.5px solid ${rDef.borderColor}`,
                                        background: rDef.bgColor,
                                        color: rDef.color,
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        outline: 'none',
                                      }}
                                    >
                                      <option value="administrator">👑 Administrator (8 Tabs)</option>
                                      <option value="editor">✏️ Editor ({getAllowedTabsForRole('editor', undefined, rolePermissions).length} Tabs)</option>
                                      <option value="content_manager">🎨 Content Manager ({getAllowedTabsForRole('content_manager', undefined, rolePermissions).length} Tabs)</option>
                                      <option value="operations">📦 Operations & Support ({getAllowedTabsForRole('operations', undefined, rolePermissions).length} Tabs)</option>
                                      <option value="viewer">👁️ Read-Only Viewer ({getAllowedTabsForRole('viewer', undefined, rolePermissions).length} Tabs)</option>
                                    </select>
                                  )}
                                </td>
                                <td>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {hasCustomTabs && (
                                      <span
                                        style={{
                                          fontSize: '10px',
                                          fontWeight: 700,
                                          padding: '2px 6px',
                                          borderRadius: '4px',
                                          background: '#FEF3C7',
                                          color: '#B45309',
                                          border: '1px solid #FDE68A',
                                          width: 'fit-content',
                                        }}
                                      >
                                        ⭐ Custom Override ({memberTabs.length} Tabs)
                                      </span>
                                    )}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '300px' }}>
                                      {memberTabs.map((t) => (
                                        <span
                                          key={t}
                                          style={{
                                            fontSize: '10px',
                                            fontWeight: 600,
                                            padding: '2px 6px',
                                            borderRadius: '6px',
                                            background: '#FAF8F5',
                                            border: '1px solid #E5E7EB',
                                            color: '#374151',
                                            textTransform: 'capitalize',
                                          }}
                                        >
                                          {t}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <span
                                    style={{
                                      fontSize: '11px',
                                      fontWeight: 700,
                                      padding: '3px 8px',
                                      borderRadius: '12px',
                                      background: member.status === 'suspended' ? '#FEF2F2' : '#DCFCE7',
                                      color: member.status === 'suspended' ? '#991B1B' : '#166534',
                                      border: `1px solid ${member.status === 'suspended' ? '#FECACA' : '#86EFAC'}`,
                                    }}
                                  >
                                    {(member.status || 'ACTIVE').toUpperCase()}
                                  </span>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                  {!isMasterAdmin && (
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                      <button
                                        type="button"
                                        onClick={() => handleOpenMemberTabsModal(member)}
                                        style={{
                                          background: '#FAF8F5',
                                          border: '1px solid rgba(187, 165, 142, 0.4)',
                                          color: '#8A7258',
                                          cursor: 'pointer',
                                          padding: '5px 9px',
                                          borderRadius: '6px',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          fontSize: '11.5px',
                                          fontWeight: 600,
                                        }}
                                        title="Configure custom tab overrides for this member"
                                      >
                                        <Sliders size={13} />
                                        <span>Custom Tabs</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteTeamMember(member)}
                                        style={{
                                          background: 'none',
                                          border: 'none',
                                          color: '#EF4444',
                                          cursor: 'pointer',
                                          padding: '5px 8px',
                                          borderRadius: '6px',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          fontSize: '11.5px',
                                          fontWeight: 600,
                                        }}
                                        title="Remove staff member"
                                      >
                                        <Trash2 size={13} />
                                        <span>Remove</span>
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Link to Role Specifier Tab */}
                  <div
                    style={{
                      marginTop: '16px',
                      padding: '16px 20px',
                      background: 'linear-gradient(135deg, #FAF8F5 0%, #EEF2FF 100%)',
                      borderRadius: '12px',
                      border: '1.5px solid #C7D2FE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <ShieldCheck size={20} color="#4F46E5" />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#1E1B4B' }}>
                          Role Specifier & Credential Authority
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B7280' }}>
                          Assign and manage @usernames, secret passwords, and granular tab access in the dedicated Role Specifier tab.
                        </div>
                      </div>
                    </div>
                    {canAccessTab('roles') && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('roles');
                          loadTeamMembers();
                        }}
                        className="btn-admin-save"
                        style={{ padding: '7px 14px', fontSize: '12px', background: '#4F46E5', borderColor: '#4338CA' }}
                      >
                        Open Role Specifier Tab →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRODUCTS & SKUS */}
          {activeTab === 'products' && canAccessTab('products') && (
            <div className="tab-products-view">
              <div className="toolbar-row">
                <div className="search-box">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search product title or SKU..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>

                <div className="category-tabs">
                  {['all', 'candles', 'ocean-fresh', 'floral-rose', 'royal-oud', 'discovery-sets', 'gift-shop'].map((cat) => (
                    <button
                      key={cat}
                      className={`cat-pill ${productCategory === cat ? 'active' : ''}`}
                      onClick={() => setProductCategory(cat)}
                    >
                      {cat.replace('-', ' ').toUpperCase()}
                    </button>
                  ))}
                </div>

                <button
                  className="btn-add-sku"
                  onClick={() => {
                    setProductSaveStatus('idle');
                    setIsNewProduct(true);
                    setActiveModalTab('basics');
                    setRawNotes({ top: '', heart: '', base: '', ingredients: '' });
                    setEditingProduct({
                      id: `prod-${Date.now()}`,
                      sku: `NF-NEW-${Math.floor(100 + Math.random() * 900)}`,
                      title: '',
                      subtitle: '',
                      price: 999,
                      originalPrice: 1499,
                      rating: 5.0,
                      reviewsCount: 10,
                      badge: 'NEW',
                      image: '/images/products/whispered-surprises.jpg',
                      category: 'candles',
                      inStock: true,
                      stockCount: 50,
                      description: '',
                      gallery: [],
                      topNotes: [],
                      heartNotes: [],
                      baseNotes: [],
                      ingredients: [],
                      volume: '50ml',
                      longevity: '14+ Hours',
                      sillage: 'Radiant Projection',
                      concentration: 'Eau de Parfum',
                      scentFamily: '',
                      usageRitual: '',
                      slug: '',
                      metaTitle: '',
                      metaDescription: '',
                      imageAlt: '',
                      galleryAlt: [],
                      variants: [
                        { name: 'Standard Jar (300g)', price: 999, originalPrice: 1499 },
                        { name: 'Luxe Arch Gift Set', price: 1398, originalPrice: 1899 },
                      ],
                    });
                  }}
                >
                  <Plus size={16} />
                  <span>Add New SKU</span>
                </button>
              </div>

              <div className="products-admin-grid">
                {products
                  .filter((p) => {
                    const matchCat = productCategory === 'all' || p.category === productCategory;
                    const matchSearch =
                      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
                      p.sku.toLowerCase().includes(productSearch.toLowerCase());
                    return matchCat && matchSearch;
                  })
                  .map((product) => (
                    <div key={product.id} className="product-admin-card">
                      <div className="card-thumb-row">
                        <img src={product.image} alt={product.title} />
                        <Link
                          href={`/product/${product.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="thumb-quick-view-badge"
                          title={`View ${product.title} live in store`}
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </Link>
                        <div className="card-thumb-meta">
                          <span className="sku-tag">{product.sku}</span>
                          <span className="badge-tag">{product.badge || 'STANDARD'}</span>
                          <span className={`stock-tag ${product.inStock ? 'in' : 'out'}`}>
                            {product.inStock ? `${product.stockCount} in stock` : 'Out of Stock'}
                          </span>
                        </div>
                      </div>

                      <div className="card-body">
                        <h3 className="card-title font-serif">{product.title}</h3>
                        <p className="card-notes">{product.subtitle}</p>
                        <div className="card-price-row">
                          <div className="price font-serif">₹{(Number(product.price) || 0).toLocaleString('en-IN')}</div>
                          {product.originalPrice ? (
                            <div className="orig-price">₹{(Number(product.originalPrice) || 0).toLocaleString('en-IN')}</div>
                          ) : null}
                        </div>
                      </div>

                      <div className="card-footer-actions">
                        <Link
                          href={`/product/${product.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-view-product"
                          title={`View ${product.title} live on store`}
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </Link>
                        <button
                          type="button"
                          className="btn-edit-product"
                          onClick={() => {
                            setProductSaveStatus('idle');
                            setIsNewProduct(false);
                            setActiveModalTab('basics');
                            setRawNotes({
                              top: (product.topNotes || []).join(', '),
                              heart: (product.heartNotes || []).join(', '),
                              base: (product.baseNotes || []).join(', '),
                              ingredients: (product.ingredients || []).join(', '),
                            });
                            const initialVariants = product.variants && product.variants.length > 0
                              ? product.variants.map((v, i) =>
                                  i === 0
                                    ? {
                                        ...v,
                                        price: Number(product.price) || v.price,
                                        originalPrice: product.originalPrice !== undefined ? Number(product.originalPrice) : v.originalPrice,
                                      }
                                    : v
                                )
                              : (product.category === 'candles'
                                ? [
                                    { name: 'Standard Jar (300g)', price: product.price, originalPrice: product.originalPrice },
                                    { name: 'Luxe Arch Gift Set', price: product.price + 399, originalPrice: product.originalPrice ? product.originalPrice + 499 : undefined },
                                  ]
                                : [
                                    { name: '50ml Eau de Parfum Flacon', price: product.price, originalPrice: product.originalPrice },
                                    { name: '100ml Grand Flacon', price: product.price + 699, originalPrice: product.originalPrice ? product.originalPrice + 899 : undefined },
                                    { name: '10ml Pocket Flacon', price: 699 },
                                  ]);

                            setEditingProduct({
                              ...product,
                              gallery: product.gallery || [],
                              variants: initialVariants,
                            });
                          }}
                        >
                          <Edit2 size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className="btn-delete-product"
                          title={`Delete ${product.title}`}
                          onClick={async () => {
                            if (confirm(`Delete ${product.title}?`)) {
                              const updatedProducts = products.filter((p) => p.id !== product.id);
                              const updatedStore: StoreData = {
                                ...storeData,
                                products: updatedProducts,
                              };
                              setStoreData(updatedStore);
                              try {
                                await fetch('/api/store', {
                                  method: 'POST',
                                  headers: getAuthHeaders(),
                                  credentials: 'include',
                                  body: JSON.stringify(updatedStore),
                                });
                                await loadData();
                              } catch (err) {
                                console.error('Error auto-saving deleted product:', err);
                              }
                            }
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 3: DELIVERY & ORDERS */}
          {activeTab === 'orders' && canAccessTab('orders') && (
            <div className="tab-orders-view">
              <div className="toolbar-row">
                <div className="search-box">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search Order ID, Customer Name, or City..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                  />
                </div>

                <div className="category-tabs">
                  {['all', 'confirmed', 'dispatched', 'in-transit', 'delivered'].map((st) => (
                    <button
                      key={st}
                      className={`cat-pill ${orderStatusFilter === st ? 'active' : ''}`}
                      onClick={() => setOrderStatusFilter(st)}
                    >
                      {st.toUpperCase().replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {(() => {
                const filteredOrders = orders.filter((o) => {
                  const matchStatus =
                    orderStatusFilter === 'all' || o.deliveryStatus === orderStatusFilter;
                  const matchSearch =
                    o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                    o.customer.toLowerCase().includes(orderSearch.toLowerCase()) ||
                    o.destination.toLowerCase().includes(orderSearch.toLowerCase());
                  return matchStatus && matchSearch;
                });

                if (filteredOrders.length === 0) {
                  return (
                    <div style={{ textAlign: 'center', padding: '60px 24px', background: '#F9F7F2', borderRadius: '14px', border: '1px solid rgba(187, 165, 142, 0.25)' }}>
                      <Truck size={42} color="#8A7258" style={{ margin: '0 auto 14px', opacity: 0.85 }} />
                      <h4 style={{ color: '#121212', margin: '0 0 6px 0', fontSize: '16px', fontWeight: 600 }}>
                        No Orders Found
                      </h4>
                      <p style={{ margin: 0, fontSize: '13px', color: '#707070' }}>
                        {orderSearch || orderStatusFilter !== 'all'
                          ? 'No orders match your current search or status filter.'
                          : 'No customer orders have been placed yet.'}
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ORDER ID</th>
                          <th>CUSTOMER</th>
                          <th>ITEMS</th>
                          <th>DESTINATION</th>
                          <th>AMOUNT</th>
                          <th>PAYMENT</th>
                          <th>STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="clickable-row"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <td className="order-id-text">{order.id}</td>
                            <td>
                              <strong>{order.customer}</strong>
                              <div style={{ fontSize: '11px', color: '#707070' }}>{order.phone}</div>
                            </td>
                            <td>
                              <div className="order-items-preview-stack">
                                {order.items?.map((it, idx) => (
                                  <span key={idx} className="item-chip">
                                    {it.quantity}x {it.title}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="destination-text">
                              {order.destination}
                              {order.distanceKm && (
                                <div style={{ fontSize: '10.5px', color: '#8A7258', marginTop: '2px' }}>
                                  📍 {order.distanceKm} km ({order.zoneName || 'Delhi Hub'})
                                </div>
                              )}
                            </td>
                            <td className="amount-text font-serif">₹{(Number(order.amount) || 0).toLocaleString('en-IN')}</td>
                            <td>
                              {order.isPartialCod || order.paymentStatus === 'advance_paid' ? (
                                <div>
                                  <span style={{ fontSize: '11px', background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: '4px', fontWeight: 600, display: 'inline-block' }}>
                                    COD (Adv: ₹{(Number(order.advanceAmount) || 0).toLocaleString('en-IN')})
                                  </span>
                                  <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 700, marginTop: '2px' }}>
                                    Due: ₹{(Number(order.remainingCodAmount ?? ((Number(order.amount) || 0) - (Number(order.advanceAmount) || 0))) || 0).toLocaleString('en-IN')}
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <span>{order.payment}</span>
                                  <span style={{ fontSize: '10.5px', color: '#15803d', display: 'block', fontWeight: 600 }}>
                                    ✓ Fully Paid
                                  </span>
                                </div>
                              )}
                            </td>
                            <td>
                              <select
                                value={order.deliveryStatus}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className={`status-select ${order.deliveryStatus}`}
                              >
                                <option value="confirmed">CONFIRMED</option>
                                <option value="dispatched">DISPATCHED</option>
                                <option value="in-transit">IN TRANSIT</option>
                                <option value="delivered">DELIVERED</option>
                                <option value="cancelled">CANCELLED</option>
                              </select>
                            </td>
                            <td>
                              <button
                                className="btn-view-order-details"
                                onClick={() => setSelectedOrder(order)}
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 4: BANNERS & MEDIA */}
          {activeTab === 'banners' && canAccessTab('banners') && (
            <div className="tab-banners-view">
              <div className="admin-editor-card">
                <h3 className="editor-card-title font-serif">Hero Section Content</h3>
                <div className="form-group-row">
                  <div className="form-field">
                    <label>Badge Tagline</label>
                    <input
                      type="text"
                      value={storeData.hero.badge}
                      onChange={(e) =>
                        setStoreData({
                          ...storeData,
                          hero: { ...storeData.hero, badge: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="form-field">
                    <label>Main Headline</label>
                    <input
                      type="text"
                      value={storeData.hero.headline}
                      onChange={(e) =>
                        setStoreData({
                          ...storeData,
                          hero: { ...storeData.hero, headline: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Subtitle / Brand Mission</label>
                  <textarea
                    rows={2}
                    value={storeData.hero.subtitle}
                    onChange={(e) =>
                      setStoreData({
                        ...storeData,
                        hero: { ...storeData.hero, subtitle: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="form-group-row">
                  <div className="form-field">
                    <label>Primary Button Text</label>
                    <input
                      type="text"
                      value={storeData.hero.primaryCtaText}
                      onChange={(e) =>
                        setStoreData({
                          ...storeData,
                          hero: { ...storeData.hero, primaryCtaText: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="form-field">
                    <label>Secondary Button Text</label>
                    <input
                      type="text"
                      value={storeData.hero.secondaryCtaText}
                      onChange={(e) =>
                        setStoreData({
                          ...storeData,
                          hero: { ...storeData.hero, secondaryCtaText: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                {/* Hero Media Format & Video Controls */}
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(187, 165, 142, 0.2)' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#121212', marginBottom: '10px' }}>
                    Hero Media Display Format
                  </label>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() =>
                        setStoreData({
                          ...storeData,
                          hero: { ...storeData.hero, mediaType: 'video' },
                        })
                      }
                      style={{
                        padding: '10px 18px',
                        borderRadius: '8px',
                        border: '1.5px solid',
                        borderColor: storeData.hero.mediaType !== 'image' ? '#121212' : 'rgba(187, 165, 142, 0.35)',
                        background: storeData.hero.mediaType !== 'image' ? '#121212' : '#F9F7F2',
                        color: storeData.hero.mediaType !== 'image' ? '#F9F7F2' : '#707070',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: 600,
                        fontSize: '13px',
                        flex: '1 1 200px',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Film size={16} />
                      Cinematic Video (MP4 Autoplay Loop)
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setStoreData({
                          ...storeData,
                          hero: { ...storeData.hero, mediaType: 'image' },
                        })
                      }
                      style={{
                        padding: '10px 18px',
                        borderRadius: '8px',
                        border: '1.5px solid',
                        borderColor: storeData.hero.mediaType === 'image' ? '#121212' : 'rgba(187, 165, 142, 0.35)',
                        background: storeData.hero.mediaType === 'image' ? '#121212' : '#F9F7F2',
                        color: storeData.hero.mediaType === 'image' ? '#F9F7F2' : '#707070',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: 600,
                        fontSize: '13px',
                        flex: '1 1 200px',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                    >
                      <ImageIcon size={16} />
                      Static High-Res Image
                    </button>
                  </div>

                  <div className="form-group-row">
                    <div className="form-field">
                      <label>Hero Video File URL (.mp4)</label>
                      <input
                        type="text"
                        value={storeData.hero.video || ''}
                        placeholder="/videos/hero/noor_header_hero_video.mp4"
                        onChange={(e) =>
                          setStoreData({
                            ...storeData,
                            hero: { ...storeData.hero, video: e.target.value },
                          })
                        }
                      />
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', color: '#707070' }}>Presets:</span>
                        <button
                          type="button"
                          onClick={() =>
                            setStoreData({
                              ...storeData,
                              hero: { ...storeData.hero, video: '/videos/hero/noor_header_hero_video.mp4', mediaType: 'video' },
                            })
                          }
                          style={{
                            fontSize: '10.5px',
                            background: '#F9F7F2',
                            border: '1px solid rgba(187, 165, 142, 0.35)',
                            color: '#121212',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 600,
                          }}
                        >
                          ✦ Atelier 4K
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setStoreData({
                              ...storeData,
                              hero: { ...storeData.hero, video: '/videos/reels/IMG_5927.MP4', mediaType: 'video' },
                            })
                          }
                          style={{
                            fontSize: '10.5px',
                            background: '#F9F7F2',
                            border: '1px solid rgba(187, 165, 142, 0.35)',
                            color: '#121212',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 600,
                          }}
                        >
                          ✦ Artisanal Pour
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setStoreData({
                              ...storeData,
                              hero: { ...storeData.hero, video: '/videos/reels/IMG_5931.MP4', mediaType: 'video' },
                            })
                          }
                          style={{
                            fontSize: '10.5px',
                            background: '#F9F7F2',
                            border: '1px solid rgba(187, 165, 142, 0.35)',
                            color: '#121212',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 600,
                          }}
                        >
                          ✦ Luxury Unboxing
                        </button>
                      </div>
                    </div>

                    <div className="form-field">
                      <label>Fallback / Poster Image URL</label>
                      <input
                        type="text"
                        value={storeData.hero.image || ''}
                        placeholder="/images/hero/hero-candle.jpg"
                        onChange={(e) =>
                          setStoreData({
                            ...storeData,
                            hero: { ...storeData.hero, image: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div className="form-field" style={{ marginTop: '8px' }}>
                      <label>Hero Image Alt Text (SEO & Accessibility)</label>
                      <input
                        type="text"
                        value={storeData.hero.imageAlt || ''}
                        placeholder="e.g. NOOR-E-FLAMES artisanal perfume stone flacon and candle atelier at sunset"
                        onChange={(e) =>
                          setStoreData({
                            ...storeData,
                            hero: { ...storeData.hero, imageAlt: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Live Admin Preview */}
                  <div style={{ marginTop: '16px', padding: '14px', background: '#F9F7F2', borderRadius: '10px', border: '1px solid rgba(187, 165, 142, 0.25)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#8A7258', textTransform: 'uppercase' }}>
                        ✦ Live Hero Media Preview
                      </span>
                      <span style={{ fontSize: '11px', color: '#707070' }}>
                        {storeData.hero.mediaType === 'image' ? 'Showing static image' : 'Showing video stream'}
                      </span>
                    </div>

                    {storeData.hero.mediaType !== 'image' && storeData.hero.video ? (
                      <video
                        key={storeData.hero.video}
                        src={storeData.hero.video}
                        controls
                        muted
                        loop
                        playsInline
                        style={{
                          width: '100%',
                          maxHeight: '260px',
                          borderRadius: '8px',
                          background: '#000',
                          objectFit: 'contain',
                          display: 'block',
                        }}
                      />
                    ) : (
                      <img
                        src={storeData.hero.image || '/images/hero/hero-candle.jpg'}
                        alt="Hero preview"
                        style={{
                          width: '100%',
                          maxHeight: '260px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          display: 'block',
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Discovery Banner Editor */}
              <div className="admin-editor-card" style={{ marginTop: '24px' }}>
                <h3 className="editor-card-title font-serif">Discovery Gift Box Banner</h3>
                <div className="form-group-row">
                  <div className="form-field">
                    <label>Banner Title</label>
                    <input
                      type="text"
                      value={storeData.discoveryBanner.title}
                      onChange={(e) =>
                        setStoreData({
                          ...storeData,
                          discoveryBanner: { ...storeData.discoveryBanner, title: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="form-field">
                    <label>CTA Button Text</label>
                    <input
                      type="text"
                      value={storeData.discoveryBanner.buttonText}
                      onChange={(e) =>
                        setStoreData({
                          ...storeData,
                          discoveryBanner: {
                            ...storeData.discoveryBanner,
                            buttonText: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Banner Subtitle</label>
                  <input
                    type="text"
                    value={storeData.discoveryBanner.subtitle}
                    onChange={(e) =>
                      setStoreData({
                        ...storeData,
                        discoveryBanner: {
                          ...storeData.discoveryBanner,
                          subtitle: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="form-group-row" style={{ marginTop: '12px' }}>
                  <div className="form-field">
                    <label>Showcase Box Image Alt Text</label>
                    <input
                      type="text"
                      value={storeData.discoveryBanner.showcaseImageAlt || ''}
                      placeholder="e.g. Signature white luxury gift box with golden ribbon"
                      onChange={(e) =>
                        setStoreData({
                          ...storeData,
                          discoveryBanner: {
                            ...storeData.discoveryBanner,
                            showcaseImageAlt: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="form-field">
                    <label>Background Image Alt Text</label>
                    <input
                      type="text"
                      value={storeData.discoveryBanner.backgroundImageAlt || ''}
                      placeholder="e.g. Atelier brand packaging and velvet display"
                      onChange={(e) =>
                        setStoreData({
                          ...storeData,
                          discoveryBanner: {
                            ...storeData.discoveryBanner,
                            backgroundImageAlt: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Top Announcement Ticker */}
              <div className="admin-editor-card" style={{ marginTop: '24px' }}>
                <h3 className="editor-card-title font-serif">Top Announcement Marquee Deals</h3>
                {storeData.siteSettings.announcements.map((ann, idx) => (
                  <div key={idx} className="marquee-item-row" style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      value={ann}
                      onChange={(e) => {
                        const updated = [...storeData.siteSettings.announcements];
                        updated[idx] = e.target.value;
                        setStoreData({
                          ...storeData,
                          siteSettings: { ...storeData.siteSettings, announcements: updated },
                        });
                      }}
                      style={{ flex: 1 }}
                    />
                    <button
                      className="btn-delete-product"
                      onClick={() => {
                        const updated = storeData.siteSettings.announcements.filter((_, i) => i !== idx);
                        setStoreData({
                          ...storeData,
                          siteSettings: { ...storeData.siteSettings, announcements: updated },
                        });
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  className="btn-add-sku"
                  style={{ marginTop: '8px' }}
                  onClick={() => {
                    setStoreData({
                      ...storeData,
                      siteSettings: {
                        ...storeData.siteSettings,
                        announcements: [
                          ...storeData.siteSettings.announcements,
                          '🔥 Special Limited-Edition Fragrance Drop Available Now',
                        ],
                      },
                    });
                  }}
                >
                  <Plus size={14} />
                  <span>Add Announcement Line</span>
                </button>
              </div>

              {/* Global Storefront SEO & Social Meta Card */}
              <div className="admin-editor-card" style={{ marginTop: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Sparkles size={18} color="#BBA58E" />
                  <h3 className="editor-card-title font-serif" style={{ margin: 0 }}>
                    Global Storefront SEO & Social Metadata
                  </h3>
                </div>
                <p style={{ color: '#707070', fontSize: '13px', marginBottom: '18px' }}>
                  Configure the default website title, description, and social share alt text used by search engines when users browse your root store domain.
                </p>

                <div className="form-field">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontWeight: 600 }}>Global Homepage Meta Title</label>
                    <span style={{ fontSize: '11px', color: '#888' }}>
                      {(storeData.siteSettings.metaTitle || '').length} / 60 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={storeData.siteSettings.metaTitle || ''}
                    placeholder="e.g. NOOR-E-FLAMES | Where Fragrance Meets Flames — Artisanal Perfumes & Candles"
                    onChange={(e) =>
                      setStoreData({
                        ...storeData,
                        siteSettings: {
                          ...storeData.siteSettings,
                          metaTitle: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="form-field">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontWeight: 600 }}>Global Homepage Meta Description</label>
                    <span style={{ fontSize: '11px', color: '#888' }}>
                      {(storeData.siteSettings.metaDescription || '').length} / 160 chars
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={storeData.siteSettings.metaDescription || ''}
                    placeholder="e.g. Handcrafted luxury perfumes, alcohol-free traditional attars, and clean-burning soy candles with secret messages. Artisanal small batches formulated in New Delhi."
                    onChange={(e) =>
                      setStoreData({
                        ...storeData,
                        siteSettings: {
                          ...storeData.siteSettings,
                          metaDescription: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="form-field">
                  <label style={{ fontWeight: 600 }}>Default Brand Image Alt Text</label>
                  <input
                    type="text"
                    value={storeData.siteSettings.defaultImageAlt || ''}
                    placeholder="e.g. NOOR-E-FLAMES luxury perfume and candles signature collection"
                    onChange={(e) =>
                      setStoreData({
                        ...storeData,
                        siteSettings: {
                          ...storeData.siteSettings,
                          defaultImageAlt: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CODES & OFFERS */}
          {activeTab === 'offers' && canAccessTab('offers') && (
            <div className="tab-offers-view">
              <div className="toolbar-row">
                <h3 className="font-serif" style={{ fontSize: '18px' }}>Store Coupons & Promotional Codes</h3>
                <button
                  className="btn-add-sku"
                  onClick={() => {
                    setCouponSaveStatus('idle');
                    setIsNewCoupon(true);
                    setEditingCoupon({
                      code: '',
                      discountPercent: 15,
                      discountAmount: 0,
                      minOrder: 999,
                      description: '15% off orders above ₹999',
                      isActive: true,
                      freeShipping: false,
                    });
                  }}
                >
                  <Plus size={16} />
                  <span>Create New Coupon</span>
                </button>
              </div>

              <div className="coupons-grid">
                {coupons.map((coupon) => (
                  <div key={coupon.code} className="coupon-admin-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="coupon-header">
                      <span className="coupon-code-badge font-mono">{coupon.code}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '10.5px', color: coupon.isActive ? '#166534' : '#888', fontWeight: 600 }}>
                          {coupon.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={coupon.isActive}
                            onChange={(e) => {
                              const updatedCoupons = coupons.map((c) =>
                                c.code === coupon.code ? { ...c, isActive: e.target.checked } : c
                              );
                              const updatedStore = {
                                ...storeData,
                                coupons: updatedCoupons,
                              };
                              setStoreData(updatedStore);
                              fetch('/api/store', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'include',
                                body: JSON.stringify(updatedStore),
                              }).catch((err) => console.error('Error auto-saving coupon toggle:', err));
                            }}
                          />
                          <span className="slider" />
                        </label>
                      </div>
                    </div>
                    <div className="coupon-discount font-serif">
                      {coupon.discountPercent > 0
                        ? `${coupon.discountPercent}% OFF`
                        : coupon.fixedPrice
                        ? `₹${(Number(coupon.fixedPrice) || 0).toLocaleString('en-IN')} BUNDLE`
                        : coupon.discountAmount
                        ? `₹${(Number(coupon.discountAmount) || 0).toLocaleString('en-IN')} OFF`
                        : 'FREE SHIPPING'}
                    </div>
                    <p className="coupon-desc">{coupon.description}</p>
                    <div className="coupon-meta" style={{ marginBottom: '12px' }}>
                      Min. Order Value: ₹{(Number(coupon.minOrder) || 0).toLocaleString('en-IN')}
                      {coupon.freeShipping && ' · Free Shipping Included'}
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', borderTop: '1px solid #f0ede8', paddingTop: '12px' }}>
                      <button
                        type="button"
                        className="btn-edit-product"
                        style={{ padding: '6px 12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                        onClick={() => {
                          setCouponSaveStatus('idle');
                          setIsNewCoupon(false);
                          setEditingCoupon({ ...coupon });
                        }}
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        style={{
                          padding: '6px 10px',
                          fontSize: '11px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#dc2626',
                          background: '#fee2e2',
                          border: '1px solid #fecaca',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleDeleteCoupon(coupon.code)}
                        title="Delete coupon"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SYNC & DEPLOY */}
          {activeTab === 'sync' && canAccessTab('sync') && (
            <div className="tab-sync-view">
              <div className="admin-editor-card">
                <h3 className="editor-card-title font-serif">Storefront Persistence & Backup</h3>
                <p style={{ color: '#707070', marginBottom: '16px' }}>
                  All product catalogs, orders, hero slides, and promotional codes are stored locally in{' '}
                  <code>data/store.json</code> with zero reliance on Sanity CMS.
                </p>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    className="btn-admin-save"
                    onClick={() => {
                      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(storeData, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute('href', dataStr);
                      downloadAnchor.setAttribute('download', `noor-e-flames-backup-${Date.now()}.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                  >
                    <Save size={16} />
                    <span>Export JSON Backup</span>
                  </button>

                  <button className="btn-admin-deploy" onClick={loadData}>
                    <RefreshCw size={16} />
                    <span>Reload from Disk</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 7. WHATSAPP CRM & AUTOMATION (Open-WA API Integration) */}
          {activeTab === 'whatsapp' && canAccessTab('whatsapp') && (
            <div className="tab-pane active" id="tab-whatsapp">
              <div className="tab-header">
                <div>
                  <h2 className="tab-title font-serif">WhatsApp Automated Commerce CRM</h2>
                  <p className="tab-subtitle">
                    Automated, personalized notifications powered by Open-WA (<a href="https://www.open-wa.org/" target="_blank" rel="noopener noreferrer" style={{ color: '#1B5E20', textDecoration: 'underline', fontWeight: 600 }}>open-wa.org</a>) & WhatsApp Cloud API
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button className="btn-admin-secondary" onClick={loadCustomers} style={{ padding: '9px 16px', fontSize: '12.5px' }}>
                    <RefreshCw size={14} />
                    <span>Refresh Customers</span>
                  </button>
                  <span
                    style={{
                      background: '#E8F5E9',
                      border: '1px solid #C8E6C9',
                      color: '#2E7D32',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2E7D32', display: 'inline-block' }}></span>
                    Open-WA Gateway Active
                  </span>
                </div>
              </div>

              {whatsappFeedback && (
                <div
                  style={{
                    marginBottom: '22px',
                    padding: '16px 20px',
                    borderRadius: '10px',
                    background: whatsappFeedback.startsWith('✓') ? '#E8F5E9' : '#FFF3E0',
                    border: `1px solid ${whatsappFeedback.startsWith('✓') ? '#A5D6A7' : '#FFE0B2'}`,
                    color: whatsappFeedback.startsWith('✓') ? '#1B5E20' : '#E65100',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                    <MessageSquare size={16} />
                    <span>{whatsappFeedback}</span>
                  </div>
                  {whatsappDirectLink && !whatsappFeedback.startsWith('✓') && (
                    <a
                      href={whatsappDirectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-admin-primary"
                      style={{
                        padding: '9px 18px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        textDecoration: 'none',
                        background: '#121212',
                        color: '#FFFFFF',
                        borderRadius: '8px',
                      }}
                    >
                      <ExternalLink size={14} />
                      <span>Send via WhatsApp Web Now →</span>
                    </a>
                  )}
                </div>
              )}

              {/* Designated WhatsApp Sender Account Banner */}
              <div
                className="admin-editor-card"
                style={{
                  marginBottom: '24px',
                  padding: '22px 28px',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F9F7F2 100%)',
                  border: '1px solid rgba(187, 165, 142, 0.35)',
                  borderRadius: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                  boxShadow: '0 4px 14px rgba(18, 18, 18, 0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: '#E8F5E9',
                      border: '1px solid #C8E6C9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1B5E20',
                      flexShrink: 0,
                    }}
                  >
                    <Phone size={22} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#8A7258', fontWeight: 700 }}>
                        Official Atelier Dispatch Account
                      </span>
                      {gatewayStatusInfo?.connected ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '10.5px', fontWeight: 700 }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E' }} />
                          Render Gateway Live & Connected
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: '12px', fontSize: '10.5px', fontWeight: 700 }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B' }} />
                          Live Sync Active
                        </span>
                      )}
                    </div>

                    {!isEditingDispatchPhone ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: '#121212', letterSpacing: '0.5px' }}>
                          {getFormattedWhatsAppNumber(activeDispatchPhone)}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setDispatchPhoneInput(activeDispatchPhone);
                            setIsEditingDispatchPhone(true);
                          }}
                          className="btn-admin-secondary"
                          style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px' }}
                          title="Change Dispatch Phone Number"
                        >
                          <Edit2 size={11} />
                          <span>Change Number</span>
                        </button>
                        <button
                          type="button"
                          onClick={fetchLiveGatewayStatus}
                          disabled={isRefreshingGateway}
                          className="btn-admin-secondary"
                          style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px' }}
                          title="Refresh status from Render Gateway"
                        >
                          <RefreshCw size={11} className={isRefreshingGateway ? 'animate-spin' : ''} />
                          <span>{isRefreshingGateway ? 'Syncing...' : 'Sync Gateway'}</span>
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                        <input
                          type="tel"
                          value={dispatchPhoneInput}
                          onChange={(e) => setDispatchPhoneInput(e.target.value)}
                          placeholder="+918368291472"
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1.5px solid #8A7258',
                            fontSize: '14px',
                            fontWeight: 700,
                            outline: 'none',
                            color: '#121212',
                            width: '180px',
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleSaveDispatchPhone}
                          disabled={isSavingDispatchPhone}
                          className="btn-admin-primary"
                          style={{ padding: '6px 12px', fontSize: '11.5px', borderRadius: '6px' }}
                        >
                          {isSavingDispatchPhone ? 'Saving...' : 'Save & Apply'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingDispatchPhone(false)}
                          className="btn-admin-secondary"
                          style={{ padding: '6px 10px', fontSize: '11.5px', borderRadius: '6px' }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    <div style={{ fontSize: '12.5px', color: '#707070', marginTop: '4px' }}>
                      Automated customer welcomes, order dispatch notifications & COD confirmations stream actively from this number.
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <a
                    href="https://nooreflames.onrender.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-admin-primary"
                    style={{
                      padding: '9px 16px',
                      fontSize: '12.5px',
                      background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
                      border: 'none',
                      color: '#ffffff',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(27, 94, 32, 0.25)',
                    }}
                    title="Open WhatsApp Automation Gateway on Render"
                  >
                    <ExternalLink size={14} />
                    <span>Open Gateway (Render)</span>
                  </a>

                  <a
                    href={getWhatsAppLink('', activeDispatchPhone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-admin-secondary"
                    style={{ padding: '9px 16px', fontSize: '12.5px' }}
                  >
                    <Phone size={14} />
                    <span>Open in WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* 1. BULK PERSONALIZED BROADCAST CAMPAIGN SUITE (ALL SIGNED-UP USERS)      */}
              {/* ========================================================================= */}
              <div
                className="admin-editor-card"
                style={{
                  marginBottom: '28px',
                  padding: '28px',
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1.5px solid rgba(187, 165, 142, 0.45)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                }}
              >
                {/* Header ribbon */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '14px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid rgba(187, 165, 142, 0.25)',
                    marginBottom: '22px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: '#E8F5E9',
                        color: '#1B5E20',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Users size={22} />
                    </div>
                    <div>
                      <h3
                        className="font-serif"
                        style={{
                          margin: 0,
                          fontSize: '20px',
                          fontWeight: 700,
                          color: '#121212',
                          letterSpacing: '-0.3px',
                        }}
                      >
                        Personalized Broadcast to All Registered Users
                      </h3>
                      <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: '#666666' }}>
                        Send custom WhatsApp messages customized for every user at once with their name, phone, and exclusive VIP privileges.
                      </p>
                    </div>
                  </div>

                  {/* Stat pills */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div
                      style={{
                        padding: '6px 12px',
                        background: '#F9F7F2',
                        border: '1px solid rgba(187, 165, 142, 0.35)',
                        borderRadius: '20px',
                        fontSize: '12px',
                        color: '#444444',
                        fontWeight: 600,
                      }}
                    >
                      Registered Patrons:{' '}
                      <strong style={{ color: '#121212' }}>{customers.length}</strong>
                    </div>

                    <div
                      style={{
                        padding: '6px 12px',
                        background: '#E8F5E9',
                        border: '1px solid #C8E6C9',
                        borderRadius: '20px',
                        fontSize: '12px',
                        color: '#1B5E20',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Phone size={12} />
                      <span>
                        With WhatsApp:{' '}
                        <strong>
                          {customers.filter((c) => c.phone && String(c.phone).replace(/\D/g, '').slice(-10).length === 10).length}
                        </strong>
                      </span>
                    </div>

                    <div
                      style={{
                        padding: '6px 14px',
                        background: selectedCustomerIds.length > 0 ? '#121212' : '#F0ECE4',
                        color: selectedCustomerIds.length > 0 ? '#FFFFFF' : '#888888',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 700,
                      }}
                    >
                      Selected to Receive:{' '}
                      <strong>{selectedCustomerIds.length}</strong>
                    </div>
                  </div>
                </div>

                {/* Main 2-Column Composer: Left = Campaign Editor, Right = Live Dynamic Preview */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                    gap: '24px',
                    marginBottom: '26px',
                  }}
                >
                  {/* LEFT: Composer Controls */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Preset Picker */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '11.5px',
                          color: '#707070',
                          marginBottom: '8px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.6px',
                          fontWeight: 700,
                        }}
                      >
                        Campaign Preset Template
                      </label>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                          gap: '8px',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => applyBroadcastPreset('vip15')}
                          style={{
                            padding: '9px 12px',
                            borderRadius: '8px',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            textAlign: 'left',
                            cursor: 'pointer',
                            background: bulkBroadcastTemplate === 'vip15' ? '#121212' : '#F9F7F2',
                            color: bulkBroadcastTemplate === 'vip15' ? '#FFFFFF' : '#333333',
                            border: `1.5px solid ${bulkBroadcastTemplate === 'vip15' ? '#121212' : 'rgba(187, 165, 142, 0.35)'}`,
                            transition: 'all 0.15s ease',
                          }}
                        >
                          🕯️ VIP 15% Off (VIP15)
                        </button>
                        <button
                          type="button"
                          onClick={() => applyBroadcastPreset('welcome')}
                          style={{
                            padding: '9px 12px',
                            borderRadius: '8px',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            textAlign: 'left',
                            cursor: 'pointer',
                            background: bulkBroadcastTemplate === 'welcome' ? '#121212' : '#F9F7F2',
                            color: bulkBroadcastTemplate === 'welcome' ? '#FFFFFF' : '#333333',
                            border: `1.5px solid ${bulkBroadcastTemplate === 'welcome' ? '#121212' : 'rgba(187, 165, 142, 0.35)'}`,
                            transition: 'all 0.15s ease',
                          }}
                        >
                          🎁 Welcome 10% Off (WELCOME10)
                        </button>
                        <button
                          type="button"
                          onClick={() => applyBroadcastPreset('launch')}
                          style={{
                            padding: '9px 12px',
                            borderRadius: '8px',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            textAlign: 'left',
                            cursor: 'pointer',
                            background: bulkBroadcastTemplate === 'launch' ? '#121212' : '#F9F7F2',
                            color: bulkBroadcastTemplate === 'launch' ? '#FFFFFF' : '#333333',
                            border: `1.5px solid ${bulkBroadcastTemplate === 'launch' ? '#121212' : 'rgba(187, 165, 142, 0.35)'}`,
                            transition: 'all 0.15s ease',
                          }}
                        >
                          ✨ New Drop 20% Off (NOOR20)
                        </button>
                        <button
                          type="button"
                          onClick={() => applyBroadcastPreset('secret')}
                          style={{
                            padding: '9px 12px',
                            borderRadius: '8px',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            textAlign: 'left',
                            cursor: 'pointer',
                            background: bulkBroadcastTemplate === 'secret' ? '#121212' : '#F9F7F2',
                            color: bulkBroadcastTemplate === 'secret' ? '#FFFFFF' : '#333333',
                            border: `1.5px solid ${bulkBroadcastTemplate === 'secret' ? '#121212' : 'rgba(187, 165, 142, 0.35)'}`,
                            transition: 'all 0.15s ease',
                          }}
                        >
                          💎 Secret Candle & Attar
                        </button>
                      </div>
                    </div>

                    {/* VIP Coupon Code + Delay */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            fontSize: '11.5px',
                            color: '#707070',
                            marginBottom: '6px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.6px',
                            fontWeight: 700,
                          }}
                        >
                          Coupon Code ({'{coupon}'})
                        </label>
                        <input
                          type="text"
                          value={bulkBroadcastCoupon}
                          onChange={(e) => setBulkBroadcastCoupon(e.target.value.toUpperCase())}
                          placeholder="e.g. VIP15"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            background: '#F9F7F2',
                            border: '1.5px solid rgba(187, 165, 142, 0.35)',
                            fontSize: '13px',
                            fontWeight: 700,
                            letterSpacing: '1px',
                            color: '#121212',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      <div>
                        <label
                          style={{
                            display: 'block',
                            fontSize: '11.5px',
                            color: '#707070',
                            marginBottom: '6px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.6px',
                            fontWeight: 700,
                          }}
                        >
                          Dispatch Speed Delay
                        </label>
                        <select
                          value={broadcastDelayMs}
                          onChange={(e) => setBroadcastDelayMs(Number(e.target.value))}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            background: '#F9F7F2',
                            border: '1.5px solid rgba(187, 165, 142, 0.35)',
                            fontSize: '12.5px',
                            color: '#121212',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        >
                          <option value={500}>500ms (Fast)</option>
                          <option value={800}>800ms (Balanced - Recommended)</option>
                          <option value={1200}>1.2s (Safe)</option>
                          <option value={2000}>2.0s (High Safety Anti-Spam)</option>
                        </select>
                      </div>
                    </div>

                    {/* Personalization Variable Chips */}
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '6px',
                        }}
                      >
                        <label
                          style={{
                            fontSize: '11.5px',
                            color: '#707070',
                            textTransform: 'uppercase',
                            letterSpacing: '0.6px',
                            fontWeight: 700,
                          }}
                        >
                          Click to Insert Personalization Tags
                        </label>
                        <span style={{ fontSize: '11px', color: '#8A7258', fontWeight: 600 }}>
                          Auto-replaced per customer
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {[
                          { label: '{name}', desc: 'Full Name' },
                          { label: '{firstName}', desc: 'First Name' },
                          { label: '{coupon}', desc: 'VIP Code' },
                          { label: '{phone}', desc: 'Phone' },
                          { label: '{siteUrl}', desc: 'Website Link' },
                          { label: '{brand}', desc: 'Brand' },
                        ].map((t) => (
                          <button
                            key={t.label}
                            type="button"
                            onClick={() => {
                              insertTokenIntoBroadcast(t.label);
                              setBulkBroadcastTemplate('custom');
                            }}
                            title={`Insert ${t.desc}`}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              fontSize: '11.5px',
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              background: '#F0ECE4',
                              border: '1px solid rgba(187, 165, 142, 0.4)',
                              color: '#5C4A3A',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span>+ {t.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Textarea Editor */}
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '6px',
                        }}
                      >
                        <label
                          style={{
                            fontSize: '11.5px',
                            color: '#707070',
                            textTransform: 'uppercase',
                            letterSpacing: '0.6px',
                            fontWeight: 700,
                          }}
                        >
                          Message Content Template
                        </label>
                        <span style={{ fontSize: '11px', color: '#888888' }}>
                          {bulkBroadcastMessage.length} characters
                        </span>
                      </div>
                      <textarea
                        rows={7}
                        value={bulkBroadcastMessage}
                        onChange={(e) => {
                          setBulkBroadcastMessage(e.target.value);
                          setBulkBroadcastTemplate('custom');
                        }}
                        placeholder="Write your customized WhatsApp message template here..."
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '8px',
                          background: '#F9F7F2',
                          border: '1.5px solid rgba(187, 165, 142, 0.35)',
                          color: '#121212',
                          fontSize: '13px',
                          lineHeight: 1.5,
                          resize: 'vertical',
                          outline: 'none',
                          boxSizing: 'border-box',
                          fontFamily: 'inherit',
                        }}
                      />
                    </div>

                    {/* Broadcast Action Buttons */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '4px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="btn-admin-primary"
                        disabled={
                          isBroadcasting ||
                          selectedCustomerIds.length === 0 ||
                          !bulkBroadcastMessage.trim()
                        }
                        onClick={handleBroadcastToAllSelected}
                        style={{
                          flex: 1,
                          minWidth: '220px',
                          padding: '13px 22px',
                          fontSize: '13.5px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          cursor: selectedCustomerIds.length > 0 ? 'pointer' : 'not-allowed',
                          opacity: selectedCustomerIds.length > 0 ? 1 : 0.6,
                          background: '#121212',
                          color: '#FFFFFF',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }}
                      >
                        <Send size={16} />
                        <span>
                          {isBroadcasting
                            ? `Broadcasting (${broadcastProgress.current}/${broadcastProgress.total})...`
                            : `Send Customized Messages to All (${selectedCustomerIds.length} Users)`}
                        </span>
                      </button>

                      <button
                        type="button"
                        className="btn-admin-secondary"
                        onClick={() => {
                          const validCustomers = customers.filter(
                            (c) =>
                              selectedCustomerIds.includes(c.id || c.phone || c.email) &&
                              Boolean(c.phone && String(c.phone).replace(/\D/g, '').slice(-10).length === 10)
                          );
                          const linksText = validCustomers
                            .map((c) => {
                              const cleanPhone = String(c.phone).replace(/\D/g, '').slice(-10);
                              const text = getPersonalizedPreviewText(bulkBroadcastMessage, c);
                              return `${c.name || 'Patron'} (+91 ${cleanPhone}):\nhttps://wa.me/91${cleanPhone}?text=${encodeURIComponent(text)}\n`;
                            })
                            .join('\n');
                          navigator.clipboard.writeText(linksText);
                          alert(`Copied ${validCustomers.length} personalized direct WhatsApp links to clipboard!`);
                        }}
                        title="Copy direct wa.me links for all selected recipients"
                      >
                        <Copy size={14} />
                        <span>Copy Direct Links</span>
                      </button>
                    </div>
                  </div>

                  {/* RIGHT: Real-Time Dynamic Live Preview */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #F9F7F2 0%, #F5F1E9 100%)',
                      border: '1.5px solid rgba(187, 165, 142, 0.35)',
                      borderRadius: '12px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Eye size={16} style={{ color: '#1B5E20' }} />
                          <span
                            style={{
                              fontSize: '12px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.6px',
                              fontWeight: 700,
                              color: '#1B5E20',
                            }}
                          >
                            Live Customer WhatsApp Preview
                          </span>
                        </div>

                        <span
                          style={{
                            fontSize: '11px',
                            background: '#E8F5E9',
                            color: '#1B5E20',
                            padding: '3px 8px',
                            borderRadius: '10px',
                            fontWeight: 700,
                          }}
                        >
                          Personalized
                        </span>
                      </div>

                      {/* Recipient Switcher */}
                      <div style={{ marginBottom: '14px' }}>
                        <label
                          style={{
                            display: 'block',
                            fontSize: '11px',
                            color: '#666666',
                            marginBottom: '4px',
                            fontWeight: 600,
                          }}
                        >
                          Previewing customized text for registered user:
                        </label>
                        {customers.filter((c) => c.phone).length > 0 ? (
                          <select
                            value={previewCustomerIndex}
                            onChange={(e) => setPreviewCustomerIndex(Number(e.target.value))}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              borderRadius: '6px',
                              background: '#FFFFFF',
                              border: '1px solid rgba(187, 165, 142, 0.4)',
                              fontSize: '12px',
                              fontWeight: 600,
                              color: '#121212',
                              outline: 'none',
                            }}
                          >
                            {customers
                              .filter((c) => c.phone)
                              .map((c, idx) => (
                                <option key={c.id || c.phone || idx} value={idx}>
                                  {c.name || 'Valued Patron'} — +91 {String(c.phone).slice(-10)} ({c.email || 'No email'})
                                </option>
                              ))}
                          </select>
                        ) : (
                          <div style={{ fontSize: '12px', color: '#888888', fontStyle: 'italic' }}>
                            (Sample patron shown below)
                          </div>
                        )}
                      </div>

                      {/* Realistic WhatsApp Chat Bubble */}
                      <div
                        style={{
                          background: '#EFEAE2',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid rgba(0,0,0,0.06)',
                          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)',
                        }}
                      >
                        {/* Chat header bar */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            paddingBottom: '10px',
                            marginBottom: '10px',
                            borderBottom: '1px solid rgba(0,0,0,0.08)',
                          }}
                        >
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: '#121212',
                              color: '#D4AF37',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '13px',
                              fontWeight: 800,
                            }}
                          >
                            NF
                          </div>
                          <div>
                            <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#111B21' }}>
                              NOOR-E-FLAMES Atelier
                            </div>
                            <div style={{ fontSize: '10.5px', color: '#25D366', fontWeight: 600 }}>
                              Official Business Account
                            </div>
                          </div>
                        </div>

                        {/* WhatsApp Message Bubble */}
                        <div
                          style={{
                            background: '#FFFFFF',
                            borderRadius: '8px',
                            borderTopLeftRadius: '2px',
                            padding: '12px 14px',
                            maxWidth: '100%',
                            boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
                            fontSize: '13px',
                            lineHeight: 1.55,
                            color: '#111B21',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                          }}
                        >
                          {getPersonalizedPreviewText(
                            bulkBroadcastMessage,
                            customers.filter((c) => c.phone)[previewCustomerIndex] || customers[0]
                          )}
                          <div
                            style={{
                              textAlign: 'right',
                              fontSize: '10px',
                              color: '#667781',
                              marginTop: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              gap: '4px',
                            }}
                          >
                            <span>Just now</span>
                            <span style={{ color: '#53BDEB' }}>✓✓</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: '16px',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: '#E8F5E9',
                        border: '1px solid #C8E6C9',
                        fontSize: '11.5px',
                        color: '#1B5E20',
                        lineHeight: 1.5,
                      }}
                    >
                      💡 <strong>Per-User Customization:</strong> Every patron in your database automatically receives their own customized message with their real name (e.g.{' '}
                      <em>{((customers.filter((c) => c.phone)[previewCustomerIndex] || customers[0])?.name || 'Aria Montgomery').split(' ')[0]}</em>)
                      instead of a generic blast.
                    </div>
                  </div>
                </div>

                {/* Audience Selection & Database Table Toolbar */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    background: '#F9F7F2',
                    border: '1px solid rgba(187, 165, 142, 0.3)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          const validIds = customers
                            .filter((c) => c.phone && String(c.phone).replace(/\D/g, '').slice(-10).length === 10)
                            .map((c) => c.id || c.phone || c.email);
                          setSelectedCustomerIds(validIds);
                        }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: '#121212',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <CheckSquare size={13} />
                        <span>Select All ({customers.filter((c) => c.phone).length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedCustomerIds([])}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: '#FFFFFF',
                          color: '#555555',
                          border: '1px solid rgba(187, 165, 142, 0.35)',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <Square size={13} />
                        <span>Deselect All</span>
                      </button>
                    </div>

                    <span style={{ fontSize: '12px', color: '#666666' }}>
                      Selected:{' '}
                      <strong style={{ color: '#1B5E20' }}>
                        {selectedCustomerIds.length} of {customers.filter((c) => c.phone).length}
                      </strong>{' '}
                      patrons with WhatsApp
                    </span>
                  </div>

                  {/* Search audience */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Search
                        size={14}
                        style={{
                          position: 'absolute',
                          left: '10px',
                          color: '#8A7258',
                        }}
                      />
                      <input
                        type="text"
                        value={bulkCustomerSearch}
                        onChange={(e) => setBulkCustomerSearch(e.target.value)}
                        placeholder="Search patron by name, phone, email..."
                        style={{
                          padding: '8px 12px 8px 30px',
                          borderRadius: '6px',
                          background: '#FFFFFF',
                          border: '1px solid rgba(187, 165, 142, 0.35)',
                          fontSize: '12px',
                          outline: 'none',
                          width: '240px',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid: Broadcaster + Automation Rules */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                {/* 1. Direct Messenger & Test Dispatch */}
                <div className="admin-editor-card" style={{ padding: '26px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid rgba(187, 165, 142, 0.2)' }}>
                    <Send size={18} style={{ color: '#8A7258' }} />
                    <h3 className="editor-card-title font-serif" style={{ margin: 0, border: 'none', padding: 0 }}>
                      Single Recipient Direct Dispatch
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', color: '#707070', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600 }}>
                        Customer Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ayesha Khan"
                        value={customWaName}
                        onChange={(e) => setCustomWaName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: '8px',
                          background: '#F9F7F2',
                          border: '1.5px solid rgba(187, 165, 142, 0.35)',
                          color: '#121212',
                          fontSize: '13.5px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', color: '#707070', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600 }}>
                        WhatsApp Number (+91 Mobile)
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 9876543210 or +919876543210"
                        value={customWaRecipient}
                        onChange={(e) => setCustomWaRecipient(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: '8px',
                          background: '#F9F7F2',
                          border: '1.5px solid rgba(187, 165, 142, 0.35)',
                          color: '#121212',
                          fontSize: '13.5px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', color: '#707070', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600 }}>
                        Message Preset / Template
                      </label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomWaTemplate('welcome');
                            setCustomWaMessage('✨ *Welcome to Nooreflames Atelier, {name}!* ✨\n\nYour account is now activated. Explore our signature handcrafted candles and luxury extrait de parfums.\n\nEnjoy *10% OFF* your first purchase with VIP Code: *WELCOME10*\n\nExplore catalog: https://nooreflames.vercel.app');
                          }}
                          style={{
                            flex: 1,
                            padding: '10px 14px',
                            fontSize: '12px',
                            fontWeight: 600,
                            borderRadius: '8px',
                            background: customWaTemplate === 'welcome' ? '#121212' : '#F9F7F2',
                            border: `1.5px solid ${customWaTemplate === 'welcome' ? '#121212' : 'rgba(187, 165, 142, 0.35)'}`,
                            color: customWaTemplate === 'welcome' ? '#FFFFFF' : '#555555',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          Welcome (10% Off)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomWaTemplate('offer');
                            setCustomWaMessage('🕯️ *Exclusive Atelier Invitation for {name}* 🕯️\n\nWe have just reserved our limited batch flacons for our VIP patrons. Enjoy *15% OFF* today with secret code: *VIP15*\n\nReserve now: https://nooreflames.vercel.app');
                          }}
                          style={{
                            flex: 1,
                            padding: '10px 14px',
                            fontSize: '12px',
                            fontWeight: 600,
                            borderRadius: '8px',
                            background: customWaTemplate === 'offer' ? '#121212' : '#F9F7F2',
                            border: `1.5px solid ${customWaTemplate === 'offer' ? '#121212' : 'rgba(187, 165, 142, 0.35)'}`,
                            color: customWaTemplate === 'offer' ? '#FFFFFF' : '#555555',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          Special VIP Offer (15% Off)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', color: '#707070', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600 }}>
                        Message Body (Supports {'{name}'} Personalization)
                      </label>
                      <textarea
                        rows={5}
                        value={customWaMessage}
                        onChange={(e) => setCustomWaMessage(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '8px',
                          background: '#F9F7F2',
                          border: '1.5px solid rgba(187, 165, 142, 0.35)',
                          color: '#121212',
                          fontSize: '13px',
                          lineHeight: 1.5,
                          resize: 'vertical',
                          outline: 'none',
                          boxSizing: 'border-box',
                          fontFamily: 'inherit',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                      <button
                        type="button"
                        className="btn-admin-primary"
                        disabled={whatsappStatus === 'sending' || !customWaRecipient.trim()}
                        onClick={() => handleSendWhatsApp(customWaRecipient, (customWaName || '').trim() || 'Valued Patron', 'custom', customWaMessage)}
                        style={{
                          flex: 1,
                        }}
                      >
                        <Send size={15} />
                        <span>{whatsappStatus === 'sending' ? 'Dispatching Message...' : 'Send via Open-WA'}</span>
                      </button>

                      {customWaRecipient.trim() ? (
                        <a
                          href={`https://wa.me/91${customWaRecipient.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(customWaMessage.replace(/[\{\[]\s*name\s*[\}\]]/gi, (customWaName || '').trim() || 'Valued Patron'))}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-admin-secondary"
                          title="Open WhatsApp Web chat directly"
                        >
                          <ExternalLink size={14} />
                          <span>Direct WA</span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="btn-admin-secondary"
                          title="Enter recipient phone to open direct chat"
                        >
                          <ExternalLink size={14} />
                          <span>Direct WA</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Automation Overview & Open-WA Specs */}
                <div className="admin-editor-card" style={{ padding: '26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid rgba(187, 165, 142, 0.2)' }}>
                      <Sparkles size={18} style={{ color: '#8A7258' }} />
                      <h3 className="editor-card-title font-serif" style={{ margin: 0, border: 'none', padding: 0 }}>
                        Active Automated Triggers
                      </h3>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ padding: '16px', borderRadius: '10px', background: '#F9F7F2', border: '1px solid rgba(187, 165, 142, 0.25)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#121212' }}>1. Customer Sign-Up Welcome</span>
                          <span style={{ fontSize: '10.5px', background: '#E8F5E9', border: '1px solid #C8E6C9', color: '#2E7D32', padding: '3px 9px', borderRadius: '12px', fontWeight: 700 }}>ACTIVE</span>
                        </div>
                        <p style={{ fontSize: '12.5px', color: '#555555', margin: 0, lineHeight: 1.5 }}>
                          Sends a personalized greeting to customer's WhatsApp upon account creation with their name and coupon code <strong>WELCOME10</strong>.
                        </p>
                      </div>

                      <div style={{ padding: '16px', borderRadius: '10px', background: '#F9F7F2', border: '1px solid rgba(187, 165, 142, 0.25)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#121212' }}>2. Order Confirmation & COD Tracker</span>
                          <span style={{ fontSize: '10.5px', background: '#E8F5E9', border: '1px solid #C8E6C9', color: '#2E7D32', padding: '3px 9px', borderRadius: '12px', fontWeight: 700 }}>ACTIVE</span>
                        </div>
                        <p style={{ fontSize: '12.5px', color: '#555555', margin: 0, lineHeight: 1.5 }}>
                          Dispatches automated order details, items summary, delivery address, and remaining COD balance directly to customer's WhatsApp upon checkout.
                        </p>
                      </div>

                      <div style={{ padding: '16px', borderRadius: '10px', background: '#F9F7F2', border: '1px solid rgba(187, 165, 142, 0.25)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#121212' }}>3. Shipment & Delivery Updates</span>
                          <span style={{ fontSize: '10.5px', background: '#E8F5E9', border: '1px solid #C8E6C9', color: '#2E7D32', padding: '3px 9px', borderRadius: '12px', fontWeight: 700 }}>ACTIVE</span>
                        </div>
                        <p style={{ fontSize: '12.5px', color: '#555555', margin: 0, lineHeight: 1.5 }}>
                          When you update an order status to Dispatched or Delivered in the Orders tab, an automatic status ping is triggered to the customer's WhatsApp.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Registered Customers Directory */}
              <div className="admin-editor-card" style={{ padding: '26px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid rgba(187, 165, 142, 0.2)', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={18} style={{ color: '#8A7258' }} />
                    <h3 className="editor-card-title font-serif" style={{ margin: 0, border: 'none', padding: 0 }}>
                      Registered Customers WhatsApp Directory
                    </h3>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12.5px', color: '#707070' }}>
                      Showing:{' '}
                      <strong style={{ color: '#121212' }}>
                        {
                          customers.filter((c) => {
                            if (!bulkCustomerSearch.trim()) return true;
                            const q = bulkCustomerSearch.toLowerCase();
                            return (
                              (c.name && c.name.toLowerCase().includes(q)) ||
                              (c.email && c.email.toLowerCase().includes(q)) ||
                              (c.phone && c.phone.includes(q))
                            );
                          }).length
                        }
                      </strong>{' '}
                      of <strong>{customers.length}</strong>
                    </span>
                  </div>
                </div>

                {customers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 20px', color: '#707070' }}>
                    <MessageSquare size={36} style={{ margin: '0 auto 12px auto', opacity: 0.35, color: '#8A7258' }} />
                    <p style={{ fontSize: '14.5px', fontWeight: 600, color: '#121212', marginBottom: '6px' }}>
                      No customer registrations with WhatsApp phone numbers recorded yet.
                    </p>
                    <p style={{ fontSize: '13px', color: '#707070', maxWidth: '440px', margin: '0 auto' }}>
                      When patrons register or place an order with their phone number, they will automatically appear here with quick dispatch actions.
                    </p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1.5px solid rgba(187, 165, 142, 0.35)', background: '#F9F7F2', textAlign: 'left', color: '#707070' }}>
                          <th style={{ padding: '12px 14px', width: '40px', textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              checked={
                                customers.filter((c) => c.phone && String(c.phone).replace(/\D/g, '').slice(-10).length === 10).length > 0 &&
                                customers
                                  .filter((c) => c.phone && String(c.phone).replace(/\D/g, '').slice(-10).length === 10)
                                  .every((c) => selectedCustomerIds.includes(c.id || c.phone || c.email))
                              }
                              onChange={(e) => {
                                const validIds = customers
                                  .filter((c) => c.phone && String(c.phone).replace(/\D/g, '').slice(-10).length === 10)
                                  .map((c) => c.id || c.phone || c.email);
                                if (e.target.checked) {
                                  setSelectedCustomerIds(validIds);
                                } else {
                                  setSelectedCustomerIds([]);
                                }
                              }}
                              style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#121212' }}
                              title="Toggle Select All with Phone"
                            />
                          </th>
                          <th style={{ padding: '12px 14px', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 700 }}>Customer</th>
                          <th style={{ padding: '12px 14px', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 700 }}>Email</th>
                          <th style={{ padding: '12px 14px', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 700 }}>WhatsApp Number</th>
                          <th style={{ padding: '12px 14px', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 700 }}>Registered</th>
                          <th style={{ padding: '12px 14px', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 700 }}>Customized Message Preview</th>
                          <th style={{ padding: '12px 14px', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 700 }}>Last Campaign</th>
                          <th style={{ padding: '12px 14px', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers
                          .filter((c) => {
                            if (!bulkCustomerSearch.trim()) return true;
                            const q = bulkCustomerSearch.toLowerCase();
                            return (
                              (c.name && c.name.toLowerCase().includes(q)) ||
                              (c.email && c.email.toLowerCase().includes(q)) ||
                              (c.phone && c.phone.includes(q))
                            );
                          })
                          .map((c) => {
                            const hasValidPhone = Boolean(c.phone && String(c.phone).replace(/\D/g, '').slice(-10).length === 10);
                            const isSelected = selectedCustomerIds.includes(c.id || c.phone || c.email);
                            const cleanPhone = String(c.phone || '').replace(/\D/g, '').slice(-10);
                            const customizedSnippet = getPersonalizedPreviewText(bulkBroadcastMessage, c);

                            return (
                              <tr
                                key={c.id || c.email || c.phone}
                                style={{
                                  borderBottom: '1px solid rgba(187, 165, 142, 0.18)',
                                  background: isSelected ? 'rgba(232, 245, 233, 0.25)' : 'transparent',
                                }}
                              >
                                <td style={{ padding: '14px', textAlign: 'center' }}>
                                  {hasValidPhone ? (
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={(e) => {
                                        const key = c.id || c.phone || c.email;
                                        if (e.target.checked) {
                                          setSelectedCustomerIds((prev) => [...prev, key]);
                                        } else {
                                          setSelectedCustomerIds((prev) => prev.filter((id) => id !== key));
                                        }
                                      }}
                                      style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#121212' }}
                                    />
                                  ) : (
                                    <span title="No valid phone" style={{ color: '#CCCCCC', fontSize: '12px' }}>—</span>
                                  )}
                                </td>
                                <td style={{ padding: '14px', fontWeight: 600, color: '#121212' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span>{c.name || 'Valued Patron'}</span>
                                    {c.welcomeSent && (
                                      <span
                                        style={{
                                          fontSize: '10px',
                                          background: '#E8F5E9',
                                          color: '#1B5E20',
                                          padding: '2px 6px',
                                          borderRadius: '8px',
                                          fontWeight: 700,
                                        }}
                                        title="Welcome message already sent"
                                      >
                                        VIP
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td style={{ padding: '14px', color: '#555555' }}>{c.email || '—'}</td>
                                <td style={{ padding: '14px' }}>
                                  {hasValidPhone ? (
                                    <span style={{ color: '#1B5E20', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                      <Phone size={13} />
                                      +91 {cleanPhone}
                                    </span>
                                  ) : (
                                    <span style={{ color: '#888888', fontSize: '12px' }}>Not provided</span>
                                  )}
                                </td>
                                <td style={{ padding: '14px', color: '#707070', fontSize: '12.5px' }}>
                                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recent'}
                                </td>
                                <td style={{ padding: '14px', maxWidth: '240px' }}>
                                  <span
                                    style={{
                                      fontSize: '12px',
                                      color: '#555555',
                                      display: 'inline-block',
                                      maxWidth: '220px',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      cursor: 'help',
                                    }}
                                    title={customizedSnippet}
                                  >
                                    {customizedSnippet.replace(/\n+/g, ' ')}
                                  </span>
                                </td>
                                <td style={{ padding: '14px', color: '#707070', fontSize: '12px' }}>
                                  {c.lastBroadcastAt ? (
                                    <span
                                      style={{
                                        fontSize: '11px',
                                        background: '#F0ECE4',
                                        padding: '3px 7px',
                                        borderRadius: '6px',
                                        color: '#5C4A3A',
                                        fontWeight: 600,
                                      }}
                                    >
                                      {new Date(c.lastBroadcastAt).toLocaleDateString()}
                                    </span>
                                  ) : (
                                    <span style={{ color: '#AAAAAA' }}>Not sent</span>
                                  )}
                                </td>
                                <td style={{ padding: '14px', textAlign: 'right' }}>
                                  {hasValidPhone ? (
                                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setCustomWaRecipient(cleanPhone);
                                          setCustomWaName(c.name || '');
                                          window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="btn-admin-secondary"
                                        style={{ padding: '6px 10px', fontSize: '11px' }}
                                        title="Load into single messenger"
                                      >
                                        Load
                                      </button>
                                      <a
                                        href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(customizedSnippet)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          padding: '6px 12px',
                                          fontSize: '11.5px',
                                          borderRadius: '6px',
                                          background: '#E8F5E9',
                                          border: '1px solid #C8E6C9',
                                          color: '#1B5E20',
                                          fontWeight: 600,
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          textDecoration: 'none',
                                        }}
                                        title="Open customized WhatsApp message directly in WhatsApp Web"
                                      >
                                        <ExternalLink size={12} />
                                        <span>Direct WA</span>
                                      </a>
                                    </div>
                                  ) : (
                                    <span style={{ color: '#888888', fontSize: '12px' }}>—</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* ========================================================================= */}
              {/* LIVE BROADCAST PROGRESS & RESULTS MODAL                                   */}
              {/* ========================================================================= */}
              {showBroadcastModal && (
                <div
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(18, 18, 18, 0.75)',
                    backdropFilter: 'blur(5px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                  }}
                >
                  <div
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      maxWidth: '680px',
                      width: '100%',
                      maxHeight: '90vh',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                      border: '1.5px solid rgba(187, 165, 142, 0.5)',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Modal Header */}
                    <div
                      style={{
                        padding: '22px 26px',
                        background: 'linear-gradient(135deg, #121212 0%, #2A241E 100%)',
                        color: '#FFFFFF',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: 'rgba(37, 211, 102, 0.15)',
                            border: '1px solid rgba(37, 211, 102, 0.35)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#25D366',
                          }}
                        >
                          <Send size={18} />
                        </div>
                        <div>
                          <h3
                            className="font-serif"
                            style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}
                          >
                            {broadcastProgress.status === 'running'
                              ? 'Broadcasting Personalized Messages...'
                              : broadcastProgress.status === 'completed'
                              ? '✓ Broadcast Campaign Completed!'
                              : 'Broadcast Paused / Cancelled'}
                          </h3>
                          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#BBBBBB' }}>
                            Dispatched from +91 92892 89800 to signed-up database patrons
                          </p>
                        </div>
                      </div>

                      {!isBroadcasting && (
                        <button
                          type="button"
                          onClick={() => setShowBroadcastModal(false)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            padding: '6px',
                            borderRadius: '6px',
                            display: 'flex',
                          }}
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>

                    {/* Progress Bar & Live Ticker */}
                    <div style={{ padding: '24px 26px', background: '#F9F7F2', borderBottom: '1px solid rgba(187, 165, 142, 0.25)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#121212' }}>
                          Progress: {broadcastProgress.current} of {broadcastProgress.total} Patrons
                        </span>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 800,
                            color: broadcastProgress.status === 'completed' ? '#1B5E20' : '#8A7258',
                          }}
                        >
                          {broadcastProgress.total > 0
                            ? Math.round((broadcastProgress.current / broadcastProgress.total) * 100)
                            : 0}
                          %
                        </span>
                      </div>

                      {/* Progress track */}
                      <div
                        style={{
                          width: '100%',
                          height: '10px',
                          borderRadius: '10px',
                          background: '#E0DDD5',
                          overflow: 'hidden',
                          marginBottom: '12px',
                        }}
                      >
                        <div
                          style={{
                            width: `${broadcastProgress.total > 0 ? (broadcastProgress.current / broadcastProgress.total) * 100 : 0}%`,
                            height: '100%',
                            background:
                              broadcastProgress.status === 'completed'
                                ? 'linear-gradient(90deg, #2E7D32, #25D366)'
                                : 'linear-gradient(90deg, #8A7258, #D4AF37)',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>

                      {isBroadcasting && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '12.5px',
                            color: '#1B5E20',
                            fontWeight: 600,
                          }}
                        >
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: '#25D366',
                              display: 'inline-block',
                            }}
                          />
                          <span>
                            Currently customizing & sending to:{' '}
                            <strong>{broadcastProgress.currentName}</strong> (+91 {broadcastProgress.currentPhone})
                          </span>
                        </div>
                      )}

                      {broadcastProgress.status === 'completed' && (
                        <div
                          style={{
                            fontSize: '13px',
                            color: '#1B5E20',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <CheckCircle2 size={16} />
                          <span>
                            All {broadcastProgress.total} personalized messages have been dispatched!
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Results Feed */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 26px', maxHeight: '340px' }}>
                      <div
                        style={{
                          fontSize: '11.5px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.6px',
                          color: '#707070',
                          fontWeight: 700,
                          marginBottom: '12px',
                        }}
                      >
                        Live Dispatch Feed ({broadcastProgress.results.length})
                      </div>

                      {broadcastProgress.results.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '30px 10px', color: '#888888', fontSize: '13px' }}>
                          Initializing campaign dispatch...
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {broadcastProgress.results.map((r, i) => (
                            <div
                              key={r.id || r.phone || i}
                              style={{
                                padding: '10px 14px',
                                borderRadius: '8px',
                                background: '#F9F7F2',
                                border: '1px solid rgba(187, 165, 142, 0.25)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '10px',
                                fontSize: '12.5px',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span
                                  style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    background: r.isLiveDelivered
                                      ? '#E8F5E9'
                                      : r.success
                                      ? '#FFF3E0'
                                      : '#FFEBEE',
                                    color: r.isLiveDelivered
                                      ? '#1B5E20'
                                      : r.success
                                      ? '#E65100'
                                      : '#C62828',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '11px',
                                    fontWeight: 800,
                                  }}
                                >
                                  {r.isLiveDelivered ? '✓' : r.success ? '!' : '×'}
                                </span>
                                <div>
                                  <strong style={{ color: '#121212' }}>{r.name}</strong>{' '}
                                  <span style={{ color: '#666666' }}>(+91 {r.phone})</span>
                                  <div style={{ fontSize: '11px', color: '#888888', marginTop: '1px' }}>
                                    {r.personalizedText?.slice(0, 50)}...
                                  </div>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span
                                  style={{
                                    padding: '3px 8px',
                                    borderRadius: '12px',
                                    fontSize: '10.5px',
                                    fontWeight: 700,
                                    background: r.isLiveDelivered ? '#E8F5E9' : '#FFF3E0',
                                    color: r.isLiveDelivered ? '#1B5E20' : '#E65100',
                                    border: `1px solid ${r.isLiveDelivered ? '#C8E6C9' : '#FFE0B2'}`,
                                  }}
                                >
                                  {r.isLiveDelivered ? 'Live Delivered' : 'Direct Link Ready'}
                                </span>
                                {r.directWaLink && (
                                  <a
                                    href={r.directWaLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      padding: '4px 8px',
                                      borderRadius: '4px',
                                      background: '#121212',
                                      color: '#FFFFFF',
                                      fontSize: '11px',
                                      textDecoration: 'none',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                    }}
                                  >
                                    <ExternalLink size={10} />
                                    <span>Chat</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Modal Footer */}
                    <div
                      style={{
                        padding: '16px 26px',
                        background: '#FFFFFF',
                        borderTop: '1px solid rgba(187, 165, 142, 0.25)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '12px', color: '#777777' }}>
                        {broadcastProgress.status === 'completed'
                          ? `Successfully processed ${broadcastProgress.total} patrons`
                          : isBroadcasting
                          ? 'Broadcast in progress...'
                          : 'Broadcast stopped'}
                      </span>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        {isBroadcasting ? (
                          <button
                            type="button"
                            onClick={() => {
                              broadcastAbortRef.current = true;
                            }}
                            style={{
                              padding: '9px 18px',
                              borderRadius: '8px',
                              background: '#D32F2F',
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Stop / Pause Broadcast
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowBroadcastModal(false)}
                            className="btn-admin-primary"
                          >
                            Done & Close
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 9. Role Specifier Tab - Usernames, Passwords, Role Tiers & Tab Access Authority */}
          {activeTab === 'roles' && canAccessTab('roles') && (
            <div className="tab-roles-specifier-view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Action and status notices */}
              {teamActionNotice && (
                <div
                  style={{
                    padding: '12px 18px',
                    borderRadius: '12px',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    background: teamActionNotice.type === 'success' ? '#F0FDF4' : '#FEF2F2',
                    color: teamActionNotice.type === 'success' ? '#166534' : '#991B1B',
                    border: `1.5px solid ${teamActionNotice.type === 'success' ? '#BBF7D0' : '#FECACA'}`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {teamActionNotice.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span>{teamActionNotice.message}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTeamActionNotice(null)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {permissionNotice && (
                <div
                  style={{
                    padding: '12px 18px',
                    borderRadius: '12px',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    background: permissionNotice.type === 'success' ? '#F0FDF4' : '#FEF2F2',
                    color: permissionNotice.type === 'success' ? '#166534' : '#991B1B',
                    border: `1.5px solid ${permissionNotice.type === 'success' ? '#BBF7D0' : '#FECACA'}`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {permissionNotice.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span>{permissionNotice.message}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPermissionNotice(null)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Master Header Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #1C1917 0%, #292524 60%, #1E1B4B 100%)',
                  borderRadius: '20px',
                  padding: '30px 32px',
                  color: '#FFFFFF',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.18)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    right: '-40px',
                    top: '-40px',
                    width: '240px',
                    height: '240px',
                    background: 'radial-gradient(circle, rgba(79, 70, 229, 0.25) 0%, rgba(0,0,0,0) 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 1 }}>
                  <div style={{ maxWidth: '640px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.12)', padding: '5px 12px', borderRadius: '30px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                      <ShieldCheck size={14} color="#818CF8" />
                      <span>Security & Role Access Gatekeeper</span>
                    </div>
                    <h2 className="font-serif" style={{ fontSize: '26px', margin: '0 0 10px 0', letterSpacing: '-0.02em', color: '#FDFBF7' }}>
                      Role Specifier — Staff Usernames, Passwords & Access Control
                    </h2>
                    <p style={{ margin: 0, fontSize: '14px', color: '#D6D3D1', lineHeight: 1.6 }}>
                      Specify custom <strong>@usernames</strong> and secret passwords for every staff member. Users must type their required credentials at login, and will strictly be granted access only to their permitted tabs. Role tab permissions and credentials are fully editable by the administrator.
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => setShowAddTeamModal(true)}
                        className="btn-admin-save"
                        style={{
                          background: '#4F46E5',
                          borderColor: '#4338CA',
                          padding: '10px 18px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '13px',
                          fontWeight: 700,
                          borderRadius: '10px',
                          boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
                        }}
                      >
                        <UserPlus size={16} />
                        <span>+ Add Staff Member</span>
                      </button>

                      {hasUnsavedPermissions && (
                        <button
                          type="button"
                          onClick={handleSaveRolePermissions}
                          disabled={isSavingPermissions}
                          className="btn-admin-save"
                          style={{
                            background: '#16A34A',
                            borderColor: '#15803D',
                            padding: '10px 18px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '13px',
                            fontWeight: 700,
                            borderRadius: '10px',
                            boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
                          }}
                        >
                          <Save size={16} />
                          <span>{isSavingPermissions ? 'Saving...' : 'Save Permissions'}</span>
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={handleResetRolePermissions}
                        disabled={isSavingPermissions}
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.16)',
                          color: '#E7E5E4',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '11.5px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <RefreshCw size={12} />
                        <span>Reset Role Defaults</span>
                      </button>
                      <button
                        type="button"
                        onClick={loadTeamMembers}
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.16)',
                          color: '#E7E5E4',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '11.5px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <RefreshCw size={12} />
                        <span>Refresh Roster</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Overview Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div className="admin-editor-card" style={{ padding: '20px 22px', margin: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A7258' }}>
                      Active Staff Roster
                    </span>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FAF8F5', border: '1px solid rgba(187,165,142,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8A7258' }}>
                      <Users size={16} />
                    </div>
                  </div>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#121212', lineHeight: 1.2 }}>
                    {teamMembers.length} Accounts
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
                    <span>{teamMembers.filter((m) => m.status !== 'suspended').length} Active, {teamMembers.filter((m) => m.status === 'suspended').length} Suspended</span>
                  </div>
                </div>

                <div className="admin-editor-card" style={{ padding: '20px 22px', margin: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4F46E5' }}>
                      Role Tiers Defined
                    </span>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EEF2FF', border: '1px solid #C7D2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5' }}>
                      <UserCog size={16} />
                    </div>
                  </div>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#121212', lineHeight: 1.2 }}>
                    5 Roles
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '6px' }}>
                    Admin, Editor, Content, Operations, Viewer
                  </div>
                </div>

                <div className="admin-editor-card" style={{ padding: '20px 22px', margin: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#16A34A' }}>
                      Admin Tabs Controlled
                    </span>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F0FDF4', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A' }}>
                      <Layers size={16} />
                    </div>
                  </div>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#121212', lineHeight: 1.2 }}>
                    {ALL_ADMIN_TABS.length} Tabs
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '6px' }}>
                    Strict server & client access enforcement
                  </div>
                </div>

                <div className="admin-editor-card" style={{ padding: '20px 22px', margin: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#DC2626' }}>
                      Credential Gate
                    </span>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEF2F2', border: '1px solid #FECACA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
                      <Lock size={16} />
                    </div>
                  </div>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#121212', lineHeight: 1.2 }}>
                    Neon DB & JWT
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '6px' }}>
                    Login with @username or email + password
                  </div>
                </div>
              </div>

              {/* Staff Usernames & Passwords Credential Authority Table */}
              <div className="admin-editor-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <h3 className="editor-card-title font-serif" style={{ margin: 0, fontSize: '18px' }}>
                      🔑 Staff Usernames & Passwords Directory
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6B7280' }}>
                      Every staff member can log in using either their assigned <strong>@username</strong> or email and assigned password. Click <strong>Edit Credentials</strong> to change usernames, passwords, or customize tab access.
                    </p>
                  </div>

                  {/* Search and Role Filter */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', minWidth: '220px' }}>
                      <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                      <input
                        type="text"
                        placeholder="Search name, @username, role..."
                        value={specifierSearch}
                        onChange={(e) => setSpecifierSearch(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px 8px 34px',
                          borderRadius: '8px',
                          border: '1.5px solid rgba(187, 165, 142, 0.35)',
                          background: '#FAF8F5',
                          fontSize: '12.5px',
                        }}
                      />
                    </div>

                    <select
                      value={specifierRoleFilter}
                      onChange={(e) => setSpecifierRoleFilter(e.target.value as any)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid rgba(187, 165, 142, 0.35)',
                        background: '#FAF8F5',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        color: '#121212',
                      }}
                    >
                      <option value="all">All Roles ({teamMembers.length})</option>
                      <option value="administrator">👑 Administrators</option>
                      <option value="editor">✏️ Editors</option>
                      <option value="content_manager">🎨 Content Managers</option>
                      <option value="operations">📦 Operations & Support</option>
                      <option value="viewer">👁️ Viewers</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setShowAddTeamModal(true)}
                      className="btn-admin-save"
                      style={{ padding: '8px 14px', fontSize: '12.5px' }}
                    >
                      <UserPlus size={14} />
                      <span>+ New Staff</span>
                    </button>
                  </div>
                </div>

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>STAFF MEMBER</th>
                        <th>ASSIGNED USERNAME</th>
                        <th>SECRET PASSWORD</th>
                        <th>ASSIGNED ROLE</th>
                        <th>PERMITTED TABS</th>
                        <th>STATUS</th>
                        <th style={{ textAlign: 'right' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamMembers
                        .filter((m) => {
                          const q = specifierSearch.toLowerCase().trim();
                          const matchesSearch =
                            !q ||
                            (m.name || '').toLowerCase().includes(q) ||
                            (m.username || '').toLowerCase().includes(q) ||
                            (m.email || '').toLowerCase().includes(q) ||
                            (m.phone || '').toLowerCase().includes(q) ||
                            (m.role || '').toLowerCase().includes(q);
                          const matchesRole = specifierRoleFilter === 'all' || m.role === specifierRoleFilter;
                          return matchesSearch && matchesRole;
                        })
                        .map((member) => {
                          const rDef = ROLE_DEFINITIONS[member.role] || ROLE_DEFINITIONS.administrator;
                          const isMasterAdmin = member.email === 'nooreflamesadmin@gmail.com' || member.id === 'team_super_admin';
                          const memberTabs = getAllowedTabsForRole(member.role, member.customAllowedTabs, rolePermissions);
                          const hasCustomTabs = Array.isArray(member.customAllowedTabs) && member.customAllowedTabs.length > 0;
                          const currentUsername = member.username || (member.email ? member.email.split('@')[0] : 'user');
                          const isPasswordRevealed = Boolean(revealedPasswords[member.id]);
                          const displayPassword = member.password || 'nooreflames';

                          return (
                            <tr key={member.id}>
                              {/* Member info */}
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <div
                                    style={{
                                      width: '38px',
                                      height: '38px',
                                      borderRadius: '50%',
                                      background: rDef.bgColor,
                                      border: `1.5px solid ${rDef.borderColor}`,
                                      color: rDef.color,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontWeight: 700,
                                      fontSize: '14px',
                                      flexShrink: 0,
                                    }}
                                  >
                                    {rDef.emoji}
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: 700, color: '#121212', fontSize: '13px' }}>{member.name}</div>
                                    <div style={{ fontSize: '11.5px', color: '#6B7280' }}>{member.email}</div>
                                  </div>
                                </div>
                              </td>

                              {/* Username */}
                              <td>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      padding: '4px 10px',
                                      borderRadius: '8px',
                                      background: '#EEF2FF',
                                      border: '1.5px solid #C7D2FE',
                                      color: '#4338CA',
                                      fontFamily: 'monospace',
                                      fontWeight: 700,
                                      fontSize: '12.5px',
                                    }}
                                  >
                                    @{currentUsername}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => copyCredText(currentUsername, `${member.id}-user`)}
                                    title="Copy username"
                                    style={{
                                      background: '#FAF8F5',
                                      border: '1px solid rgba(187, 165, 142, 0.4)',
                                      borderRadius: '6px',
                                      padding: '4px 7px',
                                      cursor: 'pointer',
                                      color: '#8A7258',
                                      fontSize: '11px',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '3px',
                                    }}
                                  >
                                    {copiedCredId === `${member.id}-user` ? <Check size={12} color="#166534" /> : <Copy size={12} />}
                                    <span style={{ fontSize: '10.5px' }}>{copiedCredId === `${member.id}-user` ? 'Copied' : 'Copy'}</span>
                                  </button>
                                </div>
                              </td>

                              {/* Password */}
                              <td>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                  <span
                                    style={{
                                      fontFamily: 'monospace',
                                      fontSize: '12.5px',
                                      fontWeight: 600,
                                      padding: '4px 8px',
                                      borderRadius: '6px',
                                      background: isPasswordRevealed ? '#FEF3C7' : '#F3F4F6',
                                      color: isPasswordRevealed ? '#92400E' : '#4B5563',
                                      border: `1px solid ${isPasswordRevealed ? '#FDE68A' : '#E5E7EB'}`,
                                      minWidth: '95px',
                                      display: 'inline-block',
                                    }}
                                  >
                                    {isPasswordRevealed ? displayPassword : '••••••••••••'}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => togglePasswordReveal(member.id)}
                                    title={isPasswordRevealed ? 'Hide Password' : 'Show Password'}
                                    style={{
                                      background: '#FAF8F5',
                                      border: '1px solid rgba(187, 165, 142, 0.4)',
                                      borderRadius: '6px',
                                      padding: '4px 6px',
                                      cursor: 'pointer',
                                      color: '#8A7258',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    {isPasswordRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => copyCredText(displayPassword, `${member.id}-pass`)}
                                    title="Copy Password"
                                    style={{
                                      background: '#FAF8F5',
                                      border: '1px solid rgba(187, 165, 142, 0.4)',
                                      borderRadius: '6px',
                                      padding: '4px 7px',
                                      cursor: 'pointer',
                                      color: '#8A7258',
                                      fontSize: '11px',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '3px',
                                    }}
                                  >
                                    {copiedCredId === `${member.id}-pass` ? <Check size={12} color="#166534" /> : <Copy size={12} />}
                                    <span style={{ fontSize: '10.5px' }}>{copiedCredId === `${member.id}-pass` ? 'Copied' : 'Copy'}</span>
                                  </button>
                                </div>
                              </td>

                              {/* Role Tier */}
                              <td>
                                {isMasterAdmin ? (
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '5px',
                                      padding: '4px 10px',
                                      borderRadius: '12px',
                                      background: rDef.bgColor,
                                      color: rDef.color,
                                      border: `1px solid ${rDef.borderColor}`,
                                      fontSize: '11.5px',
                                      fontWeight: 700,
                                    }}
                                  >
                                    👑 Master Administrator
                                  </span>
                                ) : (
                                  <select
                                    value={member.role}
                                    onChange={(e) => handleQuickRoleChange(member, e.target.value as AdminRole)}
                                    style={{
                                      padding: '5px 8px',
                                      borderRadius: '8px',
                                      border: `1.5px solid ${rDef.borderColor}`,
                                      background: rDef.bgColor,
                                      color: rDef.color,
                                      fontSize: '12px',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      outline: 'none',
                                    }}
                                  >
                                    <option value="administrator">👑 Administrator (All Tabs)</option>
                                    <option value="editor">✏️ Editor ({getAllowedTabsForRole('editor', undefined, rolePermissions).length} Tabs)</option>
                                    <option value="content_manager">🎨 Content Manager ({getAllowedTabsForRole('content_manager', undefined, rolePermissions).length} Tabs)</option>
                                    <option value="operations">📦 Operations & Support ({getAllowedTabsForRole('operations', undefined, rolePermissions).length} Tabs)</option>
                                    <option value="viewer">👁️ Viewer ({getAllowedTabsForRole('viewer', undefined, rolePermissions).length} Tabs)</option>
                                  </select>
                                )}
                              </td>

                              {/* Permitted Tabs */}
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  {hasCustomTabs && (
                                    <span
                                      style={{
                                        fontSize: '10px',
                                        fontWeight: 700,
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        background: '#FEF3C7',
                                        color: '#B45309',
                                        border: '1px solid #FDE68A',
                                        width: 'fit-content',
                                      }}
                                    >
                                      ⭐ Custom Override ({memberTabs.length} Tabs)
                                    </span>
                                  )}
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', maxWidth: '280px' }}>
                                    {memberTabs.map((t) => (
                                      <span
                                        key={t}
                                        style={{
                                          fontSize: '10px',
                                          fontWeight: 600,
                                          padding: '2px 6px',
                                          borderRadius: '6px',
                                          background: '#FAF8F5',
                                          border: '1px solid #E5E7EB',
                                          color: '#374151',
                                          textTransform: 'capitalize',
                                        }}
                                      >
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </td>

                              {/* Status */}
                              <td>
                                <span
                                  style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    padding: '3px 8px',
                                    borderRadius: '12px',
                                    background: member.status === 'suspended' ? '#FEF2F2' : '#DCFCE7',
                                    color: member.status === 'suspended' ? '#991B1B' : '#166534',
                                    border: `1px solid ${member.status === 'suspended' ? '#FECACA' : '#86EFAC'}`,
                                  }}
                                >
                                  {(member.status || 'ACTIVE').toUpperCase()}
                                </span>
                              </td>

                              {/* Actions */}
                              <td style={{ textAlign: 'right' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditCredModal(member)}
                                    className="btn-admin-save"
                                    style={{
                                      padding: '5px 10px',
                                      fontSize: '11.5px',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                    }}
                                    title="Edit username, password, role & permitted tabs"
                                  >
                                    <Key size={13} />
                                    <span>Edit Creds</span>
                                  </button>

                                  {!isMasterAdmin && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => handleOpenMemberTabsModal(member)}
                                        style={{
                                          background: '#FAF8F5',
                                          border: '1px solid rgba(187, 165, 142, 0.4)',
                                          color: '#8A7258',
                                          cursor: 'pointer',
                                          padding: '5px 8px',
                                          borderRadius: '6px',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          fontSize: '11.5px',
                                          fontWeight: 600,
                                        }}
                                        title="Configure custom tab overrides"
                                      >
                                        <Sliders size={13} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteTeamMember(member)}
                                        style={{
                                          background: 'none',
                                          border: 'none',
                                          color: '#EF4444',
                                          cursor: 'pointer',
                                          padding: '5px 6px',
                                          borderRadius: '6px',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                        }}
                                        title="Remove staff member"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </>
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

              {/* Master Role Access & Tab Permissions Matrix Table */}
              <div className="admin-editor-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 className="editor-card-title font-serif" style={{ margin: 0, fontSize: '18px' }}>
                      🛡️ Master Role Access & Tab Permissions Matrix
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6B7280' }}>
                      Click on any cell below to grant or revoke tab access for an entire role tier. When staff log in, their admin panel instantly reflects these allowed tabs.
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={handleResetRolePermissions}
                      disabled={isSavingPermissions}
                      className="btn-admin-secondary"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      Reset Defaults
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveRolePermissions}
                      disabled={isSavingPermissions || !hasUnsavedPermissions}
                      className="btn-admin-save"
                      style={{ padding: '6px 14px', fontSize: '12px' }}
                    >
                      {isSavingPermissions ? 'Saving...' : hasUnsavedPermissions ? 'Save Permissions Matrix' : '✓ Matrix Saved'}
                    </button>
                  </div>
                </div>

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ minWidth: '180px' }}>STAFF ROLE</th>
                        {ALL_ADMIN_TABS.map((tab) => (
                          <th key={tab.id} style={{ textAlign: 'center', minWidth: '85px', fontSize: '11px', padding: '10px 6px' }}>
                            {tab.label}
                          </th>
                        ))}
                        <th style={{ textAlign: 'center', minWidth: '100px' }}>TOTAL TABS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(Object.keys(ROLE_DEFINITIONS) as AdminRole[]).map((rKey) => {
                        const rDef = ROLE_DEFINITIONS[rKey];
                        const isMasterAdminRole = rKey === 'administrator';
                        const rTabs = rolePermissions[rKey] || DEFAULT_ROLE_PERMISSIONS[rKey] || [];

                        return (
                          <tr key={rKey}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '16px' }}>{rDef.emoji}</span>
                                <div>
                                  <div style={{ fontWeight: 700, color: '#121212', fontSize: '12.5px' }}>{rDef.name}</div>
                                  <div style={{ fontSize: '11px', color: '#6B7280' }}>{rDef.description}</div>
                                </div>
                              </div>
                            </td>

                            {ALL_ADMIN_TABS.map((tab) => {
                              if (isMasterAdminRole) {
                                return (
                                  <td key={tab.id} style={{ textAlign: 'center', padding: '10px 6px' }}>
                                    <span
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        background: '#F0FDF4',
                                        color: '#166534',
                                        border: '1px solid #BBF7D0',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                      }}
                                      title="Master Administrator has permanent access to all tabs"
                                    >
                                      <CheckCircle2 size={12} color="#166534" />
                                      <span>Always</span>
                                    </span>
                                  </td>
                                );
                              }

                              const isAllowed = rTabs.includes(tab.id);

                              return (
                                <td key={tab.id} style={{ textAlign: 'center', padding: '10px 6px' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleRoleTab(rKey, tab.id)}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '5px',
                                      padding: '5px 10px',
                                      borderRadius: '6px',
                                      border: isAllowed ? '1.5px solid #86EFAC' : '1.5px solid #E5E7EB',
                                      background: isAllowed ? '#F0FDF4' : '#FFFFFF',
                                      color: isAllowed ? '#166534' : '#9CA3AF',
                                      fontWeight: 700,
                                      fontSize: '11.5px',
                                      cursor: 'pointer',
                                      transition: 'all 0.15s ease',
                                      boxShadow: isAllowed ? '0 1px 3px rgba(22, 101, 52, 0.08)' : 'none',
                                    }}
                                    title={`Click to ${isAllowed ? 'revoke' : 'grant'} ${tab.label} access for ${rDef.name}`}
                                  >
                                    {isAllowed ? (
                                      <>
                                        <CheckCircle2 size={12} color="#166534" />
                                        <span>Active</span>
                                      </>
                                    ) : (
                                      <>
                                        <span style={{ fontSize: '11px', fontWeight: 800 }}>✕</span>
                                        <span>Off</span>
                                      </>
                                    )}
                                  </button>
                                </td>
                              );
                            })}

                            <td style={{ textAlign: 'center', padding: '12px 14px' }}>
                              <span
                                style={{
                                  fontSize: '11.5px',
                                  fontWeight: 700,
                                  padding: '3px 10px',
                                  borderRadius: '12px',
                                  background: rDef.bgColor,
                                  color: rDef.color,
                                  border: `1px solid ${rDef.borderColor}`,
                                  display: 'inline-block',
                                }}
                              >
                                {rTabs.length} / {ALL_ADMIN_TABS.length} Tabs
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Access Restricted View if activeTab is not permitted for current role */}
          {!canAccessTab(activeTab) && (
            <div style={{ textAlign: 'center', padding: '60px 24px', background: '#FFFFFF', borderRadius: '16px', border: '1.5px solid rgba(187, 165, 142, 0.35)', maxWidth: '580px', margin: '40px auto', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#FEF2F2', border: '1.5px solid #FECACA', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#991B1B' }}>
                <Shield size={28} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '20px', color: '#121212', margin: '0 0 8px 0' }}>
                Access Restricted for {ROLE_DEFINITIONS[activeRole]?.name || 'Current Role'}
              </h3>
              <p style={{ fontSize: '13.5px', color: '#6B7280', margin: '0 0 20px 0', lineHeight: 1.6 }}>
                Your assigned staff role does not have permission to view the <strong>{ALL_ADMIN_TABS.find((t) => t.id === activeTab)?.label || activeTab}</strong> tab.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                {allowedTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className="btn-admin-save"
                    style={{ fontSize: '12px', padding: '8px 14px' }}
                  >
                    Go to {ALL_ADMIN_TABS.find((t) => t.id === tab)?.label || tab}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 3. Mobile Luxury Native App Bottom Navigation Bar (Fixed to viewport bottom) */}
      <nav className="admin-mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
        {canAccessTab('dashboard') && (
          <button
            type="button"
            className={`admin-bottom-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            aria-label="Dashboard"
          >
            <div className="tab-icon-wrap">
              <LayoutDashboard size={20} />
            </div>
            <span className="tab-label">Dashboard</span>
          </button>
        )}

        {canAccessTab('users') && (
          <button
            type="button"
            className={`admin-bottom-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('users');
              loadCustomers();
            }}
            aria-label="Users"
          >
            <div className="tab-icon-wrap">
              <Users size={20} />
              {customers.length > 0 && (
                <span className="tab-icon-badge highlight">{customers.length}</span>
              )}
            </div>
            <span className="tab-label">Users</span>
          </button>
        )}

        {canAccessTab('products') && (
          <button
            type="button"
            className={`admin-bottom-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
            aria-label="Products"
          >
            <div className="tab-icon-wrap">
              <Package size={20} />
              {totalSkusCount > 0 && (
                <span className="tab-icon-badge">{totalSkusCount}</span>
              )}
            </div>
            <span className="tab-label">Products</span>
          </button>
        )}

        {canAccessTab('orders') && (
          <button
            type="button"
            className={`admin-bottom-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
            aria-label="Orders"
          >
            <div className="tab-icon-wrap">
              <Truck size={20} />
              {orders.length > 0 && (
                <span className="tab-icon-badge highlight">{orders.length}</span>
              )}
            </div>
            <span className="tab-label">Orders</span>
          </button>
        )}

        {canAccessTab('whatsapp') && (
          <button
            type="button"
            className={`admin-bottom-tab ${activeTab === 'whatsapp' ? 'active' : ''}`}
            onClick={() => setActiveTab('whatsapp')}
            aria-label="WhatsApp"
          >
            <div className="tab-icon-wrap">
              <MessageSquare size={20} />
              {customers.length > 0 && (
                <span className="tab-icon-badge" style={{ background: '#25D366', color: '#000' }}>{customers.length}</span>
              )}
            </div>
            <span className="tab-label">WhatsApp</span>
          </button>
        )}

        {canAccessTab('banners') && (
          <button
            type="button"
            className={`admin-bottom-tab ${activeTab === 'banners' ? 'active' : ''}`}
            onClick={() => setActiveTab('banners')}
            aria-label="Banners"
          >
            <div className="tab-icon-wrap">
              <ImageIcon size={20} />
            </div>
            <span className="tab-label">Banners</span>
          </button>
        )}

        {canAccessTab('offers') && (
          <button
            type="button"
            className={`admin-bottom-tab ${activeTab === 'offers' ? 'active' : ''}`}
            onClick={() => setActiveTab('offers')}
            aria-label="Offers"
          >
            <div className="tab-icon-wrap">
              <Tag size={20} />
            </div>
            <span className="tab-label">Offers</span>
          </button>
        )}

        {canAccessTab('sync') && (
          <button
            type="button"
            className={`admin-bottom-tab ${activeTab === 'sync' ? 'active' : ''}`}
            onClick={() => setActiveTab('sync')}
            aria-label="Deploy"
          >
            <div className="tab-icon-wrap">
              <Rocket size={20} />
            </div>
            <span className="tab-label">Deploy</span>
          </button>
        )}

        {canAccessTab('roles') && (
          <button
            type="button"
            className={`admin-bottom-tab ${activeTab === 'roles' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('roles');
              loadTeamMembers();
            }}
            aria-label="Role Specifier"
          >
            <div className="tab-icon-wrap">
              <ShieldCheck size={20} />
            </div>
            <span className="tab-label">Roles</span>
          </button>
        )}
      </nav>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="admin-modal-backdrop" onClick={() => setEditingProduct(null)}>
          <div className="admin-modal-card admin-modal-wide" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
            {/* Top Right Close / Cut Button */}
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#FAF8F5',
                border: '1px solid rgba(18, 18, 18, 0.12)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#707070',
                transition: 'all 0.2s ease',
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#121212';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FAF8F5';
                e.currentTarget.style.color = '#707070';
              }}
              title="Close modal"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingRight: '48px', flexWrap: 'wrap' }}>
              <h3 className="modal-title font-serif" style={{ margin: 0, paddingBottom: 0, borderBottom: 'none' }}>
                {isNewProduct ? 'Add New Product / SKU' : `Edit: ${editingProduct.title || 'Product'}`}
              </h3>
              {editingProduct.badge && (
                <span style={{ fontSize: '10px', background: '#121212', color: '#FAF8F5', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                  {editingProduct.badge}
                </span>
              )}
            </div>

            {/* Sub-tab Navigation: All in Front (2-col grid on mobile, wrapped chips on desktop) */}
            <div className="modal-subtabs-nav">
              <button
                type="button"
                className={`modal-subtab-btn ${activeModalTab === 'basics' ? 'active' : ''}`}
                onClick={() => setActiveModalTab('basics')}
              >
                <Tag size={13} />
                <span className="subtab-label">1. Basics & Pricing</span>
              </button>
              <button
                type="button"
                className={`modal-subtab-btn ${activeModalTab === 'variants' ? 'active' : ''}`}
                onClick={() => setActiveModalTab('variants')}
              >
                <Sliders size={13} />
                <span className="subtab-label">2. Editions & Vol</span>
                {(editingProduct.variants || []).length > 0 && (
                  <span className="subtab-badge">{(editingProduct.variants || []).length}</span>
                )}
              </button>
              <button
                type="button"
                className={`modal-subtab-btn ${activeModalTab === 'media' ? 'active' : ''}`}
                onClick={() => setActiveModalTab('media')}
              >
                <ImageIcon size={13} />
                <span className="subtab-label">3. Images & Media</span>
                {(editingProduct.gallery?.length || 0) > 0 && (
                  <span className="subtab-badge">{editingProduct.gallery?.length || 0}</span>
                )}
              </button>
              <button
                type="button"
                className={`modal-subtab-btn ${activeModalTab === 'story' ? 'active' : ''}`}
                onClick={() => setActiveModalTab('story')}
              >
                <FileText size={13} />
                <span className="subtab-label">4. Story & Ritual</span>
              </button>
              <button
                type="button"
                className={`modal-subtab-btn ${activeModalTab === 'notes' ? 'active' : ''}`}
                onClick={() => setActiveModalTab('notes')}
              >
                <Sparkles size={13} />
                <span className="subtab-label">5. Scent & Notes</span>
              </button>
              <button
                type="button"
                className={`modal-subtab-btn ${activeModalTab === 'specs' ? 'active' : ''}`}
                onClick={() => setActiveModalTab('specs')}
              >
                <Package size={13} />
                <span className="subtab-label">6. Specs & Stock</span>
              </button>
              <button
                type="button"
                className={`modal-subtab-btn ${activeModalTab === 'seo' ? 'active' : ''}`}
                onClick={() => setActiveModalTab('seo')}
              >
                <Search size={13} />
                <span className="subtab-label">7. SEO, Slug & Meta</span>
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="modal-scroll-body">
              {/* TAB 1: BASICS & PRICING */}
              {activeModalTab === 'basics' && (
                <>
                  <div className="form-group-row">
                    <div className="form-field">
                      <label>SKU Code</label>
                      <input
                        type="text"
                        value={editingProduct.sku}
                        onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                        placeholder="e.g. NF-CAN-001"
                      />
                    </div>
                    <div className="form-field">
                      <label>Category</label>
                      <select
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      >
                        <option value="candles">Candles & Aromatics</option>
                        <option value="ocean-fresh">Oceanic & Fresh Eau de Parfum</option>
                        <option value="floral-rose">Floral & Rose Haute</option>
                        <option value="royal-oud">Royal Oud & Rare Woods</option>
                        <option value="discovery-sets">Discovery Sets & Vaults</option>
                        <option value="gift-shop">Curated Gift Boxes</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Product Title</label>
                    <input
                      type="text"
                      value={editingProduct.title}
                      onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                      placeholder="e.g. Whispered Surprises Secret Message Candle"
                    />
                  </div>

                  <div className="form-field">
                    <label>Subtitle / Scent Headline</label>
                    <input
                      type="text"
                      value={editingProduct.subtitle || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                      placeholder="e.g. Hand-Poured Soy Wax · Hidden Love Note Melts into View"
                    />
                  </div>

                  <div className="form-group-row">
                    <div className="form-field">
                      <label>Selling Price (₹) — Base / Primary Edition</label>
                      <input
                        type="number"
                        value={editingProduct.price ?? ''}
                        placeholder="e.g. 999"
                        onChange={(e) => {
                          const valStr = e.target.value;
                          const numVal = valStr === '' ? 0 : Number(valStr);
                          const updatedVariants = editingProduct.variants ? [...editingProduct.variants] : [];
                          if (updatedVariants.length > 0) {
                            updatedVariants[0] = { ...updatedVariants[0], price: numVal };
                          }
                          setEditingProduct({
                            ...editingProduct,
                            price: valStr === '' ? ('' as any) : numVal,
                            variants: updatedVariants,
                          });
                        }}
                      />
                      <span className="form-field-hint" style={{ fontSize: '11px', color: '#8A7258', marginTop: '2px' }}>
                        Syncs automatically with the live Primary Edition.
                      </span>
                    </div>
                    <div className="form-field">
                      <label>Original MRP (₹)</label>
                      <input
                        type="number"
                        value={editingProduct.originalPrice ?? ''}
                        placeholder="e.g. 1599"
                        onChange={(e) => {
                          const valStr = e.target.value;
                          const numVal = valStr === '' ? undefined : Number(valStr);
                          const updatedVariants = editingProduct.variants ? [...editingProduct.variants] : [];
                          if (updatedVariants.length > 0) {
                            updatedVariants[0] = { ...updatedVariants[0], originalPrice: numVal };
                          }
                          setEditingProduct({
                            ...editingProduct,
                            originalPrice: numVal,
                            variants: updatedVariants,
                          });
                        }}
                      />
                      <span className="form-field-hint" style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                        Optional strikethrough comparison price.
                      </span>
                    </div>
                  </div>

                  {/* Quick Preview & Link to Editions / Volumes */}
                  <div
                    className="admin-variants-preview-box"
                    onClick={() => setActiveModalTab('variants')}
                    title="Click to customize edition variants & prices"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#8E7051', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sliders size={13} />
                        Select Edition / Volume ({(editingProduct.variants || []).length} Options Configured)
                      </span>
                      <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#121212', textDecoration: 'underline' }}>
                        Manage Editions & Prices →
                      </span>
                    </div>
                    <div className="admin-variant-chips">
                      {(editingProduct.variants || []).map((v, i) => (
                        <span key={i} className="admin-variant-chip">
                          <strong>{v.name}</strong> · ₹{v.price} {v.originalPrice ? <span style={{ color: '#888', textDecoration: 'line-through', marginLeft: '4px' }}>₹{v.originalPrice}</span> : null}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="form-group-row">
                    <div className="form-field">
                      <label>Badge Tag (Optional)</label>
                      <input
                        type="text"
                        value={editingProduct.badge || ''}
                        placeholder="e.g. BESTSELLER, SECRET MESSAGE, LIMITED EDITION"
                        onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                      />
                    </div>
                    <div className="form-field">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label style={{ margin: 0 }}>URL Slug / Shortlink</label>
                        <button
                          type="button"
                          onClick={() => {
                            if (editingProduct.title) {
                              const autoSlug = editingProduct.title
                                .toLowerCase()
                                .trim()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/^-+|-+$/g, '');
                              setEditingProduct({ ...editingProduct, slug: autoSlug });
                            }
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#8E7051',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                        >
                          ⚡ Auto-Generate from Title
                        </button>
                      </div>
                      <input
                        type="text"
                        value={editingProduct.slug || ''}
                        placeholder="e.g. whispered-surprises"
                        onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                      />
                      <span className="form-field-hint" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                        <span>Path: <strong>/product/{editingProduct.slug || editingProduct.id}</strong></span>
                        <button
                          type="button"
                          onClick={() => setActiveModalTab('seo')}
                          style={{ background: 'none', border: 'none', color: '#121212', textDecoration: 'underline', fontSize: '11px', cursor: 'pointer' }}
                        >
                          Full SEO & Meta Settings →
                        </button>
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: EDITIONS & VOLUME VARIANTS */}
              {activeModalTab === 'variants' && (
                <>
                  <div className="modal-section-title">
                    <Sliders size={15} />
                    <span>Select Edition / Volume Variants (Live Product Page)</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '-6px', marginBottom: '14px' }}>
                    These edition choices appear as clickable cards under <strong>"SELECT EDITION / VOLUME"</strong> on the product detail page. Customers can pick an edition/gift set, and the price dynamically updates for cart checkout.
                  </p>

                  {/* Preset quick actions */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      style={{
                        background: '#F9F7F2',
                        border: '1px solid rgba(187, 165, 142, 0.4)',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        color: '#555',
                      }}
                      onClick={() => {
                        setEditingProduct({
                          ...editingProduct,
                          variants: [
                            { name: 'Standard Jar (300g)', price: editingProduct.price, originalPrice: editingProduct.originalPrice },
                            { name: 'Luxe Arch Gift Set', price: editingProduct.price + 399, originalPrice: editingProduct.originalPrice ? editingProduct.originalPrice + 499 : undefined },
                          ],
                        });
                      }}
                    >
                      + Load Candle Presets (300g Jar & Luxe Gift Set)
                    </button>
                    <button
                      type="button"
                      style={{
                        background: '#F9F7F2',
                        border: '1px solid rgba(187, 165, 142, 0.4)',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        color: '#555',
                      }}
                      onClick={() => {
                        setEditingProduct({
                          ...editingProduct,
                          variants: [
                            { name: '50ml Eau de Parfum Flacon', price: editingProduct.price, originalPrice: editingProduct.originalPrice },
                            { name: '100ml Grand Flacon', price: editingProduct.price + 699, originalPrice: editingProduct.originalPrice ? editingProduct.originalPrice + 899 : undefined },
                            { name: '10ml Pocket Flacon', price: 699 },
                          ],
                        });
                      }}
                    >
                      + Load Perfume Presets (50ml, 100ml, 10ml)
                    </button>
                  </div>

                  {/* Variant cards list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    {(editingProduct.variants || []).map((variant, idx) => (
                      <div key={idx} className="admin-variant-card">
                        <div className="form-field">
                          <label>Edition / Volume Title</label>
                          <input
                            type="text"
                            value={variant.name}
                            placeholder="e.g. Standard Jar (300g) or Luxe Arch Gift Set"
                            onChange={(e) => {
                              const updated = [...(editingProduct.variants || [])];
                              updated[idx] = { ...updated[idx], name: e.target.value };
                              setEditingProduct({ ...editingProduct, variants: updated });
                            }}
                          />
                        </div>

                        <div className="form-field">
                          <label>Selling Price (₹)</label>
                          <input
                            type="number"
                            value={variant.price ?? ''}
                            placeholder="e.g. 899"
                            onChange={(e) => {
                              const valStr = e.target.value;
                              const numVal = valStr === '' ? 0 : Number(valStr);
                              const updated = [...(editingProduct.variants || [])];
                              updated[idx] = { ...updated[idx], price: numVal };
                              setEditingProduct({
                                ...editingProduct,
                                price: idx === 0 ? numVal : editingProduct.price,
                                variants: updated,
                              });
                            }}
                          />
                        </div>

                        <div className="form-field">
                          <label>Original MRP (₹)</label>
                          <input
                            type="number"
                            value={variant.originalPrice ?? ''}
                            placeholder="e.g. 1599"
                            onChange={(e) => {
                              const valStr = e.target.value;
                              const numVal = valStr === '' ? undefined : Number(valStr);
                              const updated = [...(editingProduct.variants || [])];
                              updated[idx] = {
                                ...updated[idx],
                                originalPrice: numVal,
                              };
                              setEditingProduct({
                                ...editingProduct,
                                originalPrice: idx === 0 ? numVal : editingProduct.originalPrice,
                                variants: updated,
                              });
                            }}
                          />
                        </div>

                        <button
                          type="button"
                          className="btn-remove-variant"
                          title="Delete this edition variant"
                          onClick={() => {
                            const updated = [...(editingProduct.variants || [])];
                            updated.splice(idx, 1);
                            setEditingProduct({ ...editingProduct, variants: updated });
                          }}
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add variant button */}
                  <button
                    type="button"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#121212',
                      color: '#FFFFFF',
                      padding: '9px 18px',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: 'none',
                    }}
                    onClick={() => {
                      const current = editingProduct.variants || [];
                      setEditingProduct({
                        ...editingProduct,
                        variants: [
                          ...current,
                          {
                            name: `Edition ${current.length + 1}`,
                            price: editingProduct.price,
                            originalPrice: editingProduct.originalPrice,
                          },
                        ],
                      });
                    }}
                  >
                    <Plus size={15} />
                    <span>Add New Edition / Volume Option</span>
                  </button>
                </>
              )}

              {/* TAB 2: IMAGES & GALLERY */}
              {activeModalTab === 'media' && (
                <>
                  <div className="modal-section-title">
                    <ImageIcon size={15} />
                    <span>Primary Showcase Image</span>
                  </div>

                  <div className="admin-upload-preview-card">
                    <img
                      src={editingProduct.image || '/images/products/placeholder.jpg'}
                      alt="Primary Preview"
                      className="admin-upload-thumb"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <div className="admin-upload-actions">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <label className="btn-upload-file">
                          <Upload size={14} />
                          <span>{uploadingMainImage ? 'Uploading Image...' : 'Upload Image from Computer'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingMainImage}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setUploadingMainImage(true);
                              try {
                                const url = await handleUploadImage(file);
                                if (url) {
                                  setEditingProduct({ ...editingProduct, image: url });
                                }
                              } finally {
                                setUploadingMainImage(false);
                              }
                            }}
                          />
                        </label>
                        {uploadingMainImage && (
                          <span style={{ fontSize: '12px', color: '#8E7051', fontWeight: 600 }}>Saving file to server...</span>
                        )}
                      </div>

                      <div className="form-field" style={{ margin: 0 }}>
                        <label style={{ fontSize: '11px', color: '#666' }}>Or Paste Image URL / Public Path</label>
                        <input
                          type="text"
                          value={editingProduct.image || ''}
                          placeholder="/images/products/my-photo.jpg or https://..."
                          onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                        />
                      </div>

                      <div className="form-field" style={{ margin: '8px 0 0 0' }}>
                        <label style={{ fontSize: '11px', color: '#121212', fontWeight: 600 }}>
                          Primary Image Alt Text (SEO & Accessibility)
                        </label>
                        <input
                          type="text"
                          value={editingProduct.imageAlt || ''}
                          placeholder="e.g. Whispered Surprises hand-poured candle in luxury glass vessel"
                          onChange={(e) => setEditingProduct({ ...editingProduct, imageAlt: e.target.value })}
                        />
                        <span className="form-field-hint" style={{ fontSize: '10.5px' }}>
                          Used for Google Image search ranking and visually impaired screen readers.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="modal-section-title" style={{ marginTop: '22px' }}>
                    <Layers size={15} />
                    <span>Product Gallery / Multi-Angles ({(editingProduct.gallery || []).length} photos)</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '-6px', marginBottom: '12px' }}>
                    These photos appear in the high-resolution product gallery thumbnail strip, zoom lens, and 3D preview.
                  </p>

                  {/* Gallery Grid */}
                  <div className="gallery-grid-container">
                    {(editingProduct.gallery || []).map((imgUrl, idx) => (
                      <div key={idx} className="gallery-thumb-item" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ position: 'relative', width: '100%', height: '110px' }}>
                          <img
                            src={imgUrl}
                            alt={(editingProduct.galleryAlt && editingProduct.galleryAlt[idx]) || `Gallery photo ${idx + 1}`}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                          <button
                            type="button"
                            className="gallery-thumb-remove"
                            title="Remove image"
                            onClick={() => {
                              const updated = [...(editingProduct.gallery || [])];
                              updated.splice(idx, 1);
                              const updatedAlt = [...(editingProduct.galleryAlt || [])];
                              updatedAlt.splice(idx, 1);
                              setEditingProduct({ ...editingProduct, gallery: updated, galleryAlt: updatedAlt });
                            }}
                          >
                            <X size={13} />
                          </button>
                          <button
                            type="button"
                            className="gallery-thumb-primary-badge"
                            title="Set as main showcase photo"
                            onClick={() => setEditingProduct({ ...editingProduct, image: imgUrl, imageAlt: (editingProduct.galleryAlt && editingProduct.galleryAlt[idx]) || editingProduct.imageAlt })}
                          >
                            {editingProduct.image === imgUrl ? '★ Primary' : 'Make Primary'}
                          </button>
                        </div>
                        <input
                          type="text"
                          value={(editingProduct.galleryAlt && editingProduct.galleryAlt[idx]) || ''}
                          placeholder={`Alt text for photo #${idx + 1}...`}
                          style={{
                            fontSize: '10px',
                            padding: '3px 5px',
                            border: '1px solid rgba(187, 165, 142, 0.35)',
                            borderRadius: '4px',
                            marginTop: '4px',
                            width: '100%',
                            boxSizing: 'border-box',
                            background: '#FFFFFF',
                          }}
                          onChange={(e) => {
                            const updatedAlt = [...(editingProduct.galleryAlt || [])];
                            while (updatedAlt.length < (editingProduct.gallery || []).length) {
                              updatedAlt.push('');
                            }
                            updatedAlt[idx] = e.target.value;
                            setEditingProduct({ ...editingProduct, galleryAlt: updatedAlt });
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Add to Gallery Controls */}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', background: '#F9F7F2', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(187, 165, 142, 0.3)' }}>
                    <label className="btn-upload-file">
                      <Plus size={14} />
                      <span>{uploadingGallery ? 'Uploading to Gallery...' : 'Upload Photos to Gallery'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={uploadingGallery}
                        onChange={async (e) => {
                          const files = e.target.files;
                          if (!files || files.length === 0) return;
                          setUploadingGallery(true);
                          try {
                            const newUrls: string[] = [];
                            for (let i = 0; i < files.length; i++) {
                              const u = await handleUploadImage(files[i]);
                              if (u) newUrls.push(u);
                            }
                            if (newUrls.length > 0) {
                              setEditingProduct({
                                ...editingProduct,
                                gallery: [...(editingProduct.gallery || []), ...newUrls],
                              });
                            }
                          } finally {
                            setUploadingGallery(false);
                          }
                        }}
                      />
                    </label>

                    <div style={{ flex: 1, display: 'flex', gap: '8px', minWidth: '220px' }}>
                      <input
                        type="text"
                        style={{
                          background: '#FFFFFF',
                          border: '1.5px solid rgba(187, 165, 142, 0.35)',
                          borderRadius: '6px',
                          padding: '7px 12px',
                          fontSize: '12.5px',
                          flex: 1,
                        }}
                        placeholder="Or enter image URL to add..."
                        value={newGalleryUrl}
                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newGalleryUrl.trim()) {
                              setEditingProduct({
                                ...editingProduct,
                                gallery: [...(editingProduct.gallery || []), newGalleryUrl.trim()],
                              });
                              setNewGalleryUrl('');
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        style={{
                          background: '#121212',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '7px 14px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          if (newGalleryUrl.trim()) {
                            setEditingProduct({
                              ...editingProduct,
                              gallery: [...(editingProduct.gallery || []), newGalleryUrl.trim()],
                            });
                            setNewGalleryUrl('');
                          }
                        }}
                      >
                        + Add URL
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 3: DESCRIPTION & RITUAL */}
              {activeModalTab === 'story' && (
                <>
                  <div className="form-field">
                    <label>The Olfactory & Artisanal Story (Description)</label>
                    <span className="form-field-hint">
                      This narrative is prominently highlighted on the product page story section and "The Olfactory Story" accordion.
                    </span>
                    <textarea
                      rows={5}
                      value={editingProduct.description || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      placeholder="Detail the inspiration, artisanal craftsmanship, scent evolution, or the secret hidden note experience..."
                    />
                  </div>

                  <div className="form-field">
                    <label>Application Ritual & Usage Tips</label>
                    <span className="form-field-hint">
                      Instructions displayed in the "Application Ritual & Tips" accordion.
                    </span>
                    <textarea
                      rows={4}
                      value={editingProduct.usageRitual || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, usageRitual: e.target.value })}
                      placeholder="e.g. For candles: Trim wick to 1/4 inch before lighting. Allow wax pool to melt evenly to the glass edge on the first burn to prevent tunneling..."
                    />
                  </div>
                </>
              )}

              {/* TAB 4: SCENT NOTES & INGREDIENTS */}
              {activeModalTab === 'notes' && (
                <>
                  <div className="modal-section-title">
                    <Sparkles size={15} />
                    <span>The Olfactory Pyramid (Scent / Candle Notes)</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '-6px', marginBottom: '14px' }}>
                    Enter scent notes separated by commas. These will be formatted into interactive notes chips and the pyramid chart.
                  </p>

                  <div className="form-field">
                    <label>Top Notes (Initial 0–30 Minutes Impression)</label>
                    <input
                      type="text"
                      value={rawNotes.top}
                      onChange={(e) => setRawNotes({ ...rawNotes, top: e.target.value })}
                      placeholder="e.g. Calabrian Bergamot, Pink Pepper, Sparkling Pear, Sea Salt"
                    />
                    <span className="form-field-hint">Separate with commas</span>
                  </div>

                  <div className="form-field">
                    <label>Heart / Middle Notes (30 Mins — 4 Hours Radiant Core)</label>
                    <input
                      type="text"
                      value={rawNotes.heart}
                      onChange={(e) => setRawNotes({ ...rawNotes, heart: e.target.value })}
                      placeholder="e.g. Damask Rose, French Orange Blossom, White Jasmine Sambac"
                    />
                    <span className="form-field-hint">Separate with commas</span>
                  </div>

                  <div className="form-field">
                    <label>Base Notes (4 — 14+ Hours Deep Sillage & Warmth)</label>
                    <input
                      type="text"
                      value={rawNotes.base}
                      onChange={(e) => setRawNotes({ ...rawNotes, base: e.target.value })}
                      placeholder="e.g. Rare Smoked Oud, Precious Ambergris, Bourbon Vanilla, Cedarwood"
                    />
                    <span className="form-field-hint">Separate with commas</span>
                  </div>

                  <div className="modal-section-title" style={{ marginTop: '20px' }}>
                    <Tag size={15} />
                    <span>Clean Formulation Ingredients</span>
                  </div>

                  <div className="form-field">
                    <label>Ingredients List</label>
                    <input
                      type="text"
                      value={rawNotes.ingredients}
                      onChange={(e) => setRawNotes({ ...rawNotes, ingredients: e.target.value })}
                      placeholder="e.g. 100% Pure Botanical Soy Wax, Hand-Braided Cotton Wick, Nontoxic Botanical Fragrance Oils"
                    />
                    <span className="form-field-hint">Separate each ingredient or certified element with a comma</span>
                  </div>
                </>
              )}

              {/* TAB 5: SPECS & INVENTORY */}
              {activeModalTab === 'specs' && (
                <>
                  <div className="modal-section-title">
                    <Sliders size={15} />
                    <span>Formulation & Craft Specifications</span>
                  </div>

                  <div className="form-group-row">
                    <div className="form-field">
                      <label>Concentration / Wax Type</label>
                      <input
                        type="text"
                        value={editingProduct.concentration || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, concentration: e.target.value })}
                        placeholder="e.g. 20% EAU DE PARFUM or Pure Soy Wax"
                      />
                    </div>
                    <div className="form-field">
                      <label>Volume / Net Weight</label>
                      <input
                        type="text"
                        value={editingProduct.volume || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, volume: e.target.value })}
                        placeholder="e.g. 50ml / 1.7 fl oz or 300g / 10.5 oz"
                      />
                    </div>
                  </div>

                  <div className="form-group-row">
                    <div className="form-field">
                      <label>Longevity / Burn Time</label>
                      <input
                        type="text"
                        value={editingProduct.longevity || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, longevity: e.target.value })}
                        placeholder="e.g. 16+ Hours on Skin or 55+ Hours Clean Burn"
                      />
                    </div>
                    <div className="form-field">
                      <label>Sillage / Wick Spec</label>
                      <input
                        type="text"
                        value={editingProduct.sillage || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, sillage: e.target.value })}
                        placeholder="e.g. Enveloping & Radiant or Lead-Free Braided Wick"
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Scent Family / Character</label>
                    <input
                      type="text"
                      value={editingProduct.scentFamily || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, scentFamily: e.target.value })}
                      placeholder="e.g. Floral Oriental, Gourmand Confection, Oceanic Amber"
                    />
                  </div>

                  <div className="modal-section-title" style={{ marginTop: '20px' }}>
                    <Package size={15} />
                    <span>Inventory & Availability</span>
                  </div>

                  <div className="form-group-row">
                    <div className="form-field">
                      <label>Availability Status</label>
                      <select
                        value={editingProduct.inStock ? 'true' : 'false'}
                        onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.value === 'true' })}
                      >
                        <option value="true">✓ In Stock (Purchasable)</option>
                        <option value="false">✕ Out of Stock (Sold Out)</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label>Stock Count / Units Available</label>
                      <input
                        type="number"
                        value={editingProduct.stockCount ?? 50}
                        onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* TAB 7: SEO, SLUG & META TAGS */}
              {activeModalTab === 'seo' && (
                <>
                  <div className="modal-section-title">
                    <Search size={15} />
                    <span>Search Engine Optimization (SEO), Slug & Social Meta</span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#666', marginTop: '-6px', marginBottom: '18px' }}>
                    Control how this product ranks and displays across Google Search, Bing, WhatsApp link previews, and browser tabs.
                  </p>

                  {/* URL Slug & Permalinks */}
                  <div style={{ background: '#FAF8F5', border: '1px solid #EBE4DA', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                        Product URL Slug / Permalink
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          if (editingProduct.title) {
                            const autoSlug = editingProduct.title
                              .toLowerCase()
                              .trim()
                              .replace(/[^a-z0-9]+/g, '-')
                              .replace(/^-+|-+$/g, '');
                            setEditingProduct({ ...editingProduct, slug: autoSlug });
                          }
                        }}
                        style={{
                          background: '#121212',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        ⚡ Generate Slug from Title
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12.5px', color: '#888', fontFamily: 'monospace' }}>
                        nooreflames.com/product/
                      </span>
                      <input
                        type="text"
                        value={editingProduct.slug || ''}
                        placeholder={editingProduct.title ? editingProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'custom-url-slug'}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                          })
                        }
                        style={{ flex: 1, fontFamily: 'monospace', fontWeight: 600 }}
                      />
                    </div>
                    <span className="form-field-hint" style={{ marginTop: '6px' }}>
                      Use lowercase letters, numbers, and hyphens only. Changing this updates the friendly short link for this product.
                    </span>
                  </div>

                  {/* Meta Title */}
                  <div className="form-field" style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontWeight: 700 }}>SEO Meta Title</label>
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 600,
                          color:
                            (editingProduct.metaTitle || '').length > 60
                              ? '#DC2626'
                              : (editingProduct.metaTitle || '').length >= 35
                              ? '#16A34A'
                              : '#888',
                        }}
                      >
                        {(editingProduct.metaTitle || '').length} / 60 chars { (editingProduct.metaTitle || '').length > 60 ? '(Too long for Google snippet)' : (editingProduct.metaTitle || '').length >= 35 ? '(Optimal)' : '' }
                      </span>
                    </div>
                    <input
                      type="text"
                      value={editingProduct.metaTitle || ''}
                      placeholder={editingProduct.title ? `${editingProduct.title} — NOOR-E-FLAMES` : 'e.g. Whispered Surprises Secret Message Candle — NOOR-E-FLAMES'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, metaTitle: e.target.value })}
                    />
                    <span className="form-field-hint">
                      The title that appears as the clickable blue headline in Google search results and browser tabs. Recommended: 50–60 characters.
                    </span>
                  </div>

                  {/* Meta Description */}
                  <div className="form-field" style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontWeight: 700 }}>SEO Meta Description</label>
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 600,
                          color:
                            (editingProduct.metaDescription || '').length > 160
                              ? '#DC2626'
                              : (editingProduct.metaDescription || '').length >= 100
                              ? '#16A34A'
                              : '#888',
                        }}
                      >
                        {(editingProduct.metaDescription || '').length} / 160 chars { (editingProduct.metaDescription || '').length > 160 ? '(Truncated in Google)' : (editingProduct.metaDescription || '').length >= 100 ? '(Optimal)' : '' }
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={editingProduct.metaDescription || ''}
                      placeholder={editingProduct.subtitle || editingProduct.description || 'e.g. Handcrafted pure soy wax candle embedded with secret keepsake message that reveals upon burning. Clean burn, non-toxic lead-free wick. Hand-poured in New Delhi.'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, metaDescription: e.target.value })}
                    />
                    <span className="form-field-hint">
                      The descriptive snippet displayed beneath the title in search engines and social shares. Recommended: 120–160 characters.
                    </span>
                  </div>

                  {/* Image Alt Text */}
                  <div className="form-field" style={{ marginBottom: '22px' }}>
                    <label style={{ fontWeight: 700 }}>Primary Image Alt Text (Accessibility & Google Image Search)</label>
                    <input
                      type="text"
                      value={editingProduct.imageAlt || ''}
                      placeholder={`e.g. ${editingProduct.title || 'Handcrafted perfume bottle'} with luxury packaging`}
                      onChange={(e) => setEditingProduct({ ...editingProduct, imageAlt: e.target.value })}
                    />
                    <span className="form-field-hint">
                      Provides textual context for visually impaired users and indexes your product in Google Image search.
                    </span>
                  </div>

                  {/* Live Google Search Preview (SERP Card) */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '18px 20px', boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748B', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
                      <Sparkles size={13} color="#2563EB" />
                      <span>Live Google Search Engine Result Preview</span>
                    </div>

                    <div style={{ fontFamily: 'arial, sans-serif' }}>
                      {/* URL Breadcrumb */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#202124', marginBottom: '4px' }}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#1A1816', color: '#FAF6F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                          N
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '12px', color: '#202124', lineHeight: 1.2 }}>NOOR-E-FLAMES</span>
                          <span style={{ fontSize: '11px', color: '#5f6368', lineHeight: 1.2 }}>
                            https://nooreflames.com › product › {editingProduct.slug || editingProduct.id}
                          </span>
                        </div>
                      </div>

                      {/* Clickable Blue Link */}
                      <h4 style={{ fontSize: '18px', color: '#1a0dab', margin: '4px 0 6px', fontWeight: 400, lineHeight: 1.3 }}>
                        {editingProduct.metaTitle || (editingProduct.title ? `${editingProduct.title} — NOOR-E-FLAMES` : 'Product Title — NOOR-E-FLAMES')}
                      </h4>

                      {/* Snippet Text */}
                      <p style={{ fontSize: '13px', color: '#4d5156', margin: '0 0 6px', lineHeight: 1.5 }}>
                        {editingProduct.metaDescription || editingProduct.subtitle || editingProduct.description?.slice(0, 150) || 'Discover luxury handcrafted fragrances, alcohol-free attars, and clean-burning sculptural candles with secret messages made in New Delhi.'}
                      </p>

                      {/* Rich Snippet Details */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#70757a' }}>
                        <span style={{ color: '#e37400' }}>★★★★★</span>
                        <span>{editingProduct.rating || 4.9} ({editingProduct.reviewsCount || 148})</span>
                        <span>·</span>
                        <span style={{ fontWeight: 600, color: '#188038' }}>₹{editingProduct.price} · In stock</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="modal-actions" style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid rgba(187, 165, 142, 0.25)' }}>
              {!isNewProduct && (
                <Link
                  href={`/product/${editingProduct.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-view-product"
                  style={{ marginRight: 'auto' }}
                  title="View live product page in new tab"
                >
                  <Eye size={14} />
                  <span>View Live Page</span>
                  <ExternalLink size={12} />
                </Link>
              )}
              <button className="btn-cancel" onClick={() => setEditingProduct(null)}>
                Cancel
              </button>
              <button
                className="btn-confirm"
                disabled={productSaveStatus === 'saving' || uploadingMainImage || uploadingGallery}
                onClick={handleSaveProduct}
              >
                {productSaveStatus === 'saving'
                  ? 'Saving...'
                  : productSaveStatus === 'saved'
                  ? '✓ Saved Successfully!'
                  : productSaveStatus === 'error'
                  ? 'Error — Retry'
                  : isNewProduct
                  ? 'Create Product'
                  : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#FAF8F5',
                border: '1px solid rgba(18, 18, 18, 0.12)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#707070',
                transition: 'all 0.2s ease',
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#121212';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FAF8F5';
                e.currentTarget.style.color = '#707070';
              }}
              title="Close modal"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
            <h3 className="modal-title font-serif" style={{ paddingRight: '44px' }}>Order Details — {selectedOrder.id}</h3>

            <div className="order-modal-grid">
              <div>
                <strong>Customer:</strong> {selectedOrder.customer}
              </div>
              <div>
                <strong>Phone:</strong> {selectedOrder.phone}
              </div>
              <div>
                <strong>Email:</strong> {selectedOrder.email}
              </div>
              <div>
                <strong>Destination:</strong> {selectedOrder.destination}
                {selectedOrder.distanceKm && (
                  <span style={{ marginLeft: '6px', fontSize: '11px', color: '#8A7258', fontWeight: 600 }}>
                    ({selectedOrder.distanceKm} km · {selectedOrder.zoneName || 'Delhi Hub'})
                  </span>
                )}
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <strong>Address:</strong> {selectedOrder.address}, PIN: {selectedOrder.pincode}
              </div>
              <div>
                <strong>Payment Mode:</strong> {selectedOrder.payment}
              </div>
              <div>
                <strong>Grand Total:</strong> ₹{(Number(selectedOrder.amount) || 0).toLocaleString('en-IN')}
              </div>
              {selectedOrder.isPartialCod && (
                <>
                  <div style={{ background: '#f0fdf4', padding: '8px 10px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                    <strong style={{ color: '#166534' }}>UPI Advance Paid:</strong>{' '}
                    <span style={{ fontWeight: 700, color: '#15803d' }}>₹{(Number(selectedOrder.advanceAmount) || 0).toLocaleString('en-IN')}</span>
                    {selectedOrder.advancePaymentId && (
                      <div style={{ fontSize: '10.5px', color: '#166534', marginTop: '2px' }}>
                        Ref: {selectedOrder.advancePaymentId}
                      </div>
                    )}
                  </div>
                  <div style={{ background: '#fef3c7', padding: '8px 10px', borderRadius: '6px', border: '1px solid #fde68a' }}>
                    <strong style={{ color: '#92400e' }}>Collect on Delivery (Cash):</strong>{' '}
                    <span style={{ fontWeight: 800, color: '#b45309', fontSize: '14px' }}>
                      ₹{(Number(selectedOrder.remainingCodAmount ?? ((Number(selectedOrder.amount) || 0) - (Number(selectedOrder.advanceAmount) || 0))) || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </>
              )}
            </div>

            <h4 className="font-serif" style={{ marginTop: '16px', marginBottom: '8px' }}>
              Items Ordered:
            </h4>
            <div className="order-items-list">
              {selectedOrder.items?.map((it, idx) => (
                <div key={idx} className="order-modal-item">
                  <img src={it.image} alt={it.title} />
                  <div style={{ flex: 1 }}>
                    <div><strong>{it.title}</strong></div>
                    <div style={{ color: '#707070', fontSize: '12px' }}>Qty: {it.quantity}</div>
                  </div>
                  <div className="font-serif">₹{((Number(it.price) || 0) * (Number(it.quantity) || 1)).toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>

            <div className="modal-actions" style={{ marginTop: '20px' }}>
              <button className="btn-cancel" onClick={() => setSelectedOrder(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COUPON EDIT / CREATE MODAL */}
      {editingCoupon && (
        <div className="admin-modal-backdrop" onClick={() => setEditingCoupon(null)}>
          <div
            className="admin-modal"
            style={{ maxWidth: '520px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="admin-modal-close"
              onClick={() => setEditingCoupon(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: '#FAF8F5',
                border: '1px solid rgba(187, 165, 142, 0.3)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#707070',
                transition: 'all 0.2s ease',
              }}
              title="Close modal"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Tag size={20} color="#8A7258" />
              <h3 className="modal-title font-serif" style={{ margin: 0 }}>
                {isNewCoupon ? 'Create New Coupon' : `Edit Coupon: ${editingCoupon.code}`}
              </h3>
            </div>
            <p style={{ color: '#707070', fontSize: '13px', margin: '0 0 18px 0' }}>
              Promotional codes apply instantly in the shopping cart and checkout.
            </p>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                Coupon Code (Uppercase, No Spaces)
              </label>
              <input
                type="text"
                value={editingCoupon.code}
                onChange={(e) =>
                  setEditingCoupon({
                    ...editingCoupon,
                    code: e.target.value.toUpperCase().replace(/\s+/g, ''),
                  })
                }
                placeholder="e.g. LUXURY20"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #DCD3C5',
                  borderRadius: '8px',
                  textTransform: 'uppercase',
                  fontFamily: 'monospace',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#121212',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  Discount Percent (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editingCoupon.discountPercent}
                  onChange={(e) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      discountPercent: Number(e.target.value) || 0,
                    })
                  }
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #DCD3C5', borderRadius: '8px' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  Min. Order Value (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={editingCoupon.minOrder}
                  onChange={(e) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      minOrder: Number(e.target.value) || 0,
                    })
                  }
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #DCD3C5', borderRadius: '8px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  Flat Discount (₹) (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0 (if % used)"
                  value={editingCoupon.discountAmount || ''}
                  onChange={(e) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      discountAmount: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #DCD3C5', borderRadius: '8px' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  Bundle Fixed Price (₹) (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 1499 for DUO1499"
                  value={editingCoupon.fixedPrice || ''}
                  onChange={(e) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      fixedPrice: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #DCD3C5', borderRadius: '8px' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                Description / Benefit Note
              </label>
              <input
                type="text"
                value={editingCoupon.description}
                onChange={(e) =>
                  setEditingCoupon({ ...editingCoupon, description: e.target.value })
                }
                placeholder="e.g. 20% off on all orders above ₹999"
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #DCD3C5', borderRadius: '8px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '20px', padding: '12px 14px', background: '#FAF8F5', borderRadius: '8px', border: '1px solid #E8E3D8' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={editingCoupon.isActive}
                  onChange={(e) =>
                    setEditingCoupon({ ...editingCoupon, isActive: e.target.checked })
                  }
                />
                <span>Active & Redeemable</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={Boolean(editingCoupon.freeShipping)}
                  onChange={(e) =>
                    setEditingCoupon({ ...editingCoupon, freeShipping: e.target.checked })
                  }
                />
                <span>Includes Free Shipping</span>
              </label>
            </div>

            <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setEditingCoupon(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-confirm"
                disabled={couponSaveStatus === 'saving' || !editingCoupon.code.trim()}
                onClick={handleSaveCoupon}
              >
                {couponSaveStatus === 'saving'
                  ? 'Saving...'
                  : couponSaveStatus === 'saved'
                  ? '✓ Saved!'
                  : couponSaveStatus === 'error'
                  ? 'Error — Retry'
                  : isNewCoupon
                  ? 'Create Coupon'
                  : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Add Staff Member Modal */}
      {showAddTeamModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowAddTeamModal(false)}>
          <div
            className="admin-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '520px', width: '100%', borderRadius: '16px', overflow: 'hidden' }}
          >
            <div style={{ padding: '20px 24px', background: '#FAF8F5', borderBottom: '1px solid rgba(187, 165, 142, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={20} color="#8A7258" />
                <h3 className="font-serif" style={{ margin: 0, fontSize: '18px' }}>Add New Staff Member</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddTeamModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#707070' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTeamMember} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-field">
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#121212' }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid rgba(187, 165, 142, 0.35)', background: '#FAF8F5', fontSize: '13px' }}
                />
              </div>

              <div className="form-field">
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#121212' }}>Staff Username (Required for login)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8A7258', fontWeight: 700, fontSize: '13px' }}>@</span>
                  <input
                    type="text"
                    required
                    placeholder="elena"
                    value={newTeamUsername}
                    onChange={(e) => setNewTeamUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ''))}
                    style={{ width: '100%', padding: '10px 12px 10px 28px', borderRadius: '8px', border: '1.5px solid rgba(187, 165, 142, 0.35)', background: '#FAF8F5', fontSize: '13px', fontWeight: 600 }}
                  />
                </div>
                <span style={{ fontSize: '11px', color: '#8A7258', marginTop: '3px', display: 'block' }}>Staff can sign in with this exact @username.</span>
              </div>

              <div className="form-field">
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#121212' }}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. elena@nooreflames.com"
                  value={newTeamEmail}
                  onChange={(e) => setNewTeamEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid rgba(187, 165, 142, 0.35)', background: '#FAF8F5', fontSize: '13px' }}
                />
              </div>

              <div className="form-field">
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#121212' }}>Staff Role & Permission Tier</label>
                <select
                  value={newTeamRole}
                  onChange={(e) => setNewTeamRole(e.target.value as AdminRole)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid rgba(187, 165, 142, 0.35)', background: '#FAF8F5', fontSize: '13px', fontWeight: 600 }}
                >
                  <option value="administrator">👑 Administrator (Full Master Access to All 9 Tabs)</option>
                  <option value="editor">✏️ Catalog Editor (Products, Orders, Offers, Sync)</option>
                  <option value="content_manager">🎨 Content Manager (Banners, Products, Offers)</option>
                  <option value="operations">📦 Operations & Support (Orders, Users, WA, Dashboard)</option>
                  <option value="viewer">👁️ Read-Only Viewer (Dashboard, Products)</option>
                </select>
                <div style={{ fontSize: '11.5px', color: '#8A7258', marginTop: '4px' }}>
                  Allowed tabs: {getAllowedTabsForRole(newTeamRole, undefined, rolePermissions).join(', ')}
                </div>
              </div>

              <div className="form-field">
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#121212' }}>Login Password</label>
                <input
                  type="text"
                  required
                  placeholder="Password for staff login"
                  value={newTeamPassword}
                  onChange={(e) => setNewTeamPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid rgba(187, 165, 142, 0.35)', background: '#FAF8F5', fontSize: '13px', fontFamily: 'monospace', fontWeight: 600 }}
                />
              </div>

              <div className="form-field">
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#121212' }}>Staff WhatsApp Phone (Optional)</label>
                <input
                  type="tel"
                  placeholder="+919289289800"
                  value={newTeamPhone}
                  onChange={(e) => setNewTeamPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid rgba(187, 165, 142, 0.35)', background: '#FAF8F5', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn-admin-secondary"
                  onClick={() => setShowAddTeamModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTeam}
                  className="btn-admin-save"
                >
                  {isSubmittingTeam ? 'Adding Staff...' : 'Create Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Customize Individual Staff Member Tabs Modal */}
      {editingMemberTabs && (
        <div className="admin-modal-backdrop" onClick={() => setEditingMemberTabs(null)}>
          <div
            className="admin-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '540px', width: '100%', borderRadius: '16px', overflow: 'hidden' }}
          >
            <div style={{ padding: '20px 24px', background: '#FAF8F5', borderBottom: '1px solid rgba(187, 165, 142, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 className="font-serif" style={{ margin: 0, fontSize: '18px' }}>
                  Customize Tabs: {editingMemberTabs.name}
                </h3>
                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                  {editingMemberTabs.email} • Assigned Role: {ROLE_DEFINITIONS[editingMemberTabs.role]?.name}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingMemberTabs(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#707070' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#4B5563', lineHeight: 1.5 }}>
                Select specific tabs to grant this individual staff member. Customizing here gives them tailored permissions without changing other users with the same role.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {ALL_ADMIN_TABS.map((tab) => {
                  const isTabActive = memberCustomTabs.includes(tab.id);
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setMemberCustomTabs((prev) =>
                          prev.includes(tab.id) ? prev.filter((t) => t !== tab.id) : [...prev, tab.id]
                        );
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: isTabActive ? '1.5px solid #8A7258' : '1.5px solid #E5E7EB',
                        background: isTabActive ? '#FAF8F5' : '#FFFFFF',
                        color: isTabActive ? '#121212' : '#6B7280',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontWeight: isTabActive ? 700 : 500,
                        fontSize: '12.5px',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                          border: isTabActive ? '2px solid #8A7258' : '2px solid #D1D5DB',
                          background: isTabActive ? '#8A7258' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFF',
                          fontSize: '11px',
                          flexShrink: 0,
                          fontWeight: 800,
                        }}
                      >
                        {isTabActive ? '✓' : ''}
                      </div>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
                <button
                  type="button"
                  onClick={() => {
                    const defaultTabs = rolePermissions[editingMemberTabs.role] || DEFAULT_ROLE_PERMISSIONS[editingMemberTabs.role] || [];
                    setMemberCustomTabs([...defaultTabs]);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#8A7258',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Reset to Role Default ({getAllowedTabsForRole(editingMemberTabs.role, undefined, rolePermissions).length} Tabs)
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setEditingMemberTabs(null)}
                    className="btn-admin-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSavingMemberTabs}
                    onClick={handleSaveMemberCustomTabs}
                    className="btn-admin-save"
                  >
                    {isSavingMemberTabs ? 'Saving...' : 'Save Member Tabs'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Edit Staff Credentials & Role Access Modal */}
      {editingCredMember && (
        <div className="admin-modal-backdrop" onClick={() => setEditingCredMember(null)}>
          <div
            className="admin-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '580px', width: '100%', borderRadius: '16px', overflow: 'hidden' }}
          >
            <div style={{ padding: '20px 24px', background: '#FAF8F5', borderBottom: '1px solid rgba(187, 165, 142, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EEF2FF', border: '1.5px solid #C7D2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5' }}>
                  <Key size={18} />
                </div>
                <div>
                  <h3 className="font-serif" style={{ margin: 0, fontSize: '18px' }}>
                    Edit Staff Credentials & Access
                  </h3>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                    @{editCredUsername || 'username'} • Assigned Role: {ROLE_DEFINITIONS[editCredRole]?.name}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingCredMember(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#707070' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEditCreds} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '80vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                <div className="form-field">
                  <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#121212' }}>Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Staff Full Name"
                    value={editCredName}
                    onChange={(e) => setEditCredName(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid rgba(187, 165, 142, 0.35)', background: '#FAF8F5', fontSize: '13px' }}
                  />
                </div>

                <div className="form-field">
                  <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#121212' }}>Staff Username (@handle)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8A7258', fontWeight: 700, fontSize: '13px' }}>@</span>
                    <input
                      type="text"
                      required
                      placeholder="username"
                      value={editCredUsername}
                      onChange={(e) => setEditCredUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ''))}
                      style={{ width: '100%', padding: '9px 12px 9px 28px', borderRadius: '8px', border: '1.5px solid rgba(187, 165, 142, 0.35)', background: '#FAF8F5', fontSize: '13px', fontWeight: 700 }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                <div className="form-field">
                  <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#121212' }}>Login Email</label>
                  <input
                    type="email"
                    required
                    placeholder="staff@nooreflames.com"
                    value={editCredEmail}
                    onChange={(e) => setEditCredEmail(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid rgba(187, 165, 142, 0.35)', background: '#FAF8F5', fontSize: '13px' }}
                  />
                </div>

                <div className="form-field">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#121212' }}>Secret Password</label>
                    <button
                      type="button"
                      onClick={() => setEditCredPassword(`nf_${Math.random().toString(36).substring(2, 8)}`)}
                      style={{ background: 'none', border: 'none', color: '#4F46E5', fontSize: '10.5px', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                    >
                      Generate Random
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Enter new password"
                    value={editCredPassword}
                    onChange={(e) => setEditCredPassword(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid rgba(187, 165, 142, 0.35)', background: '#FAF8F5', fontSize: '13px', fontFamily: 'monospace', fontWeight: 600 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                <div className="form-field">
                  <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#121212' }}>Assigned Role Tier</label>
                  <select
                    value={editCredRole}
                    onChange={(e) => {
                      const newR = e.target.value as AdminRole;
                      setEditCredRole(newR);
                      setEditCredTabs(rolePermissions[newR] || DEFAULT_ROLE_PERMISSIONS[newR] || []);
                    }}
                    disabled={editingCredMember.id === 'team_super_admin' || editingCredMember.email === 'nooreflamesadmin@gmail.com'}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid rgba(187, 165, 142, 0.35)', background: '#FAF8F5', fontSize: '13px', fontWeight: 600 }}
                  >
                    <option value="administrator">👑 Administrator (All 9 Tabs)</option>
                    <option value="editor">✏️ Catalog Editor</option>
                    <option value="content_manager">🎨 Content Manager</option>
                    <option value="operations">📦 Operations & Support</option>
                    <option value="viewer">👁️ Read-Only Viewer</option>
                  </select>
                </div>

                <div className="form-field">
                  <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#121212' }}>Account Status</label>
                  <select
                    value={editCredStatus}
                    onChange={(e) => setEditCredStatus(e.target.value as 'active' | 'suspended')}
                    disabled={editingCredMember.id === 'team_super_admin'}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid rgba(187, 165, 142, 0.35)', background: '#FAF8F5', fontSize: '13px', fontWeight: 600 }}
                  >
                    <option value="active">Active & Authorized</option>
                    <option value="suspended">Suspended (Login Blocked)</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#121212' }}>Staff Phone (Optional)</label>
                <input
                  type="tel"
                  placeholder="+919289289800"
                  value={editCredPhone}
                  onChange={(e) => setEditCredPhone(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid rgba(187, 165, 142, 0.35)', background: '#FAF8F5', fontSize: '13px' }}
                />
              </div>

              {/* Granular Tab Access Authority Checklist */}
              <div style={{ marginTop: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#121212', margin: 0 }}>
                    Permitted Navigation Tabs for this Member
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const def = rolePermissions[editCredRole] || DEFAULT_ROLE_PERMISSIONS[editCredRole] || [];
                      setEditCredTabs([...def]);
                    }}
                    style={{ background: 'none', border: 'none', color: '#8A7258', fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                  >
                    Reset to Role Default ({getAllowedTabsForRole(editCredRole, undefined, rolePermissions).length} tabs)
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {ALL_ADMIN_TABS.map((tab) => {
                    const isTabAllowed = editCredTabs.includes(tab.id);
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setEditCredTabs((prev) =>
                            prev.includes(tab.id) ? prev.filter((t) => t !== tab.id) : [...prev, tab.id]
                          );
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: isTabAllowed ? '1.5px solid #4F46E5' : '1.5px solid #E5E7EB',
                          background: isTabAllowed ? '#EEF2FF' : '#FFFFFF',
                          color: isTabAllowed ? '#1E1B4B' : '#6B7280',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontWeight: isTabAllowed ? 700 : 500,
                          fontSize: '12px',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {isTabAllowed ? <CheckCircle2 size={14} color="#4F46E5" /> : <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1.5px solid #D1D5DB' }} />}
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn-admin-secondary"
                  onClick={() => setEditingCredMember(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingCreds}
                  className="btn-admin-save"
                >
                  {isSavingCreds ? 'Saving Credentials...' : 'Save Credentials & Tab Access'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
