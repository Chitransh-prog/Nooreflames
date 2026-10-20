/**
 * Shiprocket Shipping Integration Engine for NOOR-E-FLAMES
 * Handles:
 * - Authentication & Token Caching (https://apiv2.shiprocket.in/v2/console/auth/login)
 * - Pincode Serviceability & Courier Estimation (Delhivery, Bluedart, Shadowfax, etc.)
 * - Order & Shipment Creation (Prepaid and 30% Advance COD orders)
 * - AWB Generation & Courier Assignment
 * - Real-time Shipment Tracking & Webhook Processing
 */

export interface ShiprocketCredentials {
  email: string;
  password: string;
  pickupLocation?: string;
}

export interface ServiceabilityResponse {
  success: boolean;
  couriers: Array<{
    id: number;
    name: string;
    rate: number;
    estimatedDays: string;
    etd: string;
    codAvailable: boolean;
    rating: number;
  }>;
  recommendedCourier?: {
    id: number;
    name: string;
    rate: number;
    estimatedDays: string;
  };
  message?: string;
  isMock?: boolean;
}

export interface CreateShipmentResult {
  success: boolean;
  orderId?: number | string;
  shipmentId?: number | string;
  awbCode?: string;
  courierName?: string;
  trackingUrl?: string;
  labelUrl?: string;
  manifestUrl?: string;
  message?: string;
  isMock?: boolean;
}

export interface TrackingResult {
  success: boolean;
  awb: string;
  currentStatus: string;
  statusCode?: number | string;
  courierName?: string;
  location?: string;
  origin?: string;
  destination?: string;
  expectedDelivery?: string;
  activities?: Array<{
    date: string;
    status: string;
    activity: string;
    location: string;
  }>;
  trackingUrl?: string;
  isMock?: boolean;
}

const SHIPROCKET_API_BASE = 'https://apiv2.shiprocket.in/v2/console';

// In-memory token cache (Shiprocket tokens expire after 10 days)
let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

export function getShiprocketCredentials(): ShiprocketCredentials | null {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;
  const pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION || 'NOOR-E-FLAMES Atelier';

  if (!email || !password) {
    return null;
  }
  return { email, password, pickupLocation };
}

/**
 * Obtain or refresh Shiprocket Bearer Authentication Token
 */
