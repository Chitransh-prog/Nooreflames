import React from 'react';
import { Sparkles } from 'lucide-react';

const defaultTickerItems = [
  'NOOR-E-FLAMES',
  '100% ALCOHOL FREE ATTARS',
  'EXTRAIT DE PARFUM',
  'HAND-POURED SOY CANDLES',
  '14+ HOUR LONGEVITY',
  'PURE BOTANICAL OILS',
  'COMPLIMENTARY SHIPPING',
];

export default function TickerMarquee({ items }: { items?: string[] }) {
  const displayItems = items && items.length > 0 ? items : defaultTickerItems;
  const repeatedList = [...displayItems, ...displayItems, ...displayItems];

  return (
    <div className="marquee-wrapper">
      <div className="marquee-track">
        {repeatedList.map((item, idx) => (
          <span key={idx} className="marquee-item font-serif" style={{ display: 'inline-flex', alignItems: 'center' }}>
            {item}
            <Sparkles size={14} color="#c9935a" style={{ marginLeft: '16px', marginRight: '16px' }} />
          </span>
        ))}
      </div>
    </div>
  );
}
