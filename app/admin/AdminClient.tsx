'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  Truck,
  Image as ImageIcon,
  Tag,
  Rocket,
  Save,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Eye,
  RefreshCw,
  Film,
  Play,
  Volume2,
} from 'lucide-react';
import { StoreData, Product, Order, Coupon, VideoPlaylistItem } from '@/lib/store';

export default function AdminClient({ initialData }: { initialData: StoreData }) {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'products' | 'orders' | 'banners' | 'offers' | 'sync'
  >('dashboard');

  const [storeData, setStoreData] = useState<StoreData>(initialData);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Products filtering & modal
  const [productSearch, setProductSearch] = useState('');
  const [productCategory, setProductCategory] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Orders filtering & detail
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Offers modal
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isNewCoupon, setIsNewCoupon] = useState(false);

  // Reload store data
  const loadData = async () => {
    try {
      const res = await fetch('/api/store');
      const data = await res.json();
      setStoreData(data);
    } catch (err) {
      console.error('Failed to load store data:', err);
    }
  };

  // Save changes to API
  const handleSaveChanges = async () => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeData),
      });
      const result = await res.json();
      if (result.success) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      setSaveStatus('error');
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    // Optimistic UI update
    setStoreData({
      ...storeData,
      orders: storeData.orders.map((o) =>
        o.id === orderId ? { ...o, deliveryStatus: newStatus } : o
      ),
    });

    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, deliveryStatus: newStatus }),
      });
    } catch (err) {
      console.error('Error updating order:', err);
      loadData();
    }
  };

  // Dashboard calculations
  const totalRevenue = storeData.orders.reduce((sum, o) => sum + o.amount, 0) + 138000;
  const activeOrdersCount = storeData.orders.filter(
    (o) => o.deliveryStatus !== 'delivered' && o.deliveryStatus !== 'cancelled'
  ).length;
  const totalSkusCount = storeData.products.length;
  const activeOffersCount = storeData.coupons.filter((c) => c.isActive).length;

  const inTransitCount = storeData.orders.filter((o) => o.deliveryStatus === 'in-transit').length;
  const dispatchedCount = storeData.orders.filter((o) => o.deliveryStatus === 'dispatched').length;

  return (
    <div className="admin-layout">
      {/* 1. Left Navigation Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-brand-main-wrap">
            <div className="admin-brand-logo-wrap">
              <img
                src="/images/logo/logo-light.png"
                alt="Noor-e-Flames"
                className="admin-brand-logo-img"
              />
            </div>
            <div className="admin-brand-info">
              <div className="admin-brand-title font-serif">COMMERCE HUB</div>
              <div className="admin-brand-sub">Where Fragrance Meets Flames</div>
            </div>
          </div>
          <Link href="/" target="_blank" className="admin-mobile-store-link">
            <Eye size={13} />
            <span>Storefront</span>
          </Link>
        </div>

        <nav className="admin-sidebar-nav">
          <button
            className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={18} />
            <span>Products & SKUs</span>
            <span className="nav-badge-count">{totalSkusCount}</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Truck size={18} />
            <span>Delivery & Orders</span>
            <span className="nav-badge-count highlight">{storeData.orders.length}</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'banners' ? 'active' : ''}`}
            onClick={() => setActiveTab('banners')}
          >
            <ImageIcon size={18} />
            <span>Banners & Media</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'offers' ? 'active' : ''}`}
            onClick={() => setActiveTab('offers')}
          >
            <Tag size={18} />
            <span>Codes & Offers</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'sync' ? 'active' : ''}`}
            onClick={() => setActiveTab('sync')}
          >
            <Rocket size={18} />
            <span>Sync & Deploy</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <Link href="/" target="_blank" className="btn-view-storefront">
            <Eye size={16} />
            <span>View Live Storefront</span>
          </Link>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="admin-main">
        {/* Top Header Bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <h1 className="admin-topbar-title font-serif">
              {activeTab === 'dashboard' && '📊 Executive Dashboard'}
              {activeTab === 'products' && '📦 Products Catalog & SKUs'}
              {activeTab === 'orders' && '🚚 Live Orders & Deliveries'}
              {activeTab === 'banners' && '🖼️ Hero & Promo Banners Manager'}
              {activeTab === 'offers' && '🏷️ Discount Codes & Offers'}
              {activeTab === 'sync' && '🚀 Storefront Sync & Deploy'}
            </h1>
          </div>

          <div className="admin-topbar-actions">
            <button
              onClick={handleSaveChanges}
              disabled={saveStatus === 'saving'}
              className="btn-admin-save"
            >
              {saveStatus === 'saving' ? (
                <>
                  <RefreshCw size={15} className="spin" />
                  <span>Saving...</span>
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <CheckCircle2 size={15} color="#22c55e" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>Save Changes</span>
                </>
              )}
            </button>

            <button
              onClick={() => window.open('https://vercel.com', '_blank')}
              className="btn-admin-deploy"
            >
              <Rocket size={15} />
              <span>Deploy to Vercel</span>
            </button>
          </div>
        </header>

        <div className="admin-content-body">
          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="tab-dashboard-view">
              {/* 4 Stat KPI Cards */}
              <div className="admin-kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-label">TOTAL STORE REVENUE</div>
                  <div className="kpi-value font-serif">₹{totalRevenue.toLocaleString('en-IN')}</div>
                  <div className="kpi-sub green">↑ 24% this month</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-label">ACTIVE ORDERS</div>
                  <div className="kpi-value font-serif">{activeOrdersCount}</div>
                  <div className="kpi-sub">
                    {inTransitCount} In Transit · {dispatchedCount} Dispatched
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-label">CATALOG SKUS</div>
                  <div className="kpi-value font-serif">{totalSkusCount}</div>
                  <div className="kpi-sub">Candles & Perfumes</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-label">ACTIVE OFFERS</div>
                  <div className="kpi-value font-serif">{activeOffersCount}</div>
                  <div className="kpi-sub">NOOR20, WELCOME10, etc.</div>
                </div>
              </div>

              {/* Recent Live Orders Section */}
              <div className="admin-card-section">
                <div className="section-card-header">
                  <div className="section-card-title">
                    <span>📦 Recent Live Orders</span>
                  </div>
                  <button
                    className="btn-card-action"
                    onClick={() => setActiveTab('orders')}
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ORDER ID</th>
                        <th>CUSTOMER</th>
                        <th>DESTINATION</th>
                        <th>AMOUNT</th>
                        <th>PAYMENT</th>
                        <th>DELIVERY STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {storeData.orders.slice(0, 5).map((order) => (
                        <tr key={order.id} onClick={() => setSelectedOrder(order)} className="clickable-row">
                          <td className="font-mono order-id-text">{order.id}</td>
                          <td>{order.customer}</td>
                          <td className="destination-text">{order.destination}</td>
                          <td className="amount-text font-serif">₹{order.amount.toLocaleString('en-IN')}</td>
                          <td>{order.payment}</td>
                          <td>
                            <span className={`status-pill ${order.deliveryStatus}`}>
                              {order.deliveryStatus.toUpperCase().replace('-', ' ')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS & SKUS */}
          {activeTab === 'products' && (
            <div className="tab-products-view">
              <div className="toolbar-row">
                <div className="search-box">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search product title or SKU..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>

                <div className="category-tabs">
                  {['all', 'candles', 'ocean-fresh', 'floral-rose', 'royal-oud'].map((cat) => (
                    <button
                      key={cat}
                      className={`cat-pill ${productCategory === cat ? 'active' : ''}`}
                      onClick={() => setProductCategory(cat)}
                    >
                      {cat.replace('-', ' ').toUpperCase()}
                    </button>
                  ))}
                </div>

                <button
                  className="btn-add-sku"
                  onClick={() => {
                    setIsNewProduct(true);
                    setEditingProduct({
                      id: `prod-${Date.now()}`,
                      sku: `NF-NEW-${Math.floor(100 + Math.random() * 900)}`,
                      title: '',
                      subtitle: '',
                      price: 999,
                      originalPrice: 1499,
                      rating: 5.0,
                      reviewsCount: 10,
                      badge: 'NEW',
                      image: '/images/products/whispered-surprises.jpg',
                      category: 'candles',
                      inStock: true,
                      stockCount: 50,
                    });
                  }}
                >
                  <Plus size={16} />
                  <span>Add New SKU</span>
                </button>
              </div>

              <div className="products-admin-grid">
                {storeData.products
                  .filter((p) => {
                    const matchCat = productCategory === 'all' || p.category === productCategory;
                    const matchSearch =
                      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
                      p.sku.toLowerCase().includes(productSearch.toLowerCase());
                    return matchCat && matchSearch;
                  })
                  .map((product) => (
                    <div key={product.id} className="product-admin-card">
                      <div className="card-thumb-row">
                        <img src={product.image} alt={product.title} />
                        <div className="card-thumb-meta">
                          <span className="sku-tag">{product.sku}</span>
                          <span className="badge-tag">{product.badge || 'STANDARD'}</span>
                          <span className={`stock-tag ${product.inStock ? 'in' : 'out'}`}>
                            {product.inStock ? `${product.stockCount} in stock` : 'Out of Stock'}
                          </span>
                        </div>
                      </div>

                      <div className="card-body">
                        <h3 className="card-title font-serif">{product.title}</h3>
                        <p className="card-notes">{product.subtitle}</p>
                        <div className="card-price-row">
                          <div className="price font-serif">₹{product.price.toLocaleString('en-IN')}</div>
                          {product.originalPrice && (
                            <div className="orig-price">₹{product.originalPrice.toLocaleString('en-IN')}</div>
                          )}
                        </div>
                      </div>

                      <div className="card-footer-actions">
                        <button
                          className="btn-edit-product"
                          onClick={() => {
                            setIsNewProduct(false);
                            setEditingProduct(product);
                          }}
                        >
                          <Edit2 size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          className="btn-delete-product"
                          onClick={() => {
                            if (confirm(`Delete ${product.title}?`)) {
                              setStoreData({
                                ...storeData,
                                products: storeData.products.filter((p) => p.id !== product.id),
                              });
                            }
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 3: DELIVERY & ORDERS */}
          {activeTab === 'orders' && (
            <div className="tab-orders-view">
              <div className="toolbar-row">
                <div className="search-box">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search Order ID, Customer Name, or City..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                  />
                </div>

                <div className="category-tabs">
                  {['all', 'confirmed', 'dispatched', 'in-transit', 'delivered'].map((st) => (
                    <button
                      key={st}
                      className={`cat-pill ${orderStatusFilter === st ? 'active' : ''}`}
                      onClick={() => setOrderStatusFilter(st)}
                    >
                      {st.toUpperCase().replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ORDER ID</th>
                      <th>CUSTOMER</th>
                      <th>ITEMS</th>
                      <th>DESTINATION</th>
                      <th>AMOUNT</th>
                      <th>PAYMENT</th>
                      <th>DELIVERY STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {storeData.orders
                      .filter((o) => {
                        const matchStatus =
                          orderStatusFilter === 'all' || o.deliveryStatus === orderStatusFilter;
                        const matchSearch =
                          o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customer.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.destination.toLowerCase().includes(orderSearch.toLowerCase());
                        return matchStatus && matchSearch;
                      })
                      .map((order) => (
                        <tr key={order.id}>
                          <td className="font-mono order-id-text">{order.id}</td>
                          <td>
                            <strong>{order.customer}</strong>
                            <div style={{ fontSize: '11px', color: '#888' }}>{order.phone}</div>
                          </td>
                          <td>
                            <div className="order-items-preview-stack">
                              {order.items?.map((it, idx) => (
                                <span key={idx} className="item-chip">
                                  {it.quantity}x {it.title}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="destination-text">{order.destination}</td>
                          <td className="amount-text font-serif">₹{order.amount.toLocaleString('en-IN')}</td>
                          <td>{order.payment}</td>
                          <td>
                            <select
                              value={order.deliveryStatus}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className={`status-select ${order.deliveryStatus}`}
                            >
                              <option value="confirmed">CONFIRMED</option>
                              <option value="dispatched">DISPATCHED</option>
                              <option value="in-transit">IN TRANSIT</option>
                              <option value="delivered">DELIVERED</option>
                              <option value="cancelled">CANCELLED</option>
                            </select>
                          </td>
                          <td>
                            <button
                              className="btn-view-order-details"
                              onClick={() => setSelectedOrder(order)}
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: BANNERS & MEDIA */}
          {activeTab === 'banners' && (
            <div className="tab-banners-view">
              <div className="admin-editor-card">
                <h3 className="editor-card-title font-serif">Hero Section Content</h3>
                <div className="form-group-row">
                  <div className="form-field">
                    <label>Badge Tagline</label>
                    <input
                      type="text"
                      value={storeData.hero.badge}
                      onChange={(e) =>
                        setStoreData({
                          ...storeData,
                          hero: { ...storeData.hero, badge: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="form-field">
                    <label>Main Headline</label>
                    <input
                      type="text"
                      value={storeData.hero.headline}
                      onChange={(e) =>
                        setStoreData({
                          ...storeData,
                          hero: { ...storeData.hero, headline: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Subtitle / Brand Mission</label>
                  <textarea
                    rows={2}
                    value={storeData.hero.subtitle}
                    onChange={(e) =>
                      setStoreData({
                        ...storeData,
                        hero: { ...storeData.hero, subtitle: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="form-group-row">
                  <div className="form-field">
                    <label>Primary Button Text</label>
                    <input
                      type="text"
                      value={storeData.hero.primaryCtaText}
                      onChange={(e) =>
                        setStoreData({
                          ...storeData,
                          hero: { ...storeData.hero, primaryCtaText: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="form-field">
                    <label>Secondary Button Text</label>
                    <input
                      type="text"
                      value={storeData.hero.secondaryCtaText}
                      onChange={(e) =>
                        setStoreData({
                          ...storeData,
                          hero: { ...storeData.hero, secondaryCtaText: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                {/* Hero Media Format & Video Controls */}
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#dfab72', marginBottom: '10px' }}>
                    Hero Media Display Format
                  </label>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() =>
                        setStoreData({
                          ...storeData,
                          hero: { ...storeData.hero, mediaType: 'video' },
                        })
                      }
                      style={{
                        padding: '10px 18px',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: storeData.hero.mediaType !== 'image' ? '#dfab72' : 'rgba(255,255,255,0.2)',
                        background: storeData.hero.mediaType !== 'image' ? 'rgba(223, 171, 114, 0.18)' : '#162b28',
                        color: storeData.hero.mediaType !== 'image' ? '#dfab72' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: 600,
                        fontSize: '13px',
                        flex: '1 1 200px',
                        justifyContent: 'center',
                      }}
                    >
                      <Film size={16} />
                      Cinematic Video (MP4 Autoplay Loop)
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setStoreData({
                          ...storeData,
                          hero: { ...storeData.hero, mediaType: 'image' },
                        })
                      }
                      style={{
                        padding: '10px 18px',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: storeData.hero.mediaType === 'image' ? '#dfab72' : 'rgba(255,255,255,0.2)',
                        background: storeData.hero.mediaType === 'image' ? 'rgba(223, 171, 114, 0.18)' : '#162b28',
                        color: storeData.hero.mediaType === 'image' ? '#dfab72' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: 600,
                        fontSize: '13px',
                        flex: '1 1 200px',
                        justifyContent: 'center',
                      }}
                    >
                      <ImageIcon size={16} />
                      Static High-Res Image
                    </button>
                  </div>

                  <div className="form-group-row">
                    <div className="form-field">
                      <label>Hero Video File URL (.mp4)</label>
                      <input
                        type="text"
                        value={storeData.hero.video || ''}
                        placeholder="/videos/hero/noor_header_hero_video.mp4"
                        onChange={(e) =>
                          setStoreData({
                            ...storeData,
                            hero: { ...storeData.hero, video: e.target.value },
                          })
                        }
                      />
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', color: '#90a09e' }}>Presets:</span>
                        <button
                          type="button"
                          onClick={() =>
                            setStoreData({
                              ...storeData,
                              hero: { ...storeData.hero, video: '/videos/hero/noor_header_hero_video.mp4', mediaType: 'video' },
                            })
                          }
                          style={{
                            fontSize: '10.5px',
                            background: '#183330',
                            border: '1px solid rgba(201, 147, 90, 0.3)',
                            color: '#dfab72',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          ✦ Atelier 4K
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setStoreData({
                              ...storeData,
                              hero: { ...storeData.hero, video: '/videos/reels/IMG_5927.MP4', mediaType: 'video' },
                            })
                          }
                          style={{
                            fontSize: '10.5px',
                            background: '#183330',
                            border: '1px solid rgba(201, 147, 90, 0.3)',
                            color: '#dfab72',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          ✦ Artisanal Pour
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setStoreData({
                              ...storeData,
                              hero: { ...storeData.hero, video: '/videos/reels/IMG_5931.MP4', mediaType: 'video' },
                            })
                          }
                          style={{
                            fontSize: '10.5px',
                            background: '#183330',
                            border: '1px solid rgba(201, 147, 90, 0.3)',
                            color: '#dfab72',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          ✦ Luxury Unboxing
                        </button>
                      </div>
                    </div>

                    <div className="form-field">
                      <label>Fallback / Poster Image URL</label>
                      <input
                        type="text"
                        value={storeData.hero.image || ''}
                        placeholder="/images/hero/hero-candle.jpg"
                        onChange={(e) =>
                          setStoreData({
                            ...storeData,
                            hero: { ...storeData.hero, image: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Live Admin Preview */}
                  <div style={{ marginTop: '16px', padding: '14px', background: '#0a1716', borderRadius: '12px', border: '1px solid rgba(201, 147, 90, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#dfab72', textTransform: 'uppercase' }}>
                        ✦ Live Hero Media Preview
                      </span>
                      <span style={{ fontSize: '11px', color: '#7e8f8d' }}>
                        {storeData.hero.mediaType === 'image' ? 'Showing static image' : 'Showing video stream'}
                      </span>
                    </div>

                    {storeData.hero.mediaType !== 'image' && storeData.hero.video ? (
                      <video
                        key={storeData.hero.video}
                        src={storeData.hero.video}
                        controls
                        muted
                        loop
                        playsInline
                        style={{
                          width: '100%',
                          maxHeight: '260px',
                          borderRadius: '8px',
                          background: '#000',
                          objectFit: 'contain',
                          display: 'block',
                        }}
                      />
                    ) : (
                      <img
                        src={storeData.hero.image || '/images/hero/hero-candle.jpg'}
                        alt="Hero preview"
                        style={{
                          width: '100%',
                          maxHeight: '260px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          display: 'block',
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Discovery Banner Editor */}
              <div className="admin-editor-card" style={{ marginTop: '24px' }}>
                <h3 className="editor-card-title font-serif">Discovery Gift Box Banner</h3>
                <div className="form-group-row">
                  <div className="form-field">
                    <label>Banner Title</label>
                    <input
                      type="text"
                      value={storeData.discoveryBanner.title}
                      onChange={(e) =>
                        setStoreData({
                          ...storeData,
                          discoveryBanner: { ...storeData.discoveryBanner, title: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="form-field">
                    <label>CTA Button Text</label>
                    <input
                      type="text"
                      value={storeData.discoveryBanner.buttonText}
                      onChange={(e) =>
                        setStoreData({
                          ...storeData,
                          discoveryBanner: {
                            ...storeData.discoveryBanner,
                            buttonText: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Banner Subtitle</label>
                  <input
                    type="text"
                    value={storeData.discoveryBanner.subtitle}
                    onChange={(e) =>
                      setStoreData({
                        ...storeData,
                        discoveryBanner: {
                          ...storeData.discoveryBanner,
                          subtitle: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              {/* Top Announcement Ticker */}
              <div className="admin-editor-card" style={{ marginTop: '24px' }}>
                <h3 className="editor-card-title font-serif">Top Announcement Marquee Deals</h3>
                {storeData.siteSettings.announcements.map((ann, idx) => (
                  <div key={idx} className="marquee-item-row" style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      value={ann}
                      onChange={(e) => {
                        const updated = [...storeData.siteSettings.announcements];
                        updated[idx] = e.target.value;
                        setStoreData({
                          ...storeData,
                          siteSettings: { ...storeData.siteSettings, announcements: updated },
                        });
                      }}
                      style={{ flex: 1 }}
                    />
                    <button
                      className="btn-delete-product"
                      onClick={() => {
                        const updated = storeData.siteSettings.announcements.filter((_, i) => i !== idx);
                        setStoreData({
                          ...storeData,
                          siteSettings: { ...storeData.siteSettings, announcements: updated },
                        });
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  className="btn-add-sku"
                  style={{ marginTop: '8px' }}
                  onClick={() => {
                    setStoreData({
                      ...storeData,
                      siteSettings: {
                        ...storeData.siteSettings,
                        announcements: [
                          ...storeData.siteSettings.announcements,
                          '🔥 Special Limited-Edition Fragrance Drop Available Now',
                        ],
                      },
                    });
                  }}
                >
                  <Plus size={14} />
                  <span>Add Announcement Line</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: CODES & OFFERS */}
          {activeTab === 'offers' && (
            <div className="tab-offers-view">
              <div className="toolbar-row">
                <h3 className="font-serif" style={{ fontSize: '18px' }}>Store Coupons & Promotional Codes</h3>
                <button
                  className="btn-add-sku"
                  onClick={() => {
                    setIsNewCoupon(true);
                    setEditingCoupon({
                      code: 'NEWOFFER',
                      discountPercent: 15,
                      minOrder: 999,
                      description: '15% off orders above ₹999',
                      isActive: true,
                    });
                  }}
                >
                  <Plus size={16} />
                  <span>Create New Coupon</span>
                </button>
              </div>

              <div className="coupons-grid">
                {storeData.coupons.map((coupon) => (
                  <div key={coupon.code} className="coupon-admin-card">
                    <div className="coupon-header">
                      <span className="coupon-code-badge font-mono">{coupon.code}</span>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={coupon.isActive}
                          onChange={(e) => {
                            setStoreData({
                              ...storeData,
                              coupons: storeData.coupons.map((c) =>
                                c.code === coupon.code ? { ...c, isActive: e.target.checked } : c
                              ),
                            });
                          }}
                        />
                        <span className="slider" />
                      </label>
                    </div>
                    <div className="coupon-discount font-serif">
                      {coupon.discountPercent > 0 ? `${coupon.discountPercent}% OFF` : 'FREE SHIPPING'}
                    </div>
                    <p className="coupon-desc">{coupon.description}</p>
                    <div className="coupon-meta">Min. Order Value: ₹{coupon.minOrder}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SYNC & DEPLOY */}
          {activeTab === 'sync' && (
            <div className="tab-sync-view">
              <div className="admin-editor-card">
                <h3 className="editor-card-title font-serif">Storefront Persistence & Backup</h3>
                <p style={{ color: '#999', marginBottom: '16px' }}>
                  All product catalogs, orders, hero slides, and promotional codes are stored locally in{' '}
                  <code>data/store.json</code> with zero reliance on Sanity CMS.
                </p>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    className="btn-admin-save"
                    onClick={() => {
                      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(storeData, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute('href', dataStr);
                      downloadAnchor.setAttribute('download', `noor-e-flames-backup-${Date.now()}.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                  >
                    <Save size={16} />
                    <span>Export JSON Backup</span>
                  </button>

                  <button className="btn-admin-deploy" onClick={loadData}>
                    <RefreshCw size={16} />
                    <span>Reload from Disk</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="admin-modal-backdrop" onClick={() => setEditingProduct(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title font-serif">
              {isNewProduct ? 'Add New Product / SKU' : `Edit Product: ${editingProduct.title}`}
            </h3>

            <div className="form-group-row">
              <div className="form-field">
                <label>SKU Code</label>
                <input
                  type="text"
                  value={editingProduct.sku}
                  onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>Category</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                >
                  <option value="candles">Candles</option>
                  <option value="ocean-fresh">Oceanic & Fresh</option>
                  <option value="floral-rose">Floral & Rose</option>
                  <option value="royal-oud">Royal Oud & Amber</option>
                </select>
              </div>
            </div>

            <div className="form-field">
              <label>Product Title</label>
              <input
                type="text"
                value={editingProduct.title}
                onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label>Subtitle / Notes</label>
              <input
                type="text"
                value={editingProduct.subtitle}
                onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
              />
            </div>

            <div className="form-group-row">
              <div className="form-field">
                <label>Selling Price (₹)</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                  }
                />
              </div>
              <div className="form-field">
                <label>Original / MRP (₹)</label>
                <input
                  type="number"
                  value={editingProduct.originalPrice || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-field">
                <label>Badge Tag (e.g. BESTSELLER, SECRET MESSAGE)</label>
                <input
                  type="text"
                  value={editingProduct.badge || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>Image Path</label>
                <input
                  type="text"
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setEditingProduct(null)}>
                Cancel
              </button>
              <button
                className="btn-confirm"
                onClick={() => {
                  if (isNewProduct) {
                    setStoreData({
                      ...storeData,
                      products: [editingProduct, ...storeData.products],
                    });
                  } else {
                    setStoreData({
                      ...storeData,
                      products: storeData.products.map((p) =>
                        p.id === editingProduct.id ? editingProduct : p
                      ),
                    });
                  }
                  setEditingProduct(null);
                }}
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title font-serif">Order Details — {selectedOrder.id}</h3>

            <div className="order-modal-grid">
              <div>
                <strong>Customer:</strong> {selectedOrder.customer}
              </div>
              <div>
                <strong>Phone:</strong> {selectedOrder.phone}
              </div>
              <div>
                <strong>Email:</strong> {selectedOrder.email}
              </div>
              <div>
                <strong>Destination:</strong> {selectedOrder.destination}
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <strong>Address:</strong> {selectedOrder.address}, PIN: {selectedOrder.pincode}
              </div>
              <div>
                <strong>Payment:</strong> {selectedOrder.payment}
              </div>
              <div>
                <strong>Grand Total:</strong> ₹{selectedOrder.amount.toLocaleString('en-IN')}
              </div>
            </div>

            <h4 className="font-serif" style={{ marginTop: '16px', marginBottom: '8px' }}>
              Items Ordered:
            </h4>
            <div className="order-items-list">
              {selectedOrder.items?.map((it, idx) => (
                <div key={idx} className="order-modal-item">
                  <img src={it.image} alt={it.title} />
                  <div style={{ flex: 1 }}>
                    <div><strong>{it.title}</strong></div>
                    <div style={{ color: '#888', fontSize: '12px' }}>Qty: {it.quantity}</div>
                  </div>
                  <div className="font-serif">₹{(it.price * it.quantity).toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>

            <div className="modal-actions" style={{ marginTop: '20px' }}>
              <button className="btn-cancel" onClick={() => setSelectedOrder(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
