import { NextResponse } from 'next/server';
import { getStoreDataAsync, saveStoreData } from '@/lib/store';
import { sendPersonalizedWelcomeWhatsApp } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const store = await getStoreDataAsync();
    const customers = store.customers || [];
    return NextResponse.json({
      success: true,
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
    const { name, email, phone } = body;

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
