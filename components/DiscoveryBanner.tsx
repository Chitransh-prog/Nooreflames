import React from 'react';
import Link from 'next/link';
import { urlForImage } from '../sanity/lib/image';

interface BannerData {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: any;
}

export default function DiscoveryBanner({ banner }: { banner?: BannerData }) {
  const title = banner?.title || 'Scented Leaves Pure Blends';
  const subtitle =
    banner?.subtitle ||
    'Unveil 5 handcrafted fragrance miniatures in our signature gold-embossed discovery box.';
  const buttonText = banner?.buttonText || 'EXPLORE DISCOVERY SET — ₹999';
  const buttonLink = banner?.buttonLink || '#discovery';

  const bgUrl = banner?.backgroundImage ? urlForImage(banner.backgroundImage).url() : null;

  return (
    <section className="promo-banner-section" id="discovery">
      <div
        className="promo-banner-card"
        style={{
          backgroundImage: bgUrl
            ? `linear-gradient(90deg, rgba(18, 18, 18, 0.75) 0%, rgba(18, 18, 18, 0.35) 60%), url('${bgUrl}')`
            : `linear-gradient(100deg, #2e1d17 0%, #4a3227 50%, #1a120e 100%)`,
        }}
      >
        <div className="promo-content">
          <span className="promo-badge-gold">LIMITED EDITION BOX</span>
          <h2 className="promo-title font-serif">{title}</h2>
          <p className="promo-subtitle">{subtitle}</p>
          <Link href={buttonLink} className="btn-promo-cta">
            {buttonText}
          </Link>
        </div>

        <div className="promo-visual-boxes">
          <div className="discovery-box-mockup">
            <span className="box-logo font-serif">N | F</span>
            <span className="box-tag">DISCOVERY SET</span>
          </div>
        </div>
      </div>
    </section>
  );
}
