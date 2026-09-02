import React from 'react';
import { urlForImage } from '../sanity/lib/image';

export interface PressLogoItem {
  _id?: string;
  name: string;
  logo?: any;
}

const defaultPress: PressLogoItem[] = [
  { name: 'NYKAA' },
  { name: 'MYNTRA' },
  { name: 'TATA CLiQ' },
  { name: 'AMAZON' },
  { name: 'MENSXP' },
  { name: 'VOGUE' },
  { name: 'ELLE' },
];

export default function PressSection({ logos }: { logos?: PressLogoItem[] }) {
  const displayLogos = logos && logos.length > 0 ? logos : defaultPress;

  return (
    <section className="press-logos-section">
      <div className="section-header-center">
        <span className="section-overline gold">PRESS & RETAIL PARTNERS</span>
        <h2 className="section-title-sm font-serif">As Featured In</h2>
      </div>

      <div className="press-logo-row">
        {displayLogos.map((item, idx) => (
          <div key={item._id || idx} className="press-logo-badge">
            {item.logo ? (
              <img src={urlForImage(item.logo).url()} alt={item.name} className="press-img" />
            ) : (
              <span className="press-text-logo font-serif">{item.name}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
