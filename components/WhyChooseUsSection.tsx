import React from 'react';
import { Leaf, Hourglass, FlaskConical, Flame, Gem, Heart, Truck } from 'lucide-react';

interface FeatureItem {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

interface WhyChooseUsData {
  heading?: string;
  subtitle?: string;
}

const defaultFeatures: FeatureItem[] = [
  { icon: <Leaf size={28} color="#1b3d39" />, title: '100% Pure Botanical Oils', description: 'Ethically harvested raw extracts' },
  { icon: <Hourglass size={28} color="#1b3d39" />, title: '14+ Hrs Longevity', description: 'Formulated at Extrait concentration' },
  { icon: <FlaskConical size={28} color="#1b3d39" />, title: 'Alcohol-Free Attars', description: 'Safe for sensitive skin' },
  { icon: <Flame size={28} color="#1b3d39" />, title: 'Hand-Poured Soy Wax', description: 'Clean burn with zero toxins' },
  { icon: <Gem size={28} color="#1b3d39" />, title: 'Luxury Glass Flacons', description: 'Custom engineered heavy glass' },
  { icon: <Heart size={28} color="#1b3d39" />, title: 'Cruelty-Free & Vegan', description: 'Never tested on animals' },
  { icon: <Truck size={28} color="#1b3d39" />, title: 'Fast Express Delivery', description: 'Nationwide 2-3 day shipping' },
];

export default function WhyChooseUsSection({ data }: { data?: WhyChooseUsData }) {
  const heading = data?.heading || 'Why Choose Noor-E-Flames';
  const subtitle = data?.subtitle || 'What Makes Us Special — The Artisanal Standard';

  return (
    <section className="why-us-section" id="why-us">
      <div className="why-us-background-glow">
        <div className="section-header-center light">
          <span className="section-overline gold">CRAFT & EXCELLENCE</span>
          <h2 className="section-title light font-serif">{heading}</h2>
          <p className="section-subtitle light">{subtitle}</p>
        </div>

        {/* Feature Pill Box Container */}
        <div className="feature-pill-container">
          <div className="feature-pill-grid">
            {defaultFeatures.map((feat, idx) => (
              <div key={idx} className="feature-circle-card">
                <div className="feature-icon-badge">{feat.icon}</div>
                <h3 className="feature-card-title">{feat.title}</h3>
                {feat.description && <p className="feature-card-sub">{feat.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
