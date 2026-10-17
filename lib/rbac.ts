export type AdminTab =
  | 'dashboard'
  | 'users'
  | 'products'
  | 'orders'
  | 'banners'
  | 'offers'
  | 'sync'
  | 'whatsapp';

export type AdminRole =
  | 'administrator'
  | 'editor'
  | 'content_manager'
  | 'operations'
  | 'viewer';

export interface RoleDefinition {
  id: AdminRole;
  name: string;
  badge: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  allowedTabs: AdminTab[];
  canManageTeam: boolean;
  canExportData: boolean;
  canDeleteRecords: boolean;
}

export const ROLE_DEFINITIONS: Record<AdminRole, RoleDefinition> = {
  administrator: {
    id: 'administrator',
    name: 'Administrator',
    badge: 'Super Admin',
    emoji: '👑',
    color: '#991B1B', // deep ruby red
    bgColor: '#FEF2F2',
    borderColor: '#FECACA',
    description: 'Full master access to all tabs, customer directories, financial revenue analytics, and team role permissions.',
    allowedTabs: ['dashboard', 'users', 'products', 'orders', 'banners', 'offers', 'sync', 'whatsapp'],
    canManageTeam: true,
    canExportData: true,
    canDeleteRecords: true,
  },
  editor: {
    id: 'editor',
    name: 'Catalog & Store Editor',
    badge: 'Editor',
    emoji: '✏️',
    color: '#1D4ED8', // deep royal blue
    bgColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    description: 'Manages catalog inventory, product pricing, variant options, customer orders, coupons, and store synchronization.',
    allowedTabs: ['products', 'orders', 'offers', 'sync'],
    canManageTeam: false,
    canExportData: true,
    canDeleteRecords: false,
  },
  content_manager: {
    id: 'content_manager',
    name: 'Brand & Content Manager',
    badge: 'Content Manager',
    emoji: '🎨',
    color: '#7E22CE', // luxury purple
    bgColor: '#FAF5FF',
    borderColor: '#E9D5FF',
    description: 'Responsible for editorial aesthetics, hero videos, banners, creative slider campaigns, and product storytelling.',
    allowedTabs: ['banners', 'products', 'offers'],
    canManageTeam: false,
    canExportData: false,
    canDeleteRecords: false,
  },
  operations: {
    id: 'operations',
    name: 'Operations & Concierge',
    badge: 'Operations',
    emoji: '📦',
    color: '#047857', // emerald green
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    description: 'Handles order fulfillment, delivery logistics, registered patron directory, and customer WhatsApp concierge messaging.',
    allowedTabs: ['dashboard', 'orders', 'users', 'whatsapp'],
    canManageTeam: false,
    canExportData: true,
    canDeleteRecords: false,
  },
  viewer: {
    id: 'viewer',
    name: 'Auditor & Observer',
    badge: 'Read-Only Viewer',
    emoji: '👁️',
    color: '#374151', // sleek charcoal
    bgColor: '#F3F4F6',
    borderColor: '#E5E7EB',
    description: 'Read-only visibility into store performance dashboards and product catalog. Cannot modify any records.',
    allowedTabs: ['dashboard', 'products'],
    canManageTeam: false,
    canExportData: false,
    canDeleteRecords: false,
  },
};

export const ALL_ADMIN_TABS: { id: AdminTab; label: string; icon: string; description: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', description: 'Executive sales metrics, conversion rates, and revenue KPIs' },
  { id: 'users', label: 'Registered Users', icon: 'Users', description: 'Complete customer patron registry, order history, and team roles' },
  { id: 'products', label: 'Products & SKUs', icon: 'Package', description: 'Fragrance flacons, candle jars, pricing, and stock inventory' },
  { id: 'orders', label: 'Delivery & Orders', icon: 'Truck', description: 'Customer orders, dispatch statuses, and payment tracking' },
  { id: 'banners', label: 'Banners & Media', icon: 'ImageIcon', description: 'Hero section, creative editorial slides, and brand videos' },
  { id: 'offers', label: 'Offers & Discounts', icon: 'Tag', description: 'Promotional discount coupons, thresholds, and bundle deals' },
  { id: 'sync', label: 'Data Sync', icon: 'RefreshCw', description: 'Database synchronization, catalog reset, and backup exports' },
  { id: 'whatsapp', label: 'WhatsApp Automation', icon: 'MessageSquare', description: 'Automated order alerts, welcome pings, and bulk broadcasts' },
];

export interface AdminTeamUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  password?: string;
  phone?: string;
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'suspended';
  customAllowedTabs?: AdminTab[];
}

export const INITIAL_TEAM_MEMBERS: AdminTeamUser[] = [
  {
    id: 'team_super_admin',
    name: 'Master Administrator',
    email: 'nooreflamesadmin@gmail.com',
    role: 'administrator',
    password: 'nooreflames',
    phone: '+919289289800',
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active',
  },
  {
    id: 'team_editor',
    name: 'Catalog & Store Editor',
    email: 'editor@nooreflames.com',
    role: 'editor',
    password: 'nooreflames',
    phone: '+919289289800',
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active',
  },
  {
    id: 'team_content',
    name: 'Brand & Creative Lead',
    email: 'content@nooreflames.com',
    role: 'content_manager',
    password: 'nooreflames',
    phone: '+919289289800',
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active',
  },
  {
    id: 'team_operations',
    name: 'Logistics & Support Lead',
    email: 'operations@nooreflames.com',
    role: 'operations',
    password: 'nooreflames',
    phone: '+919289289800',
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active',
  },
];

export const DEFAULT_ROLE_PERMISSIONS: Record<AdminRole, AdminTab[]> = {
  administrator: ['dashboard', 'users', 'products', 'orders', 'banners', 'offers', 'sync', 'whatsapp'],
  editor: ['products', 'orders', 'offers', 'sync'],
  content_manager: ['banners', 'products', 'offers'],
  operations: ['dashboard', 'orders', 'users', 'whatsapp'],
  viewer: ['dashboard', 'products'],
};

export function getAllowedTabsForRole(
  role: AdminRole,
  customTabs?: AdminTab[],
  rolePermissions?: Record<AdminRole, AdminTab[]>
): AdminTab[] {
  // Master Administrator always has full unrestricted access
  if (role === 'administrator') {
    return ['dashboard', 'users', 'products', 'orders', 'banners', 'offers', 'sync', 'whatsapp'];
  }
  // Check individual user custom override
  if (customTabs && customTabs.length > 0) {
    return customTabs;
  }
  // Check dynamically stored role permissions from admin panel
  if (rolePermissions && Array.isArray(rolePermissions[role])) {
    return rolePermissions[role];
  }
  return DEFAULT_ROLE_PERMISSIONS[role] || ROLE_DEFINITIONS[role]?.allowedTabs || [];
}

export function canRoleAccessTab(
  role: AdminRole,
  tab: AdminTab,
  customTabs?: AdminTab[],
  rolePermissions?: Record<AdminRole, AdminTab[]>
): boolean {
  const allowed = getAllowedTabsForRole(role, customTabs, rolePermissions);
  return allowed.includes(tab);
}