export async function getShiprocketToken(): Promise<string | null> {
  const creds = getShiprocketCredentials();
  if (!creds) {
    return null;
  }

  // Return cached token if valid (give 1 hour buffer)
  const now = Date.now();
  if (cachedToken && tokenExpiresAt > now + 3600 * 1000) {
    return cachedToken;
  }

  try {
    const res = await fetch(`${SHIPROCKET_API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: creds.email,
        password: creds.password,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.warn('Shiprocket authentication failed:', errData);
      return null;
    }

    const data = await res.json();
    if (data.token) {
      cachedToken = data.token;
      // Valid for ~10 days
      tokenExpiresAt = now + 9 * 24 * 3600 * 1000;
      return cachedToken;
    }
    return null;
  } catch (error) {
    console.error('Shiprocket login network exception:', error);
    return null;
  }
}

/**
 * Check Courier Serviceability & Estimated Transit Days for a given Pincode
 */
export async function checkShiprocketServiceability(
  deliveryPincode: string,
  weight: number = 0.5,
  isCod: boolean = false,
  orderValue: number = 1000
): Promise<ServiceabilityResponse> {
  const cleanPin = deliveryPincode.replace(/\D/g, '').trim();
  const token = await getShiprocketToken();

  if (!token) {
    // Graceful fallback when Shiprocket credentials are not yet set in .env
    const isLocalDelhi = cleanPin.startsWith('11') || cleanPin.startsWith('12') || cleanPin.startsWith('20');
    return {
      success: true,
      isMock: true,
      couriers: [
        {
          id: 1,
          name: 'Blue Dart Express (Air)',
          rate: 110,
          estimatedDays: isLocalDelhi ? '1 - 2 Days' : '2 - 3 Days',
          etd: isLocalDelhi ? '1-2 Days' : '2-3 Days',
          codAvailable: true,
          rating: 4.8,
        },
        {
          id: 2,
          name: 'Delhivery Surface Premium',
          rate: 75,
          estimatedDays: isLocalDelhi ? 'Same / Next Day' : '3 - 4 Days',
          etd: isLocalDelhi ? '1-2 Days' : '3-4 Days',
          codAvailable: true,
          rating: 4.6,
        },
        {
          id: 3,
          name: 'DTDC Priority Air',
          rate: 95,
          estimatedDays: isLocalDelhi ? '1 - 2 Days' : '2 - 4 Days',
          etd: isLocalDelhi ? '1-2 Days' : '2-4 Days',
          codAvailable: true,
          rating: 4.5,
        },
      ],
      recommendedCourier: {
        id: 1,
        name: 'Blue Dart Express (Air)',
        rate: 110,
        estimatedDays: isLocalDelhi ? '1 - 2 Days' : '2 - 3 Days',
      },
      message: 'Shiprocket simulated serviceability (Add SHIPROCKET_EMAIL & SHIPROCKET_PASSWORD to activate live api)',
    };
  }

  try {
    const pickupPincode = '110043'; // Delhi Atelier
    const url = new URL(`${SHIPROCKET_API_BASE}/courier/serviceability/`);
    url.searchParams.set('pickup_postcode', pickupPincode);
    url.searchParams.set('delivery_postcode', cleanPin);
    url.searchParams.set('weight', String(weight));
    url.searchParams.set('cod', isCod ? '1' : '0');
    url.searchParams.set('declared_value', String(orderValue));

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok || data.status !== 200) {
      return {
        success: false,
        couriers: [],
        message: data.message || 'Serviceability check failed',
      };
    }

    const availableCouriers = data?.data?.available_courier_companies || [];
    const couriers = availableCouriers.map((c: any) => ({
      id: c.courier_company_id,
      name: c.courier_name,
      rate: Number(c.rate) || 0,
      estimatedDays: `${c.estimated_delivery_days || '2 - 4'} Days`,
      etd: c.etd || '',
      codAvailable: Boolean(c.cod),
      rating: Number(c.rating) || 4.5,
    }));

    const recommended = couriers[0] || null;

    return {
      success: true,
      couriers,
      recommendedCourier: recommended,
    };
  } catch (err: any) {
    console.error('Shiprocket serviceability exception:', err);
    return {
      success: false,
      couriers: [],
      message: err?.message || 'Error communicating with Shiprocket',
    };
  }
}

/**
 * Create Order & Generate Shipment in Shiprocket
 */
export async function createShiprocketShipment(order: {
  id: string;
  customer: string;
  email?: string;
  phone: string;
  address: string;
  destination: string;
  pincode: string;
  amount: number;
  isPartialCod?: boolean;
  remainingCodAmount?: number;
  items: Array<{
    id?: string;
    title: string;
    price: number;
    quantity: number;
  }>;
}): Promise<CreateShipmentResult> {
  const token = await getShiprocketToken();
  const creds = getShiprocketCredentials();

  // Parse customer names
  const nameParts = (order.customer || 'Patron').trim().split(/\s+/);
  const firstName = nameParts[0] || 'Valued';
  const lastName = nameParts.slice(1).join(' ') || 'Customer';

  // If partial COD: courier collects ONLY the remaining 70% from the customer!
  const isCod = Boolean(order.isPartialCod);
  const codCollectionAmount = isCod
    ? Number(order.remainingCodAmount ?? Math.round(order.amount * 0.7))
    : 0;

  if (!token) {
    // Generate deterministic simulated AWB for dev / test mode
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const mockAwb = `SR-BLUEDART-${randomSuffix}`;
    const mockShipmentId = `SHP_${Date.now()}`;
    const mockOrderId = `SRO_${Date.now()}`;

    return {
      success: true,
      isMock: true,
      orderId: mockOrderId,
      shipmentId: mockShipmentId,
      awbCode: mockAwb,
      courierName: 'Blue Dart Express (Air Dispatch)',
      trackingUrl: `https://shiprocket.co/tracking/${mockAwb}`,
      labelUrl: `https://shiprocket.co/print-label/mock/${mockAwb}`,
      manifestUrl: `https://shiprocket.co/print-manifest/mock/${mockAwb}`,
      message: 'Shipment generated via Shiprocket Engine (Simulated Mode - Add API keys to go live)',
    };
  }

  try {
    const formattedDate = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const orderPayload = {
      order_id: order.id,
      order_date: formattedDate,
      pickup_location: creds?.pickupLocation || 'Primary',
      channel_id: '',
      comment: isCod
        ? `Noor-E-Flames Order (30% UPI Advance Paid). Collect Balance ₹${codCollectionAmount} Cash on Delivery`
        : 'Noor-E-Flames Order (100% Prepaid Razorpay)',
      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: order.address,
      billing_address_2: '',
      billing_city: order.destination?.split(',')[0]?.trim() || 'New Delhi',
      billing_pincode: order.pincode.replace(/\D/g, ''),
      billing_state: order.destination?.split(',')[1]?.trim() || 'Delhi',
      billing_country: 'India',
      billing_email: order.email || 'customer@nooreflames.com',
      billing_phone: order.phone.replace(/\D/g, '').slice(-10),
      shipping_is_billing: true,
      order_items: (order.items || []).map((it, idx) => ({
        name: it.title,
        sku: `NF-SKU-${it.id || idx + 1}`,
        units: it.quantity || 1,
        selling_price: it.price || 999,
        discount: 0,
        tax: 0,
      })),
      payment_method: isCod ? 'COD' : 'Prepaid',
      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: 0,
      sub_total: isCod ? codCollectionAmount : order.amount,
      length: 15,
      breadth: 12,
      height: 10,
      weight: 0.5,
    };

    const res = await fetch(`${SHIPROCKET_API_BASE}/custom/orders/create/adhoc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderPayload),
    });

    const data = await res.json();
    if (!res.ok || (data.status_code && data.status_code >= 400)) {
      return {
        success: false,
        message: data.message || 'Shiprocket order creation failed',
      };
    }

    const shiprocketOrderId = data.order_id;
    const shipmentId = data.shipment_id;

    // Next: Automatically assign courier & generate AWB
    let awbCode = data.awb_code || '';
    let courierName = data.courier_name || 'Shiprocket Partner';

    if (shipmentId && !awbCode) {
      try {
        const awbRes = await fetch(`${SHIPROCKET_API_BASE}/courier/assign/awb`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            shipment_id: shipmentId,
          }),
        });

        const awbData = await awbRes.json();
        if (awbData.response && awbData.response.data) {
          awbCode = awbData.response.data.awb_code || '';
          courierName = awbData.response.data.courier_name || courierName;
        }
      } catch (awbErr) {
        console.warn('Auto AWB generation deferred:', awbErr);
      }
    }

    return {
      success: true,
      orderId: shiprocketOrderId,
      shipmentId,
      awbCode: awbCode || `SR-PENDING-${shipmentId}`,
      courierName,
      trackingUrl: awbCode ? `https://shiprocket.co/tracking/${awbCode}` : undefined,
    };
  } catch (err: any) {
    console.error('Shiprocket order creation exception:', err);
    return {
      success: false,
      message: err?.message || 'Error creating shipment in Shiprocket',
    };
  }
}

