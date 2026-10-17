import { NextResponse } from 'next/server';
import { getAdminSession, ADMIN_EMAIL } from '@/lib/adminAuth';
import { getStoreDataAsync, saveStoreData } from '@/lib/store';
import {
  AdminRole,
  AdminTeamUser,
  INITIAL_TEAM_MEMBERS,
  ROLE_DEFINITIONS,
  getAllowedTabsForRole,
} from '@/lib/rbac';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET: Retrieve team members and role definitions
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

    // Attach computed allowed tabs and role info
    const enriched = teamMembers.map((m) => {
      const allowedTabs = getAllowedTabsForRole(m.role, m.customAllowedTabs);
      const roleDef = ROLE_DEFINITIONS[m.role] || ROLE_DEFINITIONS.administrator;
      // Do not leak plaintext password over API
      const { password, ...safeMember } = m;
      return {
        ...safeMember,
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
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

// POST: Add new team member or update role/status
export async function POST(request: Request) {
  try {
    const session = getAdminSession(request);
    if (!session.authenticated || !session.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Only administrators can manage team roles
    if (session.user.role !== 'administrator') {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Only Administrators can configure team roles.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, name, email, role, password, phone, status, customAllowedTabs } = body;

    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!cleanEmail) {
      return NextResponse.json(
        { success: false, message: 'Email address is required.' },
        { status: 400 }
      );
    }

    const targetRole: AdminRole = ROLE_DEFINITIONS[role as AdminRole]
      ? (role as AdminRole)
      : 'editor';

    const store = await getStoreDataAsync();
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
      message: `Team member ${savedMember.name} (${savedMember.role}) saved successfully`,
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
      message: 'Team member removed successfully',
      remaining: filtered.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to delete team member' },
      { status: 500 }
    );
  }
}
