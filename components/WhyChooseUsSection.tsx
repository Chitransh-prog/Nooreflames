'use client';

import React, { useState } from 'react';
import { Award, Flame, Droplets, Heart, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { useVisualEdit } from '@/context/VisualEditContext';
import { EditableText } from './visual-edit/EditableElements';

const initialIconsData = [
  {
    icon: <Award size={24} color="#BBA58E" />,
    title: 'IFRA Certified',
    desc: 'European fragrance safety standards',
  },
  {
    icon: <Flame size={24} color="#BBA58E" />,
    title: '100% Soy Wax',
    desc: 'Clean burn, zero paraffin or toxins',
  },
  {
    icon: <Droplets size={24} color="#BBA58E" />,
    title: '35% Extrait Oil',
    desc: 'Highest oil concentration possible',
  },
  {
    icon: <Heart size={24} color="#BBA58E" />,
    title: 'Cruelty-Free',
    desc: '100% vegan & never animal tested',
  },
  {
    icon: <Clock size={24} color="#BBA58E" />,
    title: '14+ Hrs Longevity',
    desc: 'Sillage that lingers all day long',
  },
  {
    icon: <ShieldCheck size={24} color="#BBA58E" />,
    title: 'Safe for Pets',
    desc: 'Lead-free wicks & non-toxic oils',
  },
  {
    icon: <Sparkles size={24} color="#BBA58E" />,
    title: '100% Handcrafted',
    desc: 'Artisanal small batches in India',
  },
];

export default function WhyChooseUsSection() {
  const { storeData, updateField } = useVisualEdit();
  const [items, setItems] = useState(initialIconsData);

  const bannerBadge = storeData?.siteSettings?.whyUsBadge || "IT'S ALL IN THE DETAIL";
  const bannerTitle = storeData?.siteSettings?.whyUsTitle || "Why Choose NOOR - E - FLAMES";
  const bannerBg = storeData?.siteSettings?.whyUsBackground || '/images/noor-flame-signature-gradient.jpg';

  const updateItem = (index: number, key: 'title' | 'desc', val: string) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: val };
      return next;
    });
  };

  return (
    <section
      className="why-choose-us-banner-section"
      id="why-us"
    >
      {/* Bespoke Noor-e-Flames Signature Flame & Light Gradient Banner */}
      <div
        className="why-us-banner-ambient"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(14, 11, 9, 0.3) 0%, rgba(14, 11, 9, 0.6) 100%), url('${bannerBg}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#1c1511',
          border: '1px solid rgba(212, 175, 55, 0.28)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.38), 0 0 50px rgba(201, 147, 90, 0.18)',
        }}
      >
        <EditableText
          as="span"
          value={bannerBadge}
          onValueChange={(val) => updateField('siteSettings.whyUsBadge', val)}
          style={{
            display: 'inline-block',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#f5dfb8',
            marginBottom: '12px',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
          }}
        />

        <EditableText
          as="h2"
          value={bannerTitle}
          onValueChange={(val) => updateField('siteSettings.whyUsTitle', val)}
          className="font-serif why-us-main-title"
          style={{
            fontWeight: 400,
            letterSpacing: '0.08em',
            color: '#ffffff',
            marginBottom: '38px',
            textShadow: '0 4px 24px rgba(0, 0, 0, 0.65), 0 0 35px rgba(230, 185, 128, 0.4)',
          }}
        />

        {/* Floating White Rounded Card */}
        <div className="why-us-card-container">
          <div className="why-us-icons-grid">
            {items.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '10px 8px',
              }}
            >
              {/* Circular Outlined Icon Badge */}
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  border: '1.5px solid #BBA58E',
                  background: 'rgba(187, 165, 142, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                }}
              >
                {item.icon}
              </div>

              <EditableText
                as="h3"
                value={item.title}
                onValueChange={(val) => updateItem(idx, 'title', val)}
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#121212',
                  marginBottom: '4px',
                  lineHeight: 1.3,
                }}
              />

              <EditableText
                as="p"
                value={item.desc}
                onValueChange={(val) => updateItem(idx, 'desc', val)}
                style={{
                  fontSize: '10px',
                  color: '#707070',
                  lineHeight: 1.35,
                  margin: 0,
                }}
              />
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}

