import React from 'react';

export default function ChooseHiraSection() {
  return (
    <section className="section-container" id="craftsmanship">
      <h2 className="section-heading font-serif">The Artisanal Standard</h2>
      <div className="choose-hira-grid">
        <div className="choose-card">
          <div className="choose-icon">🌿</div>
          <h3 className="font-serif" style={{ fontSize: '22px', marginBottom: '10px' }}>
            Pure Botanical Oils
          </h3>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Ethically sourced natural extracts, rare spices, and precious woods from world-renowned distillers.
          </p>
        </div>
        <div className="choose-card">
          <div className="choose-icon">⏳</div>
          <h3 className="font-serif" style={{ fontSize: '22px', marginBottom: '10px' }}>
            Extrait Concentration
          </h3>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Formulated at maximum oil concentration for extraordinary sillage and 14+ hour longevity.
          </p>
        </div>
        <div className="choose-card">
          <div className="choose-icon">🔥</div>
          <h3 className="font-serif" style={{ fontSize: '22px', marginBottom: '10px' }}>
            Hand-Poured Soy Wax
          </h3>
          <p style={{ fontSize: '14px', color: '#666' }}>
            100% natural soy wax candles hand-poured in small batches with lead-free cotton wicks.
          </p>
        </div>
        <div className="choose-card">
          <div className="choose-icon">📦</div>
          <h3 className="font-serif" style={{ fontSize: '22px', marginBottom: '10px' }}>
            Complimentary Shipping
          </h3>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Delivered in luxury velvet-touch gift boxes with complimentary sample vials in every order.
          </p>
        </div>
      </div>
    </section>
  );
}
