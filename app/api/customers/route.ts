import { NextResponse } from 'next/server';
import { getStoreDataAsync, saveStoreData } from '@/lib/store';
import { sendPersonalizedWelcomeWhatsApp } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const store = await getStoreDataAsync();
    const rawCustomers: any[] = Array.isArray(store.customers) ? store.customers : [];
    const orders: any[] = Array.isArray(store.orders) ? store.orders : [];

    const customerMap = new Map<string, any>();

    // 1. Load registered customer accounts
    for (const c of rawCustomers) {
      let cleanPhone = String(c.phone || '').replace(/\D/g, '');
      if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) cleanPhone = cleanPhone.slice(1);
      if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) cleanPhone = cleanPhone.slice(2);
      if (cleanPhone.length > 10) cleanPhone = cleanPhone.slice(-10);

      const cleanEmail = String(c.email || '').trim().toLowerCase();
      const key = cleanPhone || cleanEmail || c.id;

      if (key) {
        customerMap.set(key, {
          ...c,
          phone: cleanPhone || c.phone || '',
          hasValidPhone: cleanPhone.length === 10,
        });
      }
    }

    // 2. Discover patrons from completed/checkout orders who gave their phone number
    let hasNewDiscovered = false;
    for (const o of orders) {
      let oPhone = String(o.phone || '').replace(/\D/g, '');
      if (oPhone.length === 11 && oPhone.startsWith('0')) oPhone = oPhone.slice(1);
      if (oPhone.length === 12 && oPhone.startsWith('91')) oPhone = oPhone.slice(2);
      if (oPhone.length > 10) oPhone = oPhone.slice(-10);

      const oEmail = String(o.email || o.customerEmail || '').trim().toLowerCase();
      const oName = String(o.customer || o.customerName || o.name || '').trim();
      const key = oPhone || oEmail;

      if (key && !customerMap.has(key)) {
        const newRecord = {
          id: 'cust_ord_' + (o.id || Date.now()),
          name: oName || (oEmail ? oEmail.split('@')[0] : 'Valued Patron'),
          email: oEmail,
          phone: oPhone,
          createdAt: o.createdAt || new Date().toISOString(),
          welcomeSent: true,
          hasValidPhone: oPhone.length === 10,
        };
        customerMap.set(key, newRecord);
        rawCustomers.push(newRecord);
        hasNewDiscovered = true;
      } else if (key && oPhone && customerMap.has(key)) {
        const existing = customerMap.get(key);
        if (!existing.phone || existing.phone.length < 10) {
          existing.phone = oPhone;
          existing.hasValidPhone = oPhone.length === 10;
          hasNewDiscovered = true;
        }
      }
    }

    // Persist discovered order customers to store so they are permanently in the database
    if (hasNewDiscovered) {
      store.customers = rawCustomers;
      saveStoreData(store).catch((err) => console.warn('Background customer merge save skipped:', err));
    }

    const customers = Array.from(customerMap.values()).map((c) => {
      const cleanPhone = String(c.phone || '').replace(/\D/g, '').slice(-10);
      const cleanEmail = String(c.email || '').trim().toLowerCase();

      // Find all orders placed by this customer
      const userOrders = orders.filter((o) => {
        const oPhone = String(o.phone || '').replace(/\D/g, '').slice(-10);
        const oEmail = String(o.email || o.customerEmail || '').trim().toLowerCase();
        return (cleanPhone && oPhone === cleanPhone) || (cleanEmail && oEmail === cleanEmail);
      });

      const totalSpend = userOrders.reduce((acc, curr) => acc + (Number(curr.amount || curr.total || 0)), 0);
      const lastOrder = userOrders.length > 0 ? userOrders[userOrders.length - 1] : null;
      const address = c.address || lastOrder?.address || '';
      const pincode = c.pincode || lastOrder?.pincode || '';

      return {
        ...c,
        phone: cleanPhone || c.phone || '',
        hasValidPhone: cleanPhone.length === 10,
        ordersCount: userOrders.length,
        totalSpend,
        lastOrderDate: lastOrder?.createdAt || null,
        lastOrderId: lastOrder?.id || null,
        address,
        pincode,
        orders: userOrders,
      };
    });

    return NextResponse.json({
      success: true,
      total: customers.length,
      withPhone: customers.filter((c) => c.hasValidPhone).length,
      customers,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, address, pincode } = body;

    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanName = String(name || '').trim() || (cleanEmail ? cleanEmail.split('@')[0] : 'Valued Patron');
    
    // Normalize phone to standard 10 digits
    let cleanPhone = String(phone || '').replace(/\D/g, '');
    if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
      cleanPhone = cleanPhone.slice(1);
    }
    if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
      cleanPhone = cleanPhone.slice(2);
    }

    if (!cleanEmail) {
      return NextResponse.json(
        { success: false, message: 'Email address is required' },
        { status: 400 }
      );
    }

    const store = await getStoreDataAsync();
    const customers: any[] = Array.isArray(store.customers) ? store.customers : [];

    // Check if customer already exists by email or phone
    const existingIndex = customers.findIndex(
      (c) => c.email?.toLowerCase() === cleanEmail || (cleanPhone && c.phone === cleanPhone)
    );

    let customerRecord: any;
    let isNewCustomer = false;

    if (existingIndex !== -1) {
      // Update existing record
      customers[existingIndex] = {
        ...customers[existingIndex],
        name: cleanName,
        phone: cleanPhone || customers[existingIndex].phone || '',
        address: address || customers[existingIndex].address || '',
        pincode: pincode || customers[existingIndex].pincode || '',
        updatedAt: new Date().toISOString(),
      };
      customerRecord = customers[existingIndex];
    } else {
      isNewCustomer = true;
      customerRecord = {
        id: 'cust_' + Date.now(),
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        address: address || '',
        pincode: pincode || '',
        createdAt: new Date().toISOString(),
        welcomeSent: false,
      };
      customers.push(customerRecord);
    }

    // Persist to database & file
    store.customers = customers;
    await saveStoreData(store);

    // Send automated personalized WhatsApp Welcome message if phone provided
    let whatsappResult = null;
    if (cleanPhone && cleanPhone.length >= 10) {
      try {
        whatsappResult = await sendPersonalizedWelcomeWhatsApp({
          name: cleanName,
          phone: cleanPhone,
        });

        if (whatsappResult?.success) {
          customerRecord.welcomeSent = true;
          await saveStoreData(store);
        }
      } catch (waErr) {
        console.error('Failed to dispatch welcome WhatsApp message:', waErr);
      }
    }

    return NextResponse.json({
      success: true,
      isNewCustomer,
      customer: customerRecord,
      whatsappResult,
    });
  } catch (err: any) {
    console.error('Customer registration error:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Server error creating customer' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetId = searchParams.get('id');
    const targetEmail = searchParams.get('email')?.toLowerCase();
    const targetPhone = searchParams.get('phone');

    if (!targetId && !targetEmail && !targetPhone) {
      return NextResponse.json(
        { success: false, message: 'Provide id, email, or phone to delete' },
        { status: 400 }
      );
    }

    const store = await getStoreDataAsync();
    const customers: any[] = Array.isArray(store.customers) ? store.customers : [];

    const initialLength = customers.length;
    const filtered = customers.filter((c) => {
      if (targetId && c.id === targetId) return false;
      if (targetEmail && c.email?.toLowerCase() === targetEmail) return false;
      if (targetPhone && c.phone === targetPhone) return false;
      return true;
    });

    if (filtered.length === initialLength) {
      return NextResponse.json(
        { success: false, message: 'Customer not found' },
        { status: 404 }
      );
    }

    store.customers = filtered;
    await saveStoreData(store);

    return NextResponse.json({
      success: true,
      message: 'Customer deleted successfully',
      remaining: filtered.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