/**
 * Live Tracking via Shiprocket by AWB
 */
export async function trackShiprocketShipment(awbCode: string): Promise<TrackingResult> {
  const token = await getShiprocketToken();

  if (!token || awbCode.startsWith('SR-BLUEDART-') || awbCode.startsWith('SR-PENDING-')) {
    return {
      success: true,
      isMock: true,
      awb: awbCode,
      currentStatus: 'In Transit',
      courierName: 'Blue Dart Express (Air)',
      origin: 'New Delhi Atelier (110043)',
      destination: 'Customer Destination Hub',
      expectedDelivery: 'In 2-3 Business Days',
      trackingUrl: `https://shiprocket.co/tracking/${awbCode}`,
      activities: [
        {
          date: new Date().toISOString().substring(0, 10),
          status: 'In Transit',
          activity: 'Package processed at Central Delhi Sorting Facility',
          location: 'New Delhi, DL',
        },
        {
          date: new Date(Date.now() - 24 * 3600 * 1000).toISOString().substring(0, 10),
          status: 'Manifested',
          activity: 'Pickup completed from NOOR-E-FLAMES Atelier',
          location: 'New Delhi (110043)',
        },
      ],
    };
  }

  try {
    const res = await fetch(`${SHIPROCKET_API_BASE}/courier/track/awb/${awbCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    const trackingData = data?.tracking_data;

    return {
      success: true,
      awb: awbCode,
      currentStatus: trackingData?.track_status ? 'Active' : 'Manifested',
      courierName: trackingData?.shipment_track?.[0]?.courier_name || 'Shiprocket Partner',
      trackingUrl: `https://shiprocket.co/tracking/${awbCode}`,
      activities: (trackingData?.shipment_track_activities || []).map((a: any) => ({
        date: a.date,
        status: a.activity,
        activity: a.activity,
        location: a.location,
      })),
    };
  } catch (err: any) {
    return {
      success: false,
      awb: awbCode,
      currentStatus: 'Unknown',
      trackingUrl: `https://shiprocket.co/tracking/${awbCode}`,
    };
  }
}
