import { NextResponse } from 'next/server';
import { getAdminSession, ADMIN_EMAIL } from '@/lib/adminAuth';
import { getStoreDataAsync, saveStoreData } from '@/lib/store';
import {
  AdminRole,
  AdminTab,
  AdminTeamUser,
  INITIAL_TEAM_MEMBERS,
  ROLE_DEFINITIONS,
  ALL_ADMIN_TABS,
  DEFAULT_ROLE_PERMISSIONS,
  getAllowedTabsForRole,
} from '@/lib/rbac';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET: Retrieve team members, role definitions, and customizable role permissions
export async function GET(request: Request) {
  try {
    const session = getAdminSession(request);
    if (!session.authenticated || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized session' },
        { status: 401 }
      );
    }

    const store = await getStoreDataAsync();
    const teamMembers: AdminTeamUser[] =
      Array.isArray(store.adminUsers) && store.adminUsers.length > 0
        ? store.adminUsers
        : INITIAL_TEAM_MEMBERS;

    const currentRolePermissions = store.rolePermissions || DEFAULT_ROLE_PERMISSIONS;

    // Attach computed allowed tabs, username, and role info (passwords included for administrator management)
    const enriched = teamMembers.map((m) => {
      const allowedTabs = getAllowedTabsForRole(m.role, m.customAllowedTabs, currentRolePermissions);
      const roleDef = ROLE_DEFINITIONS[m.role] || ROLE_DEFINITIONS.administrator;
      return {
        ...m,
        username: m.username || m.email.split('@')[0],
        password: m.password || 'nooreflames',
        allowedTabs,
        roleName: roleDef.name,
        roleBadge: roleDef.badge,
        roleColor: roleDef.color,
        roleEmoji: roleDef.emoji,
      };
    });

    return NextResponse.json({
      success: true,
      currentUser: session.user,
      teamMembers: enriched,
      roleDefinitions: ROLE_DEFINITIONS,
      rolePermissions: currentRolePermissions,
      allTabs: ALL_ADMIN_TABS,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

// POST: Add new team member, update role/status/custom tabs, or update role permissions matrix
export async function POST(request: Request) {
  try {
    const session = getAdminSession(request);
    if (!session.authenticated || !session.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Only administrators can manage team roles and permissions
    if (session.user.role !== 'administrator') {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Only Administrators can configure team roles and permissions.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const store = await getStoreDataAsync();

    // 1. Action: Bulk update customizable role permissions matrix
    if (body.action === 'update_role_permissions' || body.rolePermissions) {
      const incoming = (body.rolePermissions || {}) as Record<AdminRole, AdminTab[]>;
      const sanitized: Record<AdminRole, AdminTab[]> = {
        ...DEFAULT_ROLE_PERMISSIONS,
        ...incoming,
        // Master Administrator ALWAYS retains all tabs including 'roles'
        administrator: ['dashboard', 'users', 'products', 'orders', 'banners', 'offers', 'sync', 'whatsapp', 'roles'],
      };

      store.rolePermissions = sanitized;
      await saveStoreData(store);

      return NextResponse.json({
        success: true,
        message: 'Role tab access permissions updated successfully!',
        rolePermissions: sanitized,
      });
    }

    // 2. Action: Reset role permissions matrix to default presets
    if (body.action === 'reset_role_permissions') {
      store.rolePermissions = DEFAULT_ROLE_PERMISSIONS;
      await saveStoreData(store);

      return NextResponse.json({
        success: true,
        message: 'Role permissions reset to factory defaults.',
        rolePermissions: DEFAULT_ROLE_PERMISSIONS,
      });
    }

    // 3. Action: Create or update individual team member
    const { id, name, username, email, role, password, phone, status, customAllowedTabs } = body;

    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!cleanEmail) {
      return NextResponse.json(
        { success: false, message: 'Email address is required.' },
        { status: 400 }
      );
    }

    const cleanUsername = String(username || '').trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '');

    const targetRole: AdminRole = ROLE_DEFINITIONS[role as AdminRole]
      ? (role as AdminRole)
      : 'editor';

    const teamList: AdminTeamUser[] =
      Array.isArray(store.adminUsers) && store.adminUsers.length > 0
        ? [...store.adminUsers]
        : [...INITIAL_TEAM_MEMBERS];

    const existingIndex = teamList.findIndex(
      (m) => (id && m.id === id) || m.email.toLowerCase() === cleanEmail
    );

    let savedMember: AdminTeamUser;

    if (existingIndex >= 0) {
      // Prevent demoting the master administrator
      const target = teamList[existingIndex];
      const isMasterAdmin =
        target.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() || target.id === 'team_super_admin';

      if (isMasterAdmin && targetRole !== 'administrator') {
        return NextResponse.json(
          { success: false, message: 'The primary Master Administrator cannot be reassigned or demoted.' },
          { status: 400 }
        );
      }

      teamList[existingIndex] = {
        ...target,
        name: name ? String(name).trim() : target.name,
        username: cleanUsername || target.username || target.email.split('@')[0],
        role: targetRole,
        phone: phone ? String(phone).trim() : target.phone,
        status: status === 'suspended' ? 'suspended' : 'active',
        customAllowedTabs: Array.isArray(customAllowedTabs) ? customAllowedTabs : target.customAllowedTabs,
        ...(password && String(password).trim() ? { password: String(password).trim() } : {}),
      };
      savedMember = teamList[existingIndex];
    } else {
      // Create new team member
      const newId = `team_${Date.now()}`;
      savedMember = {
        id: newId,
        name: String(name || '').trim() || cleanEmail.split('@')[0],
        username: cleanUsername || cleanEmail.split('@')[0],
        email: cleanEmail,
        role: targetRole,
        password: password ? String(password).trim() : 'nooreflames',
        phone: phone ? String(phone).trim() : '+919289289800',
        createdAt: new Date().toISOString(),
        status: 'active',
        customAllowedTabs: Array.isArray(customAllowedTabs) ? customAllowedTabs : undefined,
      };
      teamList.push(savedMember);
    }

    store.adminUsers = teamList;
    await saveStoreData(store);

    return NextResponse.json({
      success: true,
      message: `Staff member ${savedMember.name} (@${savedMember.username}) saved successfully`,
      member: savedMember,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to update team member' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a team member
export async function DELETE(request: Request) {
  try {
    const session = getAdminSession(request);
    if (!session.authenticated || !session.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'administrator') {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Only Administrators can remove team members.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const targetId = searchParams.get('id');
    const targetEmail = searchParams.get('email')?.toLowerCase();

    if (!targetId && !targetEmail) {
      return NextResponse.json(
        { success: false, message: 'Provide id or email to delete' },
        { status: 400 }
      );
    }

    // Prevent deleting master admin
    if (
      targetEmail === ADMIN_EMAIL.toLowerCase() ||
      targetId === 'team_super_admin'
    ) {
      return NextResponse.json(
        { success: false, message: 'The primary Master Administrator cannot be removed.' },
        { status: 400 }
      );
    }

    const store = await getStoreDataAsync();
    const teamList: AdminTeamUser[] =
      Array.isArray(store.adminUsers) && store.adminUsers.length > 0
        ? [...store.adminUsers]
        : [...INITIAL_TEAM_MEMBERS];

    const filtered = teamList.filter(
      (m) =>
        !(
          (targetId && m.id === targetId) ||
          (targetEmail && m.email.toLowerCase() === targetEmail)
        )
    );

    if (filtered.length === teamList.length) {
      return NextResponse.json(
        { success: false, message: 'Team member not found' },
        { status: 404 }
      );
    }

    store.adminUsers = filtered;
    await saveStoreData(store);

    return NextResponse.json({
      success: true,
      message: 'Staff member removed successfully',
      remaining: filtered.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to delete team member' },
      { status: 500 }
    );
  }
}
