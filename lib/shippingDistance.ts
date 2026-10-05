/**
 * Distance & COD Advance Calculator for NOOR-E-FLAMES
 * Origin: Atelier & Central Distribution Hub — NEW DELHI - 110043
 *
 * Implements intelligent zone and distance tracking based on India's 6-digit PIN code system,
 * calculating accurate transit distances (KM) and distance-calibrated UPI advance deposits
 * required to confirm Cash on Delivery orders.
 */

export interface DeliveryZoneInfo {
  pincode: string;
  distanceKm: number;
  zoneName: string;
  region: string;
  advanceAmount: number;
  remainingCodAmount: number;
  estimatedDays: string;
  originStore: string;
  isEligibleForCod: boolean;
}

export const ATELIER_ORIGIN = {
  city: 'New Delhi',
  state: 'Delhi',
  pincode: '110043',
  label: 'NOOR-E-FLAMES Atelier (New Delhi - 110043)',
};

interface ZoneRule {
  prefixes: string[];
  distanceKm: number;
  zoneName: string;
  region: string;
  advanceAmount: number;
  estimatedDays: string;
}

const ZONE_RULES: ZoneRule[] = [
  // 1. Delhi NCR (Local Zone - 15 to 45 KM)
  {
    prefixes: ['11'],
    distanceKm: 32,
    zoneName: 'Delhi Local / NCR',
    region: 'Delhi Metro',
    advanceAmount: 99,
    estimatedDays: 'Same / Next Day',
  },
  // 2. Immediate NCR (Gurugram, Faridabad, Sonipat, Noida, Ghaziabad)
  {
    prefixes: ['12', '13'],
    distanceKm: 95,
    zoneName: 'Delhi NCR (Haryana Region)',
    region: 'NCR North / West',
    advanceAmount: 129,
    estimatedDays: '1 - 2 Days',
  },
  {
    prefixes: ['20'],
    distanceKm: 68,
    zoneName: 'Delhi NCR (Western UP / Noida / Gzb)',
    region: 'NCR East',
    advanceAmount: 129,
    estimatedDays: '1 - 2 Days',
  },
  // 3. Punjab & Chandigarh
  {
    prefixes: ['14', '15', '16'],
    distanceKm: 320,
    zoneName: 'Punjab & Chandigarh',
    region: 'North Zone',
    advanceAmount: 149,
    estimatedDays: '2 - 3 Days',
  },
  // 4. Himachal Pradesh, Jammu & Kashmir, Ladakh
  {
    prefixes: ['17', '18', '19'],
    distanceKm: 640,
    zoneName: 'Himalayan Belt (HP, J&K, Ladakh)',
    region: 'North Zone (Hills)',
    advanceAmount: 179,
    estimatedDays: '3 - 5 Days',
  },
  // 5. Central & Eastern Uttar Pradesh, Uttarakhand
  {
    prefixes: ['21', '22', '23', '24', '25', '26', '27', '28'],
    distanceKm: 520,
    zoneName: 'Uttar Pradesh & Uttarakhand',
    region: 'North-Central Zone',
    advanceAmount: 159,
    estimatedDays: '2 - 4 Days',
  },
  // 6. Rajasthan
  {
    prefixes: ['30', '31', '32', '33', '34'],
    distanceKm: 420,
    zoneName: 'Rajasthan',
    region: 'West-North Zone',
    advanceAmount: 169,
    estimatedDays: '2 - 4 Days',
  },
  // 7. Gujarat
  {
    prefixes: ['36', '37', '38', '39'],
    distanceKm: 980,
    zoneName: 'Gujarat',
    region: 'West Zone',
    advanceAmount: 189,
    estimatedDays: '3 - 4 Days',
  },
  // 8. Maharashtra & Goa
  {
    prefixes: ['40', '41', '42', '43', '44'],
    distanceKm: 1380,
    zoneName: 'Maharashtra & Goa (Mumbai / Pune)',
    region: 'West Zone',
    advanceAmount: 199,
    estimatedDays: '3 - 5 Days',
  },
  // 9. Madhya Pradesh & Chhattisgarh
  {
    prefixes: ['45', '46', '47', '48', '49'],
    distanceKm: 850,
    zoneName: 'Madhya Pradesh & Chhattisgarh',
    region: 'Central Zone',
    advanceAmount: 189,
    estimatedDays: '3 - 4 Days',
  },
  // 10. Telangana & Andhra Pradesh
  {
    prefixes: ['50', '51', '52', '53'],
    distanceKm: 1540,
    zoneName: 'Telangana & Andhra Pradesh (Hyderabad)',
    region: 'South Zone',
    advanceAmount: 219,
    estimatedDays: '4 - 5 Days',
  },
  // 11. Karnataka
  {
    prefixes: ['56', '57', '58', '59'],
    distanceKm: 1920,
    zoneName: 'Karnataka (Bengaluru / Mysuru)',
    region: 'South Zone',
    advanceAmount: 219,
    estimatedDays: '4 - 5 Days',
  },
  // 12. Tamil Nadu & Puducherry
  {
    prefixes: ['60', '61', '62', '63', '64'],
    distanceKm: 2180,
    zoneName: 'Tamil Nadu & Puducherry (Chennai)',
    region: 'South Zone',
    advanceAmount: 229,
    estimatedDays: '4 - 6 Days',
  },
  // 13. Kerala & Lakshadweep
  {
    prefixes: ['67', '68', '69'],
    distanceKm: 2450,
    zoneName: 'Kerala & Lakshadweep (Kochi / Trivandrum)',
    region: 'South Zone',
    advanceAmount: 229,
    estimatedDays: '4 - 6 Days',
  },
  // 14. West Bengal
  {
    prefixes: ['70', '71', '72', '73', '74'],
    distanceKm: 1450,
    zoneName: 'West Bengal (Kolkata)',
    region: 'East Zone',
    advanceAmount: 199,
    estimatedDays: '3 - 5 Days',
  },
  // 15. Odisha
  {
    prefixes: ['75', '76', '77'],
    distanceKm: 1620,
    zoneName: 'Odisha (Bhubaneswar)',
    region: 'East Zone',
    advanceAmount: 209,
    estimatedDays: '4 - 5 Days',
  },
  // 16. North-East States
  {
    prefixes: ['78', '79'],
    distanceKm: 2250,
    zoneName: 'North-East States (Assam, Meghalaya, etc.)',
    region: 'North-East Zone',
    advanceAmount: 249,
    estimatedDays: '5 - 7 Days',
  },
  // 17. Bihar & Jharkhand
  {
    prefixes: ['80', '81', '82', '83', '84', '85'],
    distanceKm: 1100,
    zoneName: 'Bihar & Jharkhand (Patna / Ranchi)',
    region: 'East Zone',
    advanceAmount: 189,
    estimatedDays: '3 - 5 Days',
  },
];

