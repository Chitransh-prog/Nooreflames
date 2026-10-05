'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Edit3,
  Trash2,
  CheckCircle2,
  Eye,
  ExternalLink,
  RefreshCw,
  Film,
  Play,
  Volume2,
  LogOut,
  Upload,
  Sparkles,
  Sliders,
  FileText,
  X,
  Layers,
  MessageSquare,
  Send,
  Phone,
} from 'lucide-react';
import { StoreData, Product, Order, Coupon, VideoPlaylistItem } from '@/lib/store';

export default function AdminClient({ initialData }: { initialData: StoreData }) {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'products' | 'orders' | 'banners' | 'offers' | 'sync' | 'whatsapp'
  >('dashboard');

  const navContainerRef = useRef<HTMLElement>(null);

  // Auto-scroll active tab into view in mobile bottom dock
  useEffect(() => {
    if (navContainerRef.current) {
      const activeBtn = navContainerRef.current.querySelector<HTMLElement>('.admin-bottom-nav-item.active, .admin-nav-item.active');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeTab]);

  const [storeData, setStoreData] = useState<StoreData>(() => ({
    ...initialData,
    orders: Array.isArray(initialData?.orders) ? initialData.orders : [],
    products: Array.isArray(initialData?.products) ? initialData.products : [],
    coupons: Array.isArray(initialData?.coupons) ? initialData.coupons : [],
  }));
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // WhatsApp CRM and Open-WA state
  const [customers, setCustomers] = useState<any[]>([]);
  const [whatsappStatus, setWhatsappStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [whatsappFeedback, setWhatsappFeedback] = useState<string | null>(null);
  const [customWaRecipient, setCustomWaRecipient] = useState('');
  const [customWaName, setCustomWaName] = useState('');
  const [customWaTemplate, setCustomWaTemplate] = useState<'welcome' | 'offer' | 'custom'>('welcome');
  const [customWaMessage, setCustomWaMessage] = useState(
    '✨ *Special Atelier Offer for {name}!* ✨\n\nEnjoy an exclusive 15% VIP discount on all handcrafted flacons and candles today with code *VIP15*.\n\nShop now: https://nooreflames.vercel.app'
  );

  const loadCustomers = async () => {
    try {
      const res = await fetch('/api/customers');
      const data = await res.json();
      if (data.success && Array.isArray(data.customers)) {
        setCustomers(data.customers);
      }
    } catch (err) {
      console.error('Failed to load customers:', err);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSendWhatsApp = async (phone: string, name: string, type: 'welcome' | 'custom', customText?: string) => {
    setWhatsappStatus('sending');
    setWhatsappFeedback(null);
    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          name,
          type,
          customText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWhatsappStatus('sent');
        setWhatsappFeedback(`✓ WhatsApp message dispatched to ${name} (${phone}) via ${data.result?.provider || 'Open-WA'}!`);
        loadCustomers();
        setTimeout(() => setWhatsappStatus('idle'), 4000);
      } else {
        setWhatsappStatus('error');
        setWhatsappFeedback(data.message || 'Failed to dispatch WhatsApp message');
      }
    } catch (err: any) {
      setWhatsappStatus('error');
      setWhatsappFeedback(err?.message || 'Network error dispatching WhatsApp message');
    }
  };

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
  const [couponSaveStatus, setCouponSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Product save status for inline modal feedback
  const [productSaveStatus, setProductSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Enhanced Product Edit Modal states
  const [activeModalTab, setActiveModalTab] = useState<
    'basics' | 'variants' | 'media' | 'story' | 'notes' | 'specs' | 'seo'
  >('basics');
  const [rawNotes, setRawNotes] = useState({
    top: '',
    heart: '',
    base: '',
    ingredients: '',
  });
  const [uploadingMainImage, setUploadingMainImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // Upload helper hitting /api/upload
  const handleUploadImage = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        return data.url;
      } else {
        alert(data.error || 'Upload failed');
        return null;
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      alert('Upload failed: ' + (err.message || 'Network error'));
      return null;
    }
  };

  // Reload store data
  const loadData = async () => {
    try {
      const res = await fetch('/api/store', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });
      const data = await res.json();
      if (data && typeof data === 'object') {
        setStoreData({
          ...data,
          orders: Array.isArray(data.orders) ? data.orders : [],
          products: Array.isArray(data.products) ? data.products : [],
          coupons: Array.isArray(data.coupons) ? data.coupons : [],
        });
      }
    } catch (err) {
      console.error('Failed to load store data:', err);
    }
  };

  // Always sync fresh store state from disk on mount
  useEffect(() => {
    loadData();
  }, []);

  // Safe references to guarantee no runtime TypeError
  const orders = Array.isArray(storeData?.orders) ? storeData.orders : [];
  const products = Array.isArray(storeData?.products) ? storeData.products : [];
  const coupons = Array.isArray(storeData?.coupons) ? storeData.coupons : [];

  // Save changes to API
  const handleSaveChanges = async () => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(storeData),
      });
      const result = await res.json();
      if (result.success) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        console.error('Failed to save store changes:', result);
        setSaveStatus('error');
      }
    } catch (err) {
      console.error('Network error saving changes:', err);
      setSaveStatus('error');
    }
  };

  // Save product changes to state AND immediately persist to server
  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    setProductSaveStatus('saving');

    const sanitizedSlug = (editingProduct.slug || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const finalProduct: Product = {
      ...editingProduct,
      slug: sanitizedSlug || undefined,
      metaTitle: (editingProduct.metaTitle || '').trim() || undefined,
      metaDescription: (editingProduct.metaDescription || '').trim() || undefined,
      imageAlt: (editingProduct.imageAlt || '').trim() || undefined,
      galleryAlt: editingProduct.galleryAlt || [],
      topNotes: rawNotes.top
        ? rawNotes.top.split(',').map((s) => s.trim()).filter(Boolean)
        : (editingProduct.topNotes || []),
      heartNotes: rawNotes.heart
        ? rawNotes.heart.split(',').map((s) => s.trim()).filter(Boolean)
        : (editingProduct.heartNotes || []),
      baseNotes: rawNotes.base
        ? rawNotes.base.split(',').map((s) => s.trim()).filter(Boolean)
        : (editingProduct.baseNotes || []),
      ingredients: rawNotes.ingredients
        ? rawNotes.ingredients.split(',').map((s) => s.trim()).filter(Boolean)
        : (editingProduct.ingredients || []),
      gallery: editingProduct.gallery || [],
      variants: editingProduct.variants || [],
    };

    const updatedProducts = isNewProduct
      ? [finalProduct, ...products]
      : products.map((p) => (p.id === finalProduct.id ? finalProduct : p));

    const updatedStore: StoreData = { ...storeData, products: updatedProducts };
    setStoreData(updatedStore);

    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedStore),
      });
      const result = await res.json();
      if (result.success) {
        setProductSaveStatus('saved');
        setTimeout(() => {
          setProductSaveStatus('idle');
          setEditingProduct(null);
        }, 1000);
      } else {
        console.error('Failed to save product:', result);
        setProductSaveStatus('error');
      }
    } catch (err) {
      console.error('Failed to save product:', err);
      setProductSaveStatus('error');
    }
  };

  // Save coupon changes to state AND immediately persist to server
  const handleSaveCoupon = async () => {
    if (!editingCoupon || !editingCoupon.code.trim()) return;
    setCouponSaveStatus('saving');

    const cleanCode = editingCoupon.code.trim().toUpperCase();
    const sanitizedCoupon: Coupon = {
      ...editingCoupon,
      code: cleanCode,
      discountPercent: Number(editingCoupon.discountPercent) || 0,
      discountAmount: editingCoupon.discountAmount ? Number(editingCoupon.discountAmount) : undefined,
      fixedPrice: editingCoupon.fixedPrice ? Number(editingCoupon.fixedPrice) : undefined,
      minOrder: Number(editingCoupon.minOrder) || 0,
      description: editingCoupon.description || `${cleanCode} promotional discount`,
      isActive: Boolean(editingCoupon.isActive),
      freeShipping: Boolean(editingCoupon.freeShipping),
    };

    let updatedCoupons: Coupon[];
    if (isNewCoupon) {
      const exists = coupons.some((c) => c.code.toUpperCase() === cleanCode);
      if (exists) {
        updatedCoupons = coupons.map((c) =>
          c.code.toUpperCase() === cleanCode ? sanitizedCoupon : c
        );
      } else {
        updatedCoupons = [sanitizedCoupon, ...coupons];
      }
    } else {
      updatedCoupons = coupons.map((c) =>
        c.code.toUpperCase() === cleanCode ? sanitizedCoupon : c
      );
    }

    const updatedStore: StoreData = { ...storeData, coupons: updatedCoupons };
    setStoreData(updatedStore);

    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedStore),
      });
      const result = await res.json();
      if (result.success) {
        setCouponSaveStatus('saved');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('noor_coupons_updated'));
        }
        setTimeout(() => {
          setCouponSaveStatus('idle');
          setEditingCoupon(null);
        }, 800);
      } else {
        console.error('Failed to save coupon:', result);
        setCouponSaveStatus('error');
      }
    } catch (err) {
      console.error('Failed to save coupon:', err);
      setCouponSaveStatus('error');
    }
  };

  const handleDeleteCoupon = async (codeToDelete: string) => {
    if (!confirm(`Are you sure you want to permanently delete coupon "${codeToDelete}"?`)) return;

    const updatedCoupons = coupons.filter((c) => c.code !== codeToDelete);
    const updatedStore: StoreData = { ...storeData, coupons: updatedCoupons };
    setStoreData(updatedStore);

    try {
      await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedStore),
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('noor_coupons_updated'));
      }
    } catch (err) {
      console.error('Failed to delete coupon:', err);
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    // Optimistic UI update
    setStoreData({
      ...storeData,
      orders: orders.map((o) =>
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

  // Dashboard calculations from real live orders (no dummy additions)
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
  const activeOrdersCount = orders.filter(
    (o) => o.deliveryStatus !== 'delivered' && o.deliveryStatus !== 'cancelled'
  ).length;
  const totalSkusCount = products.length;
  const activeOffersCount = coupons.filter((c) => c.isActive).length;
  const activeCouponCodes = coupons.filter((c) => c.isActive).map((c) => c.code);

  const inTransitCount = orders.filter((o) => o.deliveryStatus === 'in-transit').length;
  const dispatchedCount = orders.filter((o) => o.deliveryStatus === 'dispatched').length;

  const handleLogout = async () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('nf_visual_edit_active');
        sessionStorage.removeItem('nf_toolbar_dismissed');
      }
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Cache-Control': 'no-cache, no-store' },
      });
    } finally {
      window.location.href = '/admin/login';
    }
  };

  return (
    <div className="admin-layout">
      {/* 1. Left Navigation Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-brand-main-wrap">
            <div className="admin-brand-logo-wrap">
              <img
                src="/images/logo/logo-dark.png"
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

        <nav className="admin-sidebar-nav" ref={navContainerRef} aria-label="Admin Navigation">
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
            <span className="nav-badge-count highlight">{orders.length}</span>
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

          <button
            className={`admin-nav-item ${activeTab === 'whatsapp' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('whatsapp');
              loadCustomers();
            }}
          >
            <MessageSquare size={18} />
            <span>WhatsApp CRM</span>
            {customers.length > 0 && <span className="nav-badge-count">{customers.length}</span>}
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <div
            style={{
              padding: '10px 12px',
              marginBottom: '10px',
              background: '#F9F7F2',
              border: '1px solid rgba(187, 165, 142, 0.3)',
              borderRadius: '10px',
            }}
          >
            <div style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.12em', color: '#8A7258', textTransform: 'uppercase' }}>
              ✦ Authenticated Admin
            </div>
            <div style={{ fontSize: '11px', color: '#707070', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              nooreflamesadmin@gmail.com
            </div>
          </div>

          <Link href="/" target="_blank" className="btn-view-storefront">
            <Eye size={16} />
            <span>View Live Storefront</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              width: '100%',
              marginTop: '8px',
              padding: '10px 14px',
              backgroundColor: 'rgba(220, 38, 38, 0.08)',
              border: '1px solid rgba(220, 38, 38, 0.25)',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.16)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.08)';
            }}
          >
            <LogOut size={14} />
            <span>Sign Out Admin</span>
          </button>
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
              {activeTab === 'whatsapp' && '💬 WhatsApp CRM & Open-WA Automation'}
            </h1>
          </div>

          <div className="admin-topbar-actions">
            <Link
              href="/?visualEdit=true"
              target="_blank"
              className="btn-admin-visual-edit"
              title="Open live storefront with Visual In-Place Editing active (Admin Only)"
            >
              <Edit3 size={15} />
              <span>Visual Edit Storefront</span>
            </Link>

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
                  <div className="kpi-sub">
                    {orders.length > 0 ? `${orders.length} orders placed` : 'Live sales total'}
                  </div>
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
                  <div className="kpi-sub">Candles, Perfumes & Attars</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-label">ACTIVE OFFERS</div>
                  <div className="kpi-value font-serif">{activeOffersCount}</div>
                  <div className="kpi-sub">
                    {activeCouponCodes.length > 0 ? activeCouponCodes.join(', ') : 'No active codes'}
                  </div>
                </div>
              </div>

              {/* Recent Live Orders Section */}
              <div className="admin-card-section">
                <div className="section-card-header">
                  <div className="section-card-title">
                    <span>📦 Recent Live Orders</span>
                  </div>
                  {orders.length > 0 && (
                    <button
                      className="btn-card-action"
                      onClick={() => setActiveTab('orders')}
                    >
                      View All Orders →
                    </button>
                  )}
                </div>

                {orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '52px 24px', color: '#707070' }}>
                    <Package size={42} color="#8A7258" style={{ margin: '0 auto 14px', opacity: 0.85 }} />
                    <h4 style={{ color: '#121212', margin: '0 0 6px 0', fontSize: '16px', fontWeight: 600 }}>
                      No Customer Orders Yet
                    </h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#707070', maxWidth: '380px', marginInline: 'auto' }}>
                      When customers purchase items from your live storefront, their orders and tracking info will automatically appear here.
                    </p>
                  </div>
                ) : (
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
                        {orders.slice(0, 5).map((order) => (
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
                )}
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
                  {['all', 'candles', 'ocean-fresh', 'floral-rose', 'royal-oud', 'discovery-sets', 'gift-shop'].map((cat) => (
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
                    setProductSaveStatus('idle');
                    setIsNewProduct(true);
                    setActiveModalTab('basics');
                    setRawNotes({ top: '', heart: '', base: '', ingredients: '' });
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
                      description: '',
                      gallery: [],
                      topNotes: [],
                      heartNotes: [],
                      baseNotes: [],
                      ingredients: [],
                      volume: '50ml',
                      longevity: '14+ Hours',
                      sillage: 'Radiant Projection',
                      concentration: 'Eau de Parfum',
                      scentFamily: '',
                      usageRitual: '',
                      slug: '',
                      metaTitle: '',
                      metaDescription: '',
                      imageAlt: '',
                      galleryAlt: [],
                      variants: [
                        { name: 'Standard Jar (300g)', price: 999, originalPrice: 1499 },
                        { name: 'Luxe Arch Gift Set', price: 1398, originalPrice: 1899 },
                      ],
                    });
                  }}
                >
                  <Plus size={16} />
                  <span>Add New SKU</span>
                </button>
              </div>

              <div className="products-admin-grid">
                {products
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
                        <Link
                          href={`/product/${product.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="thumb-quick-view-badge"
                          title={`View ${product.title} live in store`}
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </Link>
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
                        <Link
                          href={`/product/${product.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-view-product"
                          title={`View ${product.title} live on store`}
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </Link>
                        <button
                          type="button"
                          className="btn-edit-product"
                          onClick={() => {
                            setProductSaveStatus('idle');
                            setIsNewProduct(false);
                            setActiveModalTab('basics');
                            setRawNotes({
                              top: (product.topNotes || []).join(', '),
                              heart: (product.heartNotes || []).join(', '),
                              base: (product.baseNotes || []).join(', '),
                              ingredients: (product.ingredients || []).join(', '),
                            });
                            const defaultVariants = product.variants && product.variants.length > 0
                              ? product.variants
                              : product.category === 'candles'
                              ? [
                                  { name: 'Standard Jar (300g)', price: product.price, originalPrice: product.originalPrice },
                                  { name: 'Luxe Arch Gift Set', price: product.price + 399, originalPrice: product.originalPrice ? product.originalPrice + 499 : undefined },
                                ]
                              : [
                                  { name: '50ml Eau de Parfum Flacon', price: product.price, originalPrice: product.originalPrice },
                                  { name: '100ml Grand Flacon', price: product.price + 699, originalPrice: product.originalPrice ? product.originalPrice + 899 : undefined },
                                  { name: '10ml Pocket Flacon', price: 699 },
                                ];

                            setEditingProduct({
                              ...product,
                              gallery: product.gallery || [],
                              variants: defaultVariants,
                            });
                          }}
                        >
                          <Edit2 size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className="btn-delete-product"
                          title={`Delete ${product.title}`}
                          onClick={() => {
                            if (confirm(`Delete ${product.title}?`)) {
                              const updatedProducts = products.filter((p) => p.id !== product.id);
                              const updatedStore: StoreData = {
                                ...storeData,
                                products: updatedProducts,
                              };
                              setStoreData(updatedStore);
                              fetch('/api/store', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'include',
                                body: JSON.stringify(updatedStore),
                              }).catch((err) => console.error('Error auto-saving deleted product:', err));
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

              {(() => {
                const filteredOrders = orders.filter((o) => {
                  const matchStatus =
                    orderStatusFilter === 'all' || o.deliveryStatus === orderStatusFilter;
                  const matchSearch =
                    o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                    o.customer.toLowerCase().includes(orderSearch.toLowerCase()) ||
                    o.destination.toLowerCase().includes(orderSearch.toLowerCase());
                  return matchStatus && matchSearch;
                });

                if (filteredOrders.length === 0) {
                  return (
                    <div style={{ textAlign: 'center', padding: '60px 24px', background: '#F9F7F2', borderRadius: '14px', border: '1px solid rgba(187, 165, 142, 0.25)' }}>
                      <Truck size={42} color="#8A7258" style={{ margin: '0 auto 14px', opacity: 0.85 }} />
                      <h4 style={{ color: '#121212', margin: '0 0 6px 0', fontSize: '16px', fontWeight: 600 }}>
                        No Orders Found
                      </h4>
                      <p style={{ margin: 0, fontSize: '13px', color: '#707070' }}>
                        {orderSearch || orderStatusFilter !== 'all'
                          ? 'No orders match your current search or status filter.'
                          : 'No customer orders have been placed yet.'}
                      </p>
                    </div>
                  );
                }

                return (
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
                          <th>STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="clickable-row"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <td className="order-id-text">{order.id}</td>
                            <td>
                              <strong>{order.customer}</strong>
                              <div style={{ fontSize: '11px', color: '#707070' }}>{order.phone}</div>
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
                            <td className="destination-text">
                              {order.destination}
                              {order.distanceKm && (
                                <div style={{ fontSize: '10.5px', color: '#8A7258', marginTop: '2px' }}>
                                  📍 {order.distanceKm} km ({order.zoneName || 'Delhi Hub'})
                                </div>
                              )}
                            </td>
                            <td className="amount-text font-serif">₹{order.amount.toLocaleString('en-IN')}</td>
                            <td>
                              {order.isPartialCod || order.paymentStatus === 'advance_paid' ? (
                                <div>
                                  <span style={{ fontSize: '11px', background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: '4px', fontWeight: 600, display: 'inline-block' }}>
                                    COD (Adv: ₹{order.advanceAmount || 0})
                                  </span>
                                  <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 700, marginTop: '2px' }}>
                                    Due: ₹{(order.remainingCodAmount ?? (order.amount - (order.advanceAmount || 0))).toLocaleString('en-IN')}
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <span>{order.payment}</span>
                                  <span style={{ fontSize: '10.5px', color: '#15803d', display: 'block', fontWeight: 600 }}>
                                    ✓ Fully Paid
                                  </span>
                                </div>
                              )}
                            </td>
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
                );
              })()}
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
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(187, 165, 142, 0.2)' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#121212', marginBottom: '10px' }}>
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
                        border: '1.5px solid',
                        borderColor: storeData.hero.mediaType !== 'image' ? '#121212' : 'rgba(187, 165, 142, 0.35)',
                        background: storeData.hero.mediaType !== 'image' ? '#121212' : '#F9F7F2',
                        color: storeData.hero.mediaType !== 'image' ? '#F9F7F2' : '#707070',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: 600,
                        fontSize: '13px',
                        flex: '1 1 200px',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
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
                        border: '1.5px solid',
                        borderColor: storeData.hero.mediaType === 'image' ? '#121212' : 'rgba(187, 165, 142, 0.35)',
                        background: storeData.hero.mediaType === 'image' ? '#121212' : '#F9F7F2',
                        color: storeData.hero.mediaType === 'image' ? '#F9F7F2' : '#707070',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: 600,
                        fontSize: '13px',
                        flex: '1 1 200px',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
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
                        <span style={{ fontSize: '11px', color: '#707070' }}>Presets:</span>
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
                            background: '#F9F7F2',
                            border: '1px solid rgba(187, 165, 142, 0.35)',
                            color: '#121212',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 600,
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
                            background: '#F9F7F2',
                            border: '1px solid rgba(187, 165, 142, 0.35)',
                            color: '#121212',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 600,
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
                            background: '#F9F7F2',
                            border: '1px solid rgba(187, 165, 142, 0.35)',
                            color: '#121212',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 600,
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

                    <div className="form-field" style={{ marginTop: '8px' }}>
                      <label>Hero Image Alt Text (SEO & Accessibility)</label>
                      <input
                        type="text"
                        value={storeData.hero.imageAlt || ''}
                        placeholder="e.g. NOOR-E-FLAMES artisanal perfume stone flacon and candle atelier at sunset"
                        onChange={(e) =>
                          setStoreData({
                            ...storeData,
                            hero: { ...storeData.hero, imageAlt: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Live Admin Preview */}
                  <div style={{ marginTop: '16px', padding: '14px', background: '#F9F7F2', borderRadius: '10px', border: '1px solid rgba(187, 165, 142, 0.25)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#8A7258', textTransform: 'uppercase' }}>
                        ✦ Live Hero Media Preview
                      </span>
                      <span style={{ fontSize: '11px', color: '#707070' }}>
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

                <div className="form-group-row" style={{ marginTop: '12px' }}>
                  <div className="form-field">
                    <label>Showcase Box Image Alt Text</label>
                    <input
                      type="text"
                      value={storeData.discoveryBanner.showcaseImageAlt || ''}
                      placeholder="e.g. Signature white luxury gift box with golden ribbon"
                      onChange={(e) =>
                        setStoreData({
                          ...storeData,
                          discoveryBanner: {
                            ...storeData.discoveryBanner,
                            showcaseImageAlt: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="form-field">
                    <label>Background Image Alt Text</label>
                    <input
                      type="text"
                      value={storeData.discoveryBanner.backgroundImageAlt || ''}
                      placeholder="e.g. Atelier brand packaging and velvet display"
                      onChange={(e) =>
                        setStoreData({
                          ...storeData,
                          discoveryBanner: {
                            ...storeData.discoveryBanner,
                            backgroundImageAlt: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
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

              {/* Global Storefront SEO & Social Meta Card */}
              <div className="admin-editor-card" style={{ marginTop: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Sparkles size={18} color="#BBA58E" />
                  <h3 className="editor-card-title font-serif" style={{ margin: 0 }}>
                    Global Storefront SEO & Social Metadata
                  </h3>
                </div>
                <p style={{ color: '#707070', fontSize: '13px', marginBottom: '18px' }}>
                  Configure the default website title, description, and social share alt text used by search engines when users browse your root store domain.
                </p>

                <div className="form-field">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontWeight: 600 }}>Global Homepage Meta Title</label>
                    <span style={{ fontSize: '11px', color: '#888' }}>
                      {(storeData.siteSettings.metaTitle || '').length} / 60 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={storeData.siteSettings.metaTitle || ''}
                    placeholder="e.g. NOOR-E-FLAMES | Where Fragrance Meets Flames — Artisanal Perfumes & Candles"
                    onChange={(e) =>
                      setStoreData({
                        ...storeData,
                        siteSettings: {
                          ...storeData.siteSettings,
                          metaTitle: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="form-field">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontWeight: 600 }}>Global Homepage Meta Description</label>
                    <span style={{ fontSize: '11px', color: '#888' }}>
                      {(storeData.siteSettings.metaDescription || '').length} / 160 chars
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={storeData.siteSettings.metaDescription || ''}
                    placeholder="e.g. Handcrafted luxury perfumes, alcohol-free traditional attars, and clean-burning soy candles with secret messages. Artisanal small batches formulated in New Delhi."
                    onChange={(e) =>
                      setStoreData({
                        ...storeData,
                        siteSettings: {
                          ...storeData.siteSettings,
                          metaDescription: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="form-field">
                  <label style={{ fontWeight: 600 }}>Default Brand Image Alt Text</label>
                  <input
                    type="text"
                    value={storeData.siteSettings.defaultImageAlt || ''}
                    placeholder="e.g. NOOR-E-FLAMES luxury perfume and candles signature collection"
                    onChange={(e) =>
                      setStoreData({
                        ...storeData,
                        siteSettings: {
                          ...storeData.siteSettings,
                          defaultImageAlt: e.target.value,
                        },
                      })
                    }
                  />
                </div>
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
                    setCouponSaveStatus('idle');
                    setIsNewCoupon(true);
                    setEditingCoupon({
                      code: '',
                      discountPercent: 15,
                      discountAmount: 0,
                      minOrder: 999,
                      description: '15% off orders above ₹999',
                      isActive: true,
                      freeShipping: false,
                    });
                  }}
                >
                  <Plus size={16} />
                  <span>Create New Coupon</span>
                </button>
              </div>

              <div className="coupons-grid">
                {coupons.map((coupon) => (
                  <div key={coupon.code} className="coupon-admin-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="coupon-header">
                      <span className="coupon-code-badge font-mono">{coupon.code}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '10.5px', color: coupon.isActive ? '#166534' : '#888', fontWeight: 600 }}>
                          {coupon.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={coupon.isActive}
                            onChange={(e) => {
                              const updatedCoupons = coupons.map((c) =>
                                c.code === coupon.code ? { ...c, isActive: e.target.checked } : c
                              );
                              const updatedStore = {
                                ...storeData,
                                coupons: updatedCoupons,
                              };
                              setStoreData(updatedStore);
                              fetch('/api/store', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'include',
                                body: JSON.stringify(updatedStore),
                              }).catch((err) => console.error('Error auto-saving coupon toggle:', err));
                            }}
                          />
                          <span className="slider" />
                        </label>
                      </div>
                    </div>
                    <div className="coupon-discount font-serif">
                      {coupon.discountPercent > 0
                        ? `${coupon.discountPercent}% OFF`
                        : coupon.fixedPrice
                        ? `₹${coupon.fixedPrice.toLocaleString('en-IN')} BUNDLE`
                        : coupon.discountAmount
                        ? `₹${coupon.discountAmount.toLocaleString('en-IN')} OFF`
                        : 'FREE SHIPPING'}
                    </div>
                    <p className="coupon-desc">{coupon.description}</p>
                    <div className="coupon-meta" style={{ marginBottom: '12px' }}>
                      Min. Order Value: ₹{coupon.minOrder.toLocaleString('en-IN')}
                      {coupon.freeShipping && ' · Free Shipping Included'}
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', borderTop: '1px solid #f0ede8', paddingTop: '12px' }}>
                      <button
                        type="button"
                        className="btn-edit-product"
                        style={{ padding: '6px 12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                        onClick={() => {
                          setCouponSaveStatus('idle');
                          setIsNewCoupon(false);
                          setEditingCoupon({ ...coupon });
                        }}
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        style={{
                          padding: '6px 10px',
                          fontSize: '11px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#dc2626',
                          background: '#fee2e2',
                          border: '1px solid #fecaca',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleDeleteCoupon(coupon.code)}
                        title="Delete coupon"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
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
                <p style={{ color: '#707070', marginBottom: '16px' }}>
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

          {/* 7. WHATSAPP CRM & AUTOMATION (Open-WA API Integration) */}
          {activeTab === 'whatsapp' && (
            <div className="tab-pane active" id="tab-whatsapp">
              <div className="tab-header">
                <div>
                  <h2 className="tab-title font-serif">WhatsApp Automated Commerce CRM</h2>
                  <p className="tab-subtitle">
                    Automated, personalized notifications powered by Open-WA (<a href="https://www.open-wa.org/" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'underline' }}>open-wa.org</a>) & WhatsApp Cloud API
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button className="btn-admin-secondary" onClick={loadCustomers} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <RefreshCw size={14} />
                    <span>Refresh Customers</span>
                  </button>
                  <span
                    style={{
                      background: 'rgba(37, 211, 102, 0.15)',
                      border: '1px solid rgba(37, 211, 102, 0.4)',
                      color: '#25D366',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#25D366', display: 'inline-block' }}></span>
                    Open-WA Gateway Active
                  </span>
                </div>
              </div>

              {whatsappFeedback && (
                <div
                  style={{
                    marginBottom: '20px',
                    padding: '12px 18px',
                    borderRadius: '8px',
                    background: whatsappStatus === 'sent' ? 'rgba(37, 211, 102, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    border: `1px solid ${whatsappStatus === 'sent' ? 'rgba(37, 211, 102, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                    color: whatsappStatus === 'sent' ? '#25D366' : '#ef4444',
                    fontSize: '13px',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <MessageSquare size={16} />
                  <span>{whatsappFeedback}</span>
                </div>
              )}

              {/* Grid: Broadcaster + Automation Rules */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                {/* 1. Direct Messenger & Test Dispatch */}
                <div className="admin-editor-card" style={{ padding: '24px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Send size={18} style={{ color: '#25D366' }} />
                    <h3 className="editor-card-title font-serif" style={{ margin: 0 }}>Dispatch Personalized Message</h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Customer Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ayesha Khan"
                        value={customWaName}
                        onChange={(e) => setCustomWaName(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        WhatsApp Number (+91 Mobile)
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 9876543210 or +919876543210"
                        value={customWaRecipient}
                        onChange={(e) => setCustomWaRecipient(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Message Preset / Template
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomWaTemplate('welcome');
                            setCustomWaMessage('✨ *Welcome to Nooreflames Atelier, {name}!* ✨\n\nYour account is now activated. Explore our signature handcrafted candles and luxury extrait de parfums.\n\nEnjoy *10% OFF* your first purchase with VIP Code: *WELCOME10*\n\nExplore catalog: https://nooreflames.vercel.app');
                          }}
                          style={{
                            flex: 1,
                            padding: '8px 10px',
                            fontSize: '11px',
                            borderRadius: '6px',
                            background: customWaTemplate === 'welcome' ? 'rgba(37,211,102,0.2)' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${customWaTemplate === 'welcome' ? '#25D366' : 'rgba(255,255,255,0.1)'}`,
                            color: customWaTemplate === 'welcome' ? '#25D366' : '#bbb',
                            cursor: 'pointer',
                          }}
                        >
                          Welcome (10% Off)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomWaTemplate('offer');
                            setCustomWaMessage('🕯️ *Exclusive Atelier Invitation for {name}* 🕯️\n\nWe have just reserved our limited batch flacons for our VIP patrons. Enjoy *15% OFF* today with secret code: *VIP15*\n\nReserve now: https://nooreflames.vercel.app');
                          }}
                          style={{
                            flex: 1,
                            padding: '8px 10px',
                            fontSize: '11px',
                            borderRadius: '6px',
                            background: customWaTemplate === 'offer' ? 'rgba(37,211,102,0.2)' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${customWaTemplate === 'offer' ? '#25D366' : 'rgba(255,255,255,0.1)'}`,
                            color: customWaTemplate === 'offer' ? '#25D366' : '#bbb',
                            cursor: 'pointer',
                          }}
                        >
                          Special VIP Offer
                        </button>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Message Body (supports {'{name}'} personalization)
                      </label>
                      <textarea
                        rows={5}
                        value={customWaMessage}
                        onChange={(e) => setCustomWaMessage(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '12px', fontFamily: 'monospace', resize: 'vertical' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                      <button
                        type="button"
                        className="btn-admin-primary"
                        disabled={whatsappStatus === 'sending' || !customWaRecipient.trim()}
                        onClick={() => handleSendWhatsApp(customWaRecipient, customWaName || 'Valued Patron', 'custom', customWaMessage)}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          background: '#25D366',
                          color: '#000',
                          fontWeight: 700,
                          cursor: customWaRecipient.trim() ? 'pointer' : 'not-allowed',
                          opacity: customWaRecipient.trim() ? 1 : 0.6,
                        }}
                      >
                        <Send size={15} />
                        <span>{whatsappStatus === 'sending' ? 'Dispatching...' : 'Send via Open-WA'}</span>
                      </button>

                      {customWaRecipient && (
                        <a
                          href={`https://wa.me/91${customWaRecipient.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(customWaMessage.replace(/\{name\}/g, customWaName || 'there'))}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-admin-secondary"
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                          title="Open WhatsApp Web chat directly"
                        >
                          <ExternalLink size={14} />
                          <span>Direct WA</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Automation Overview & Open-WA Specs */}
                <div className="admin-editor-card" style={{ padding: '24px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 className="editor-card-title font-serif" style={{ marginBottom: '14px' }}>Active Automated Triggers</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 600, fontSize: '13px', color: '#fff' }}>1. Customer Sign-Up Welcome</span>
                          <span style={{ fontSize: '10px', background: '#25D366', color: '#000', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>ACTIVE</span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
                          Sends a personalized greeting to customer's WhatsApp upon account creation with their name and coupon code <strong>WELCOME10</strong>.
                        </p>
                      </div>

                      <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 600, fontSize: '13px', color: '#fff' }}>2. Order Confirmation & COD Tracker</span>
                          <span style={{ fontSize: '10px', background: '#25D366', color: '#000', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>ACTIVE</span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
                          Dispatches automated order details, items summary, delivery address, and remaining COD balance directly to customer's WhatsApp upon checkout.
                        </p>
                      </div>

                      <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 600, fontSize: '13px', color: '#fff' }}>3. Shipment & Delivery Updates</span>
                          <span style={{ fontSize: '10px', background: '#25D366', color: '#000', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>ACTIVE</span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
                          When you update an order status to Dispatched or Delivered in the Orders tab, an automatic status ping is triggered to the customer's WhatsApp.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '20px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(212, 175, 55, 0.08)', border: '1px solid rgba(212, 175, 55, 0.2)', fontSize: '12px', color: '#d4af37' }}>
                    💡 <strong>Open-WA Configuration:</strong> Configure your Open-WA REST URL in <code>.env.local</code> (e.g. <code>OPENWA_API_URL=http://localhost:8080</code>). Even without a running container, the fallback ensures reliable fallback links and seamless customer registration.
                  </div>
                </div>
              </div>

              {/* Registered Customers Directory */}
              <div className="admin-editor-card" style={{ padding: '24px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={18} style={{ color: '#25D366' }} />
                    <h3 className="editor-card-title font-serif" style={{ margin: 0 }}>Registered Customers WhatsApp Directory</h3>
                  </div>
                  <span style={{ fontSize: '12px', color: '#888' }}>
                    Total Customers: <strong>{customers.length}</strong>
                  </span>
                </div>

                {customers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '36px 20px', color: '#888' }}>
                    <MessageSquare size={32} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
                    <p style={{ fontSize: '14px', marginBottom: '6px' }}>No customer registrations with WhatsApp phone numbers recorded yet.</p>
                    <p style={{ fontSize: '12px', color: '#666' }}>When patrons register or place an order with their phone number, they will automatically appear here.</p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: '#888' }}>
                          <th style={{ padding: '10px 12px' }}>Customer</th>
                          <th style={{ padding: '10px 12px' }}>Email</th>
                          <th style={{ padding: '10px 12px' }}>WhatsApp Number</th>
                          <th style={{ padding: '10px 12px' }}>Registered On</th>
                          <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map((c) => (
                          <tr key={c.id || c.email} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '12px', fontWeight: 600, color: '#fff' }}>{c.name || 'Valued Patron'}</td>
                            <td style={{ padding: '12px', color: '#aaa' }}>{c.email || '—'}</td>
                            <td style={{ padding: '12px' }}>
                              {c.phone ? (
                                <span style={{ color: '#25D366', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                  <Phone size={13} />
                                  {c.phone.startsWith('+91') ? c.phone : `+91 ${c.phone}`}
                                </span>
                              ) : (
                                <span style={{ color: '#666' }}>Not provided</span>
                              )}
                            </td>
                            <td style={{ padding: '12px', color: '#888', fontSize: '12px' }}>
                              {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recent'}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right' }}>
                              {c.phone ? (
                                <div style={{ display: 'inline-flex', gap: '6px' }}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCustomWaRecipient(c.phone);
                                      setCustomWaName(c.name || '');
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    style={{
                                      padding: '6px 10px',
                                      fontSize: '11px',
                                      borderRadius: '4px',
                                      background: 'rgba(255,255,255,0.08)',
                                      border: '1px solid rgba(255,255,255,0.15)',
                                      color: '#fff',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    Load into Broadcaster
                                  </button>
                                  <a
                                    href={`https://wa.me/91${c.phone.replace(/\D/g, '').slice(-10)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      padding: '6px 10px',
                                      fontSize: '11px',
                                      borderRadius: '4px',
                                      background: 'rgba(37,211,102,0.15)',
                                      border: '1px solid rgba(37,211,102,0.3)',
                                      color: '#25D366',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      textDecoration: 'none',
                                    }}
                                  >
                                    <ExternalLink size={12} />
                                    <span>Chat</span>
                                  </a>
                                </div>
                              ) : (
                                <span style={{ color: '#555', fontSize: '11px' }}>—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 3. Mobile Luxury Native App Bottom Navigation Bar (Fixed to viewport bottom) */}
      <nav className="admin-mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
        <button
          type="button"
          className={`admin-bottom-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
          aria-label="Dashboard"
        >
          <div className="tab-icon-wrap">
            <LayoutDashboard size={20} />
          </div>
          <span className="tab-label">Dashboard</span>
        </button>

        <button
          type="button"
          className={`admin-bottom-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
          aria-label="Products"
        >
          <div className="tab-icon-wrap">
            <Package size={20} />
            {totalSkusCount > 0 && (
              <span className="tab-icon-badge">{totalSkusCount}</span>
            )}
          </div>
          <span className="tab-label">Products</span>
        </button>

        <button
          type="button"
          className={`admin-bottom-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
          aria-label="Orders"
        >
          <div className="tab-icon-wrap">
            <Truck size={20} />
            {orders.length > 0 && (
              <span className="tab-icon-badge highlight">{orders.length}</span>
            )}
          </div>
          <span className="tab-label">Orders</span>
        </button>

        <button
          type="button"
          className={`admin-bottom-tab ${activeTab === 'whatsapp' ? 'active' : ''}`}
          onClick={() => setActiveTab('whatsapp')}
          aria-label="WhatsApp"
        >
          <div className="tab-icon-wrap">
            <MessageSquare size={20} />
            {customers.length > 0 && (
              <span className="tab-icon-badge" style={{ background: '#25D366', color: '#000' }}>{customers.length}</span>
            )}
          </div>
          <span className="tab-label">WhatsApp</span>
        </button>

        <button
          type="button"
          className={`admin-bottom-tab ${activeTab === 'banners' ? 'active' : ''}`}
          onClick={() => setActiveTab('banners')}
          aria-label="Banners"
        >
          <div className="tab-icon-wrap">
            <ImageIcon size={20} />
          </div>
          <span className="tab-label">Banners</span>
        </button>

        <button
          type="button"
          className={`admin-bottom-tab ${activeTab === 'offers' ? 'active' : ''}`}
          onClick={() => setActiveTab('offers')}
          aria-label="Offers"
        >
          <div className="tab-icon-wrap">
            <Tag size={20} />
          </div>
          <span className="tab-label">Offers</span>
        </button>

        <button
          type="button"
          className={`admin-bottom-tab ${activeTab === 'sync' ? 'active' : ''}`}
          onClick={() => setActiveTab('sync')}
          aria-label="Deploy"
        >
          <div className="tab-icon-wrap">
            <Rocket size={20} />
          </div>
          <span className="tab-label">Deploy</span>
        </button>
      </nav>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="admin-modal-backdrop" onClick={() => setEditingProduct(null)}>
          <div className="admin-modal-card admin-modal-wide" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
            {/* Top Right Close / Cut Button */}
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#FAF8F5',
                border: '1px solid rgba(18, 18, 18, 0.12)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#707070',
                transition: 'all 0.2s ease',
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#121212';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FAF8F5';
                e.currentTarget.style.color = '#707070';
              }}
              title="Close modal"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingRight: '48px', flexWrap: 'wrap' }}>
              <h3 className="modal-title font-serif" style={{ margin: 0, paddingBottom: 0, borderBottom: 'none' }}>
                {isNewProduct ? 'Add New Product / SKU' : `Edit: ${editingProduct.title || 'Product'}`}
              </h3>
              {editingProduct.badge && (
                <span style={{ fontSize: '10px', background: '#121212', color: '#FAF8F5', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                  {editingProduct.badge}
                </span>
              )}
            </div>

            {/* Sub-tab Navigation: All in Front (2-col grid on mobile, wrapped chips on desktop) */}
            <div className="modal-subtabs-nav">
              <button
                type="button"
                className={`modal-subtab-btn ${activeModalTab === 'basics' ? 'active' : ''}`}
                onClick={() => setActiveModalTab('basics')}
              >
                <Tag size={13} />
                <span className="subtab-label">1. Basics & Pricing</span>
              </button>
              <button
                type="button"
                className={`modal-subtab-btn ${activeModalTab === 'variants' ? 'active' : ''}`}
                onClick={() => setActiveModalTab('variants')}
              >
                <Sliders size={13} />
                <span className="subtab-label">2. Editions & Vol</span>
                {(editingProduct.variants || []).length > 0 && (
                  <span className="subtab-badge">{(editingProduct.variants || []).length}</span>
                )}
              </button>
              <button
                type="button"
                className={`modal-subtab-btn ${activeModalTab === 'media' ? 'active' : ''}`}
                onClick={() => setActiveModalTab('media')}
              >
                <ImageIcon size={13} />
                <span className="subtab-label">3. Images & Media</span>
                {(editingProduct.gallery?.length || 0) > 0 && (
                  <span className="subtab-badge">{editingProduct.gallery?.length || 0}</span>
                )}
              </button>
              <button
                type="button"
                className={`modal-subtab-btn ${activeModalTab === 'story' ? 'active' : ''}`}
                onClick={() => setActiveModalTab('story')}
              >
                <FileText size={13} />
                <span className="subtab-label">4. Story & Ritual</span>
              </button>
              <button
                type="button"
                className={`modal-subtab-btn ${activeModalTab === 'notes' ? 'active' : ''}`}
                onClick={() => setActiveModalTab('notes')}
              >
                <Sparkles size={13} />
                <span className="subtab-label">5. Scent & Notes</span>
              </button>
              <button
                type="button"
                className={`modal-subtab-btn ${activeModalTab === 'specs' ? 'active' : ''}`}
                onClick={() => setActiveModalTab('specs')}
              >
                <Package size={13} />
                <span className="subtab-label">6. Specs & Stock</span>
              </button>
              <button
                type="button"
                className={`modal-subtab-btn ${activeModalTab === 'seo' ? 'active' : ''}`}
                onClick={() => setActiveModalTab('seo')}
              >
                <Search size={13} />
                <span className="subtab-label">7. SEO, Slug & Meta</span>
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="modal-scroll-body">
              {/* TAB 1: BASICS & PRICING */}
              {activeModalTab === 'basics' && (
                <>
                  <div className="form-group-row">
                    <div className="form-field">
                      <label>SKU Code</label>
                      <input
                        type="text"
                        value={editingProduct.sku}
                        onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                        placeholder="e.g. NF-CAN-001"
                      />
                    </div>
                    <div className="form-field">
                      <label>Category</label>
                      <select
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      >
                        <option value="candles">Candles & Aromatics</option>
                        <option value="ocean-fresh">Oceanic & Fresh Eau de Parfum</option>
                        <option value="floral-rose">Floral & Rose Haute</option>
                        <option value="royal-oud">Royal Oud & Rare Woods</option>
                        <option value="discovery-sets">Discovery Sets & Vaults</option>
                        <option value="gift-shop">Curated Gift Boxes</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Product Title</label>
                    <input
                      type="text"
                      value={editingProduct.title}
                      onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                      placeholder="e.g. Whispered Surprises Secret Message Candle"
                    />
                  </div>

                  <div className="form-field">
                    <label>Subtitle / Scent Headline</label>
                    <input
                      type="text"
                      value={editingProduct.subtitle || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                      placeholder="e.g. Hand-Poured Soy Wax · Hidden Love Note Melts into View"
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
                      <label>Original MRP (₹)</label>
                      <input
                        type="number"
                        value={editingProduct.originalPrice || ''}
                        placeholder="e.g. 1599"
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })
                        }
                      />
                    </div>
                  </div>

                  {/* Quick Preview & Link to Editions / Volumes */}
                  <div
                    className="admin-variants-preview-box"
                    onClick={() => setActiveModalTab('variants')}
                    title="Click to customize edition variants & prices"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#8E7051', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sliders size={13} />
                        Select Edition / Volume ({(editingProduct.variants || []).length} Options Configured)
                      </span>
                      <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#121212', textDecoration: 'underline' }}>
                        Manage Editions & Prices →
                      </span>
                    </div>
                    <div className="admin-variant-chips">
                      {(editingProduct.variants || []).map((v, i) => (
                        <span key={i} className="admin-variant-chip">
                          <strong>{v.name}</strong> · ₹{v.price} {v.originalPrice ? <span style={{ color: '#888', textDecoration: 'line-through', marginLeft: '4px' }}>₹{v.originalPrice}</span> : null}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="form-group-row">
                    <div className="form-field">
                      <label>Badge Tag (Optional)</label>
                      <input
                        type="text"
                        value={editingProduct.badge || ''}
                        placeholder="e.g. BESTSELLER, SECRET MESSAGE, LIMITED EDITION"
                        onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                      />
                    </div>
                    <div className="form-field">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label style={{ margin: 0 }}>URL Slug / Shortlink</label>
                        <button
                          type="button"
                          onClick={() => {
                            if (editingProduct.title) {
                              const autoSlug = editingProduct.title
                                .toLowerCase()
                                .trim()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/^-+|-+$/g, '');
                              setEditingProduct({ ...editingProduct, slug: autoSlug });
                            }
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#8E7051',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                        >
                          ⚡ Auto-Generate from Title
                        </button>
                      </div>
                      <input
                        type="text"
                        value={editingProduct.slug || ''}
                        placeholder="e.g. whispered-surprises"
                        onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                      />
                      <span className="form-field-hint" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                        <span>Path: <strong>/product/{editingProduct.slug || editingProduct.id}</strong></span>
                        <button
                          type="button"
                          onClick={() => setActiveModalTab('seo')}
                          style={{ background: 'none', border: 'none', color: '#121212', textDecoration: 'underline', fontSize: '11px', cursor: 'pointer' }}
                        >
                          Full SEO & Meta Settings →
                        </button>
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: EDITIONS & VOLUME VARIANTS */}
              {activeModalTab === 'variants' && (
                <>
                  <div className="modal-section-title">
                    <Sliders size={15} />
                    <span>Select Edition / Volume Variants (Live Product Page)</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '-6px', marginBottom: '14px' }}>
                    These edition choices appear as clickable cards under <strong>"SELECT EDITION / VOLUME"</strong> on the product detail page. Customers can pick an edition/gift set, and the price dynamically updates for cart checkout.
                  </p>

                  {/* Preset quick actions */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      style={{
                        background: '#F9F7F2',
                        border: '1px solid rgba(187, 165, 142, 0.4)',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        color: '#555',
                      }}
                      onClick={() => {
                        setEditingProduct({
                          ...editingProduct,
                          variants: [
                            { name: 'Standard Jar (300g)', price: editingProduct.price, originalPrice: editingProduct.originalPrice },
                            { name: 'Luxe Arch Gift Set', price: editingProduct.price + 399, originalPrice: editingProduct.originalPrice ? editingProduct.originalPrice + 499 : undefined },
                          ],
                        });
                      }}
                    >
                      + Load Candle Presets (300g Jar & Luxe Gift Set)
                    </button>
                    <button
                      type="button"
                      style={{
                        background: '#F9F7F2',
                        border: '1px solid rgba(187, 165, 142, 0.4)',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        color: '#555',
                      }}
                      onClick={() => {
                        setEditingProduct({
                          ...editingProduct,
                          variants: [
                            { name: '50ml Eau de Parfum Flacon', price: editingProduct.price, originalPrice: editingProduct.originalPrice },
                            { name: '100ml Grand Flacon', price: editingProduct.price + 699, originalPrice: editingProduct.originalPrice ? editingProduct.originalPrice + 899 : undefined },
                            { name: '10ml Pocket Flacon', price: 699 },
                          ],
                        });
                      }}
                    >
                      + Load Perfume Presets (50ml, 100ml, 10ml)
                    </button>
                  </div>

                  {/* Variant cards list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    {(editingProduct.variants || []).map((variant, idx) => (
                      <div key={idx} className="admin-variant-card">
                        <div className="form-field">
                          <label>Edition / Volume Title</label>
                          <input
                            type="text"
                            value={variant.name}
                            placeholder="e.g. Standard Jar (300g) or Luxe Arch Gift Set"
                            onChange={(e) => {
                              const updated = [...(editingProduct.variants || [])];
                              updated[idx] = { ...updated[idx], name: e.target.value };
                              setEditingProduct({ ...editingProduct, variants: updated });
                            }}
                          />
                        </div>

                        <div className="form-field">
                          <label>Selling Price (₹)</label>
                          <input
                            type="number"
                            value={variant.price}
                            placeholder="e.g. 899"
                            onChange={(e) => {
                              const updated = [...(editingProduct.variants || [])];
                              updated[idx] = { ...updated[idx], price: Number(e.target.value) };
                              setEditingProduct({ ...editingProduct, variants: updated });
                            }}
                          />
                        </div>

                        <div className="form-field">
                          <label>Original MRP (₹)</label>
                          <input
                            type="number"
                            value={variant.originalPrice || ''}
                            placeholder="e.g. 1599"
                            onChange={(e) => {
                              const updated = [...(editingProduct.variants || [])];
                              updated[idx] = {
                                ...updated[idx],
                                originalPrice: e.target.value ? Number(e.target.value) : undefined,
                              };
                              setEditingProduct({ ...editingProduct, variants: updated });
                            }}
                          />
                        </div>

                        <button
                          type="button"
                          className="btn-remove-variant"
                          title="Delete this edition variant"
                          onClick={() => {
                            const updated = [...(editingProduct.variants || [])];
                            updated.splice(idx, 1);
                            setEditingProduct({ ...editingProduct, variants: updated });
                          }}
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add variant button */}
                  <button
                    type="button"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#121212',
                      color: '#FFFFFF',
                      padding: '9px 18px',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: 'none',
                    }}
                    onClick={() => {
                      const current = editingProduct.variants || [];
                      setEditingProduct({
                        ...editingProduct,
                        variants: [
                          ...current,
                          {
                            name: `Edition ${current.length + 1}`,
                            price: editingProduct.price,
                            originalPrice: editingProduct.originalPrice,
                          },
                        ],
                      });
                    }}
                  >
                    <Plus size={15} />
                    <span>Add New Edition / Volume Option</span>
                  </button>
                </>
              )}

              {/* TAB 2: IMAGES & GALLERY */}
              {activeModalTab === 'media' && (
                <>
                  <div className="modal-section-title">
                    <ImageIcon size={15} />
                    <span>Primary Showcase Image</span>
                  </div>

                  <div className="admin-upload-preview-card">
                    <img
                      src={editingProduct.image || '/images/products/placeholder.jpg'}
                      alt="Primary Preview"
                      className="admin-upload-thumb"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <div className="admin-upload-actions">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <label className="btn-upload-file">
                          <Upload size={14} />
                          <span>{uploadingMainImage ? 'Uploading Image...' : 'Upload Image from Computer'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingMainImage}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setUploadingMainImage(true);
                              try {
                                const url = await handleUploadImage(file);
                                if (url) {
                                  setEditingProduct({ ...editingProduct, image: url });
                                }
                              } finally {
                                setUploadingMainImage(false);
                              }
                            }}
                          />
                        </label>
                        {uploadingMainImage && (
                          <span style={{ fontSize: '12px', color: '#8E7051', fontWeight: 600 }}>Saving file to server...</span>
                        )}
                      </div>

                      <div className="form-field" style={{ margin: 0 }}>
                        <label style={{ fontSize: '11px', color: '#666' }}>Or Paste Image URL / Public Path</label>
                        <input
                          type="text"
                          value={editingProduct.image || ''}
                          placeholder="/images/products/my-photo.jpg or https://..."
                          onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                        />
                      </div>

                      <div className="form-field" style={{ margin: '8px 0 0 0' }}>
                        <label style={{ fontSize: '11px', color: '#121212', fontWeight: 600 }}>
                          Primary Image Alt Text (SEO & Accessibility)
                        </label>
                        <input
                          type="text"
                          value={editingProduct.imageAlt || ''}
                          placeholder="e.g. Whispered Surprises hand-poured candle in luxury glass vessel"
                          onChange={(e) => setEditingProduct({ ...editingProduct, imageAlt: e.target.value })}
                        />
                        <span className="form-field-hint" style={{ fontSize: '10.5px' }}>
                          Used for Google Image search ranking and visually impaired screen readers.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="modal-section-title" style={{ marginTop: '22px' }}>
                    <Layers size={15} />
                    <span>Product Gallery / Multi-Angles ({(editingProduct.gallery || []).length} photos)</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '-6px', marginBottom: '12px' }}>
                    These photos appear in the high-resolution product gallery thumbnail strip, zoom lens, and 3D preview.
                  </p>

                  {/* Gallery Grid */}
                  <div className="gallery-grid-container">
                    {(editingProduct.gallery || []).map((imgUrl, idx) => (
                      <div key={idx} className="gallery-thumb-item" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ position: 'relative', width: '100%', height: '110px' }}>
                          <img
                            src={imgUrl}
                            alt={(editingProduct.galleryAlt && editingProduct.galleryAlt[idx]) || `Gallery photo ${idx + 1}`}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                          <button
                            type="button"
                            className="gallery-thumb-remove"
                            title="Remove image"
                            onClick={() => {
                              const updated = [...(editingProduct.gallery || [])];
                              updated.splice(idx, 1);
                              const updatedAlt = [...(editingProduct.galleryAlt || [])];
                              updatedAlt.splice(idx, 1);
                              setEditingProduct({ ...editingProduct, gallery: updated, galleryAlt: updatedAlt });
                            }}
                          >
                            <X size={13} />
                          </button>
                          <button
                            type="button"
                            className="gallery-thumb-primary-badge"
                            title="Set as main showcase photo"
                            onClick={() => setEditingProduct({ ...editingProduct, image: imgUrl, imageAlt: (editingProduct.galleryAlt && editingProduct.galleryAlt[idx]) || editingProduct.imageAlt })}
                          >
                            {editingProduct.image === imgUrl ? '★ Primary' : 'Make Primary'}
                          </button>
                        </div>
                        <input
                          type="text"
                          value={(editingProduct.galleryAlt && editingProduct.galleryAlt[idx]) || ''}
                          placeholder={`Alt text for photo #${idx + 1}...`}
                          style={{
                            fontSize: '10px',
                            padding: '3px 5px',
                            border: '1px solid rgba(187, 165, 142, 0.35)',
                            borderRadius: '4px',
                            marginTop: '4px',
                            width: '100%',
                            boxSizing: 'border-box',
                            background: '#FFFFFF',
                          }}
                          onChange={(e) => {
                            const updatedAlt = [...(editingProduct.galleryAlt || [])];
                            while (updatedAlt.length < (editingProduct.gallery || []).length) {
                              updatedAlt.push('');
                            }
                            updatedAlt[idx] = e.target.value;
                            setEditingProduct({ ...editingProduct, galleryAlt: updatedAlt });
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Add to Gallery Controls */}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', background: '#F9F7F2', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(187, 165, 142, 0.3)' }}>
                    <label className="btn-upload-file">
                      <Plus size={14} />
                      <span>{uploadingGallery ? 'Uploading to Gallery...' : 'Upload Photos to Gallery'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={uploadingGallery}
                        onChange={async (e) => {
                          const files = e.target.files;
                          if (!files || files.length === 0) return;
                          setUploadingGallery(true);
                          try {
                            const newUrls: string[] = [];
                            for (let i = 0; i < files.length; i++) {
                              const u = await handleUploadImage(files[i]);
                              if (u) newUrls.push(u);
                            }
                            if (newUrls.length > 0) {
                              setEditingProduct({
                                ...editingProduct,
                                gallery: [...(editingProduct.gallery || []), ...newUrls],
                              });
                            }
                          } finally {
                            setUploadingGallery(false);
                          }
                        }}
                      />
                    </label>

                    <div style={{ flex: 1, display: 'flex', gap: '8px', minWidth: '220px' }}>
                      <input
                        type="text"
                        style={{
                          background: '#FFFFFF',
                          border: '1.5px solid rgba(187, 165, 142, 0.35)',
                          borderRadius: '6px',
                          padding: '7px 12px',
                          fontSize: '12.5px',
                          flex: 1,
                        }}
                        placeholder="Or enter image URL to add..."
                        value={newGalleryUrl}
                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newGalleryUrl.trim()) {
                              setEditingProduct({
                                ...editingProduct,
                                gallery: [...(editingProduct.gallery || []), newGalleryUrl.trim()],
                              });
                              setNewGalleryUrl('');
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        style={{
                          background: '#121212',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '7px 14px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          if (newGalleryUrl.trim()) {
                            setEditingProduct({
                              ...editingProduct,
                              gallery: [...(editingProduct.gallery || []), newGalleryUrl.trim()],
                            });
                            setNewGalleryUrl('');
                          }
                        }}
                      >
                        + Add URL
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 3: DESCRIPTION & RITUAL */}
              {activeModalTab === 'story' && (
                <>
                  <div className="form-field">
                    <label>The Olfactory & Artisanal Story (Description)</label>
                    <span className="form-field-hint">
                      This narrative is prominently highlighted on the product page story section and "The Olfactory Story" accordion.
                    </span>
                    <textarea
                      rows={5}
                      value={editingProduct.description || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      placeholder="Detail the inspiration, artisanal craftsmanship, scent evolution, or the secret hidden note experience..."
                    />
                  </div>

                  <div className="form-field">
                    <label>Application Ritual & Usage Tips</label>
                    <span className="form-field-hint">
                      Instructions displayed in the "Application Ritual & Tips" accordion.
                    </span>
                    <textarea
                      rows={4}
                      value={editingProduct.usageRitual || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, usageRitual: e.target.value })}
                      placeholder="e.g. For candles: Trim wick to 1/4 inch before lighting. Allow wax pool to melt evenly to the glass edge on the first burn to prevent tunneling..."
                    />
                  </div>
                </>
              )}

              {/* TAB 4: SCENT NOTES & INGREDIENTS */}
              {activeModalTab === 'notes' && (
                <>
                  <div className="modal-section-title">
                    <Sparkles size={15} />
                    <span>The Olfactory Pyramid (Scent / Candle Notes)</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '-6px', marginBottom: '14px' }}>
                    Enter scent notes separated by commas. These will be formatted into interactive notes chips and the pyramid chart.
                  </p>

                  <div className="form-field">
                    <label>Top Notes (Initial 0–30 Minutes Impression)</label>
                    <input
                      type="text"
                      value={rawNotes.top}
                      onChange={(e) => setRawNotes({ ...rawNotes, top: e.target.value })}
                      placeholder="e.g. Calabrian Bergamot, Pink Pepper, Sparkling Pear, Sea Salt"
                    />
                    <span className="form-field-hint">Separate with commas</span>
                  </div>

                  <div className="form-field">
                    <label>Heart / Middle Notes (30 Mins — 4 Hours Radiant Core)</label>
                    <input
                      type="text"
                      value={rawNotes.heart}
                      onChange={(e) => setRawNotes({ ...rawNotes, heart: e.target.value })}
                      placeholder="e.g. Damask Rose, French Orange Blossom, White Jasmine Sambac"
                    />
                    <span className="form-field-hint">Separate with commas</span>
                  </div>

                  <div className="form-field">
                    <label>Base Notes (4 — 14+ Hours Deep Sillage & Warmth)</label>
                    <input
                      type="text"
                      value={rawNotes.base}
                      onChange={(e) => setRawNotes({ ...rawNotes, base: e.target.value })}
                      placeholder="e.g. Rare Smoked Oud, Precious Ambergris, Bourbon Vanilla, Cedarwood"
                    />
                    <span className="form-field-hint">Separate with commas</span>
                  </div>

                  <div className="modal-section-title" style={{ marginTop: '20px' }}>
                    <Tag size={15} />
                    <span>Clean Formulation Ingredients</span>
                  </div>

                  <div className="form-field">
                    <label>Ingredients List</label>
                    <input
                      type="text"
                      value={rawNotes.ingredients}
                      onChange={(e) => setRawNotes({ ...rawNotes, ingredients: e.target.value })}
                      placeholder="e.g. 100% Pure Botanical Soy Wax, Hand-Braided Cotton Wick, Nontoxic Botanical Fragrance Oils"
                    />
                    <span className="form-field-hint">Separate each ingredient or certified element with a comma</span>
                  </div>
                </>
              )}

              {/* TAB 5: SPECS & INVENTORY */}
              {activeModalTab === 'specs' && (
                <>
                  <div className="modal-section-title">
                    <Sliders size={15} />
                    <span>Formulation & Craft Specifications</span>
                  </div>

                  <div className="form-group-row">
                    <div className="form-field">
                      <label>Concentration / Wax Type</label>
                      <input
                        type="text"
                        value={editingProduct.concentration || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, concentration: e.target.value })}
                        placeholder="e.g. 20% EAU DE PARFUM or Pure Soy Wax"
                      />
                    </div>
                    <div className="form-field">
                      <label>Volume / Net Weight</label>
                      <input
                        type="text"
                        value={editingProduct.volume || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, volume: e.target.value })}
                        placeholder="e.g. 50ml / 1.7 fl oz or 300g / 10.5 oz"
                      />
                    </div>
                  </div>

                  <div className="form-group-row">
                    <div className="form-field">
                      <label>Longevity / Burn Time</label>
                      <input
                        type="text"
                        value={editingProduct.longevity || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, longevity: e.target.value })}
                        placeholder="e.g. 16+ Hours on Skin or 55+ Hours Clean Burn"
                      />
                    </div>
                    <div className="form-field">
                      <label>Sillage / Wick Spec</label>
                      <input
                        type="text"
                        value={editingProduct.sillage || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, sillage: e.target.value })}
                        placeholder="e.g. Enveloping & Radiant or Lead-Free Braided Wick"
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Scent Family / Character</label>
                    <input
                      type="text"
                      value={editingProduct.scentFamily || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, scentFamily: e.target.value })}
                      placeholder="e.g. Floral Oriental, Gourmand Confection, Oceanic Amber"
                    />
                  </div>

                  <div className="modal-section-title" style={{ marginTop: '20px' }}>
                    <Package size={15} />
                    <span>Inventory & Availability</span>
                  </div>

                  <div className="form-group-row">
                    <div className="form-field">
                      <label>Availability Status</label>
                      <select
                        value={editingProduct.inStock ? 'true' : 'false'}
                        onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.value === 'true' })}
                      >
                        <option value="true">✓ In Stock (Purchasable)</option>
                        <option value="false">✕ Out of Stock (Sold Out)</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label>Stock Count / Units Available</label>
                      <input
                        type="number"
                        value={editingProduct.stockCount ?? 50}
                        onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* TAB 7: SEO, SLUG & META TAGS */}
              {activeModalTab === 'seo' && (
                <>
                  <div className="modal-section-title">
                    <Search size={15} />
                    <span>Search Engine Optimization (SEO), Slug & Social Meta</span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#666', marginTop: '-6px', marginBottom: '18px' }}>
                    Control how this product ranks and displays across Google Search, Bing, WhatsApp link previews, and browser tabs.
                  </p>

                  {/* URL Slug & Permalinks */}
                  <div style={{ background: '#FAF8F5', border: '1px solid #EBE4DA', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                        Product URL Slug / Permalink
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          if (editingProduct.title) {
                            const autoSlug = editingProduct.title
                              .toLowerCase()
                              .trim()
                              .replace(/[^a-z0-9]+/g, '-')
                              .replace(/^-+|-+$/g, '');
                            setEditingProduct({ ...editingProduct, slug: autoSlug });
                          }
                        }}
                        style={{
                          background: '#121212',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        ⚡ Generate Slug from Title
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12.5px', color: '#888', fontFamily: 'monospace' }}>
                        nooreflames.com/product/
                      </span>
                      <input
                        type="text"
                        value={editingProduct.slug || ''}
                        placeholder={editingProduct.title ? editingProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'custom-url-slug'}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                          })
                        }
                        style={{ flex: 1, fontFamily: 'monospace', fontWeight: 600 }}
                      />
                    </div>
                    <span className="form-field-hint" style={{ marginTop: '6px' }}>
                      Use lowercase letters, numbers, and hyphens only. Changing this updates the friendly short link for this product.
                    </span>
                  </div>

                  {/* Meta Title */}
                  <div className="form-field" style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontWeight: 700 }}>SEO Meta Title</label>
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 600,
                          color:
                            (editingProduct.metaTitle || '').length > 60
                              ? '#DC2626'
                              : (editingProduct.metaTitle || '').length >= 35
                              ? '#16A34A'
                              : '#888',
                        }}
                      >
                        {(editingProduct.metaTitle || '').length} / 60 chars { (editingProduct.metaTitle || '').length > 60 ? '(Too long for Google snippet)' : (editingProduct.metaTitle || '').length >= 35 ? '(Optimal)' : '' }
                      </span>
                    </div>
                    <input
                      type="text"
                      value={editingProduct.metaTitle || ''}
                      placeholder={editingProduct.title ? `${editingProduct.title} — NOOR-E-FLAMES` : 'e.g. Whispered Surprises Secret Message Candle — NOOR-E-FLAMES'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, metaTitle: e.target.value })}
                    />
                    <span className="form-field-hint">
                      The title that appears as the clickable blue headline in Google search results and browser tabs. Recommended: 50–60 characters.
                    </span>
                  </div>

                  {/* Meta Description */}
                  <div className="form-field" style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontWeight: 700 }}>SEO Meta Description</label>
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 600,
                          color:
                            (editingProduct.metaDescription || '').length > 160
                              ? '#DC2626'
                              : (editingProduct.metaDescription || '').length >= 100
                              ? '#16A34A'
                              : '#888',
                        }}
                      >
                        {(editingProduct.metaDescription || '').length} / 160 chars { (editingProduct.metaDescription || '').length > 160 ? '(Truncated in Google)' : (editingProduct.metaDescription || '').length >= 100 ? '(Optimal)' : '' }
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={editingProduct.metaDescription || ''}
                      placeholder={editingProduct.subtitle || editingProduct.description || 'e.g. Handcrafted pure soy wax candle embedded with secret keepsake message that reveals upon burning. Clean burn, non-toxic lead-free wick. Hand-poured in New Delhi.'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, metaDescription: e.target.value })}
                    />
                    <span className="form-field-hint">
                      The descriptive snippet displayed beneath the title in search engines and social shares. Recommended: 120–160 characters.
                    </span>
                  </div>

                  {/* Image Alt Text */}
                  <div className="form-field" style={{ marginBottom: '22px' }}>
                    <label style={{ fontWeight: 700 }}>Primary Image Alt Text (Accessibility & Google Image Search)</label>
                    <input
                      type="text"
                      value={editingProduct.imageAlt || ''}
                      placeholder={`e.g. ${editingProduct.title || 'Handcrafted perfume bottle'} with luxury packaging`}
                      onChange={(e) => setEditingProduct({ ...editingProduct, imageAlt: e.target.value })}
                    />
                    <span className="form-field-hint">
                      Provides textual context for visually impaired users and indexes your product in Google Image search.
                    </span>
                  </div>

                  {/* Live Google Search Preview (SERP Card) */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '18px 20px', boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748B', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
                      <Sparkles size={13} color="#2563EB" />
                      <span>Live Google Search Engine Result Preview</span>
                    </div>

                    <div style={{ fontFamily: 'arial, sans-serif' }}>
                      {/* URL Breadcrumb */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#202124', marginBottom: '4px' }}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#1A1816', color: '#FAF6F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                          N
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '12px', color: '#202124', lineHeight: 1.2 }}>NOOR-E-FLAMES</span>
                          <span style={{ fontSize: '11px', color: '#5f6368', lineHeight: 1.2 }}>
                            https://nooreflames.com › product › {editingProduct.slug || editingProduct.id}
                          </span>
                        </div>
                      </div>

                      {/* Clickable Blue Link */}
                      <h4 style={{ fontSize: '18px', color: '#1a0dab', margin: '4px 0 6px', fontWeight: 400, lineHeight: 1.3 }}>
                        {editingProduct.metaTitle || (editingProduct.title ? `${editingProduct.title} — NOOR-E-FLAMES` : 'Product Title — NOOR-E-FLAMES')}
                      </h4>

                      {/* Snippet Text */}
                      <p style={{ fontSize: '13px', color: '#4d5156', margin: '0 0 6px', lineHeight: 1.5 }}>
                        {editingProduct.metaDescription || editingProduct.subtitle || editingProduct.description?.slice(0, 150) || 'Discover luxury handcrafted fragrances, alcohol-free attars, and clean-burning sculptural candles with secret messages made in New Delhi.'}
                      </p>

                      {/* Rich Snippet Details */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#70757a' }}>
                        <span style={{ color: '#e37400' }}>★★★★★</span>
                        <span>{editingProduct.rating || 4.9} ({editingProduct.reviewsCount || 148})</span>
                        <span>·</span>
                        <span style={{ fontWeight: 600, color: '#188038' }}>₹{editingProduct.price} · In stock</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="modal-actions" style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid rgba(187, 165, 142, 0.25)' }}>
              {!isNewProduct && (
                <Link
                  href={`/product/${editingProduct.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-view-product"
                  style={{ marginRight: 'auto' }}
                  title="View live product page in new tab"
                >
                  <Eye size={14} />
                  <span>View Live Page</span>
                  <ExternalLink size={12} />
                </Link>
              )}
              <button className="btn-cancel" onClick={() => setEditingProduct(null)}>
                Cancel
              </button>
              <button
                className="btn-confirm"
                disabled={productSaveStatus === 'saving' || uploadingMainImage || uploadingGallery}
                onClick={handleSaveProduct}
              >
                {productSaveStatus === 'saving'
                  ? 'Saving...'
                  : productSaveStatus === 'saved'
                  ? '✓ Saved Successfully!'
                  : productSaveStatus === 'error'
                  ? 'Error — Retry'
                  : isNewProduct
                  ? 'Create Product'
                  : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#FAF8F5',
                border: '1px solid rgba(18, 18, 18, 0.12)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#707070',
                transition: 'all 0.2s ease',
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#121212';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FAF8F5';
                e.currentTarget.style.color = '#707070';
              }}
              title="Close modal"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
            <h3 className="modal-title font-serif" style={{ paddingRight: '44px' }}>Order Details — {selectedOrder.id}</h3>

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
                {selectedOrder.distanceKm && (
                  <span style={{ marginLeft: '6px', fontSize: '11px', color: '#8A7258', fontWeight: 600 }}>
                    ({selectedOrder.distanceKm} km · {selectedOrder.zoneName || 'Delhi Hub'})
                  </span>
                )}
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <strong>Address:</strong> {selectedOrder.address}, PIN: {selectedOrder.pincode}
              </div>
              <div>
                <strong>Payment Mode:</strong> {selectedOrder.payment}
              </div>
              <div>
                <strong>Grand Total:</strong> ₹{selectedOrder.amount.toLocaleString('en-IN')}
              </div>
              {selectedOrder.isPartialCod && (
                <>
                  <div style={{ background: '#f0fdf4', padding: '8px 10px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                    <strong style={{ color: '#166534' }}>UPI Advance Paid:</strong>{' '}
                    <span style={{ fontWeight: 700, color: '#15803d' }}>₹{(selectedOrder.advanceAmount ?? 0).toLocaleString('en-IN')}</span>
                    {selectedOrder.advancePaymentId && (
                      <div style={{ fontSize: '10.5px', color: '#166534', marginTop: '2px' }}>
                        Ref: {selectedOrder.advancePaymentId}
                      </div>
                    )}
                  </div>
                  <div style={{ background: '#fef3c7', padding: '8px 10px', borderRadius: '6px', border: '1px solid #fde68a' }}>
                    <strong style={{ color: '#92400e' }}>Collect on Delivery (Cash):</strong>{' '}
                    <span style={{ fontWeight: 800, color: '#b45309', fontSize: '14px' }}>
                      ₹{(selectedOrder.remainingCodAmount ?? (selectedOrder.amount - (selectedOrder.advanceAmount ?? 0))).toLocaleString('en-IN')}
                    </span>
                  </div>
                </>
              )}
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
                    <div style={{ color: '#707070', fontSize: '12px' }}>Qty: {it.quantity}</div>
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

      {/* COUPON EDIT / CREATE MODAL */}
      {editingCoupon && (
        <div className="admin-modal-backdrop" onClick={() => setEditingCoupon(null)}>
          <div
            className="admin-modal"
            style={{ maxWidth: '520px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="admin-modal-close"
              onClick={() => setEditingCoupon(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: '#FAF8F5',
                border: '1px solid rgba(187, 165, 142, 0.3)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#707070',
                transition: 'all 0.2s ease',
              }}
              title="Close modal"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Tag size={20} color="#8A7258" />
              <h3 className="modal-title font-serif" style={{ margin: 0 }}>
                {isNewCoupon ? 'Create New Coupon' : `Edit Coupon: ${editingCoupon.code}`}
              </h3>
            </div>
            <p style={{ color: '#707070', fontSize: '13px', margin: '0 0 18px 0' }}>
              Promotional codes apply instantly in the shopping cart and checkout.
            </p>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                Coupon Code (Uppercase, No Spaces)
              </label>
              <input
                type="text"
                value={editingCoupon.code}
                onChange={(e) =>
                  setEditingCoupon({
                    ...editingCoupon,
                    code: e.target.value.toUpperCase().replace(/\s+/g, ''),
                  })
                }
                placeholder="e.g. LUXURY20"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #DCD3C5',
                  borderRadius: '8px',
                  textTransform: 'uppercase',
                  fontFamily: 'monospace',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#121212',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  Discount Percent (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editingCoupon.discountPercent}
                  onChange={(e) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      discountPercent: Number(e.target.value) || 0,
                    })
                  }
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #DCD3C5', borderRadius: '8px' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  Min. Order Value (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={editingCoupon.minOrder}
                  onChange={(e) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      minOrder: Number(e.target.value) || 0,
                    })
                  }
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #DCD3C5', borderRadius: '8px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  Flat Discount (₹) (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0 (if % used)"
                  value={editingCoupon.discountAmount || ''}
                  onChange={(e) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      discountAmount: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #DCD3C5', borderRadius: '8px' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  Bundle Fixed Price (₹) (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 1499 for DUO1499"
                  value={editingCoupon.fixedPrice || ''}
                  onChange={(e) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      fixedPrice: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #DCD3C5', borderRadius: '8px' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                Description / Benefit Note
              </label>
              <input
                type="text"
                value={editingCoupon.description}
                onChange={(e) =>
                  setEditingCoupon({ ...editingCoupon, description: e.target.value })
                }
                placeholder="e.g. 20% off on all orders above ₹999"
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #DCD3C5', borderRadius: '8px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '20px', padding: '12px 14px', background: '#FAF8F5', borderRadius: '8px', border: '1px solid #E8E3D8' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={editingCoupon.isActive}
                  onChange={(e) =>
                    setEditingCoupon({ ...editingCoupon, isActive: e.target.checked })
                  }
                />
                <span>Active & Redeemable</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={Boolean(editingCoupon.freeShipping)}
                  onChange={(e) =>
                    setEditingCoupon({ ...editingCoupon, freeShipping: e.target.checked })
                  }
                />
                <span>Includes Free Shipping</span>
              </label>
            </div>

            <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setEditingCoupon(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-confirm"
                disabled={couponSaveStatus === 'saving' || !editingCoupon.code.trim()}
                onClick={handleSaveCoupon}
              >
                {couponSaveStatus === 'saving'
                  ? 'Saving...'
                  : couponSaveStatus === 'saved'
                  ? '✓ Saved!'
                  : couponSaveStatus === 'error'
                  ? 'Error — Retry'
                  : isNewCoupon
                  ? 'Create Coupon'
                  : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