/**
 * Calculates delivery distance from Delhi origin and required UPI advance for Cash on Delivery.
 *
 * @param pincode - 6-digit Indian Postal Code
 * @param orderTotal - Total amount of the order (in INR)
 * @param state - Optional state name for verification
 */
export function calculateDeliveryDistance(
  pincode: string = '',
  orderTotal: number = 0,
  state?: string
): DeliveryZoneInfo {
  const cleanPin = pincode.replace(/\D/g, '').trim();

  // Default fallback for incomplete or unknown pincodes
  let matchedRule: ZoneRule = {
    prefixes: ['00'],
    distanceKm: 850,
    zoneName: 'National Express Zone',
    region: 'Domestic Express',
    advanceAmount: 169,
    estimatedDays: '3 - 5 Days',
  };

  if (cleanPin.length >= 2) {
    const prefix2 = cleanPin.substring(0, 2);
    const found = ZONE_RULES.find((rule) => rule.prefixes.includes(prefix2));
    if (found) {
      matchedRule = found;
    }
  }

  // Calculate advance amount safely against order total
  let advance = matchedRule.advanceAmount;

  if (orderTotal > 0) {
    // If order total is low (e.g. ₹299), advance shouldn't be higher than 40% of the total or ₹99 minimum
    const maxAdvance = Math.round(orderTotal * 0.45);
    if (advance > maxAdvance && maxAdvance >= 49) {
      advance = maxAdvance;
    } else if (advance > orderTotal) {
      advance = Math.min(orderTotal, 99);
    }
  }

  const remaining = Math.max(0, orderTotal - advance);

  return {
    pincode: cleanPin,
    distanceKm: matchedRule.distanceKm,
    zoneName: matchedRule.zoneName,
    region: matchedRule.region,
    advanceAmount: advance,
    remainingCodAmount: remaining,
    estimatedDays: matchedRule.estimatedDays,
    originStore: ATELIER_ORIGIN.label,
    isEligibleForCod: true,
  };
}
