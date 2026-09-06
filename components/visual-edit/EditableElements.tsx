'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Video, X, Check, Upload, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { useVisualEdit } from '@/context/VisualEditContext';

// Preset Media Assets library for instant 1-click swapping
const PRESET_IMAGES = [
  { label: 'Stone Flacon Sunset (Hero)', url: '/images/hero/hero-stone-bottle.jpg' },
  { label: 'Candle Atelier Dusk (Hero)', url: '/images/hero/hero-candle.jpg' },
  { label: 'Royal Smokey Oud Flacon', url: '/images/products/royal-smokey-oud.jpg' },
  { label: 'Citrus Octagonal Flacon', url: '/images/pdp/citrus-flacon-hero.jpg' },
  { label: 'Velvet Rose Damask Flacon', url: '/images/products/velvet-rose.jpg' },
  { label: 'Oceanic Breeze Flacon', url: '/images/products/oceanic-breeze.jpg' },
  { label: 'Aqua Noir Flacon', url: '/images/products/aqua-noir.jpg' },
  { label: 'Signature White Gift Box', url: '/images/products/signature-white-giftbox.jpg' },
  { label: 'Whispered Surprises Candle', url: '/images/products/whispered-surprises.jpg' },
  { label: 'Lavender Dream Candle', url: '/images/products/whispered-surprises-lavender.jpg' },
  { label: 'Blue Message Candle', url: '/images/products/whispered-surprises-blue.jpg' },
  { label: 'Teddy Bear & Balloon Candle', url: '/images/products/teddy-bear-candle.jpg' },
  { label: 'Rose Bear Duo Candle', url: '/images/products/rose-bear-duo.jpg' },
  { label: 'Strawberry Shortcake Candle', url: '/images/products/strawberry-dessert-candle.jpg' },
  { label: 'Chocolate Cupcake Candle', url: '/images/products/chocolate-cupcake-candle.jpg' },
  { label: 'Cutting Chai Artisan Candle', url: '/images/products/cutting-chai-candle.jpg' },
  { label: 'Mango Berry Bliss Coupe', url: '/images/products/mango-berry-bliss.jpg' },
  { label: 'Brand Packaging Banner', url: '/images/banners/brand-packaging-banner.jpg' },
  { label: 'Gift Box Showcase Banner', url: '/images/banners/gift-box-showcase.jpg' },
];

const PRESET_VIDEOS = [
  {
    label: '✦ Atelier 4K Cinematic Perfume (Current)',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-a-perfume-bottle-spraying-mist-42861-large.mp4',
  },
  {
    label: '✦ Artisanal Candle Flame & Wax Pour',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-lighted-candle-in-a-dark-room-41888-large.mp4',
  },
  {
    label: '✦ Luxury Unboxing & Glass Refraction',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-crystal-glass-with-water-droplets-42858-large.mp4',
  },
  {
    label: '✦ Ambient Golden Mist & Smoke',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-colored-smoke-slowly-drifting-in-the-dark-41891-large.mp4',
  },
];

interface EditableTextProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  value: string;
  fieldPath?: string;
  onValueChange?: (newVal: string) => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function EditableText({
  as: Component = 'span',
  value,
  fieldPath,
  onValueChange,
  className = '',
  style = {},
  children,
  ...rest
}: EditableTextProps) {
  const { isEditing, updateField } = useVisualEdit();
  const textRef = useRef<HTMLElement>(null);

  const handleBlur = () => {
    if (!textRef.current) return;
    const newText = textRef.current.innerText.trim();
    if (newText !== value) {
      if (onValueChange) {
        onValueChange(newText);
      } else if (fieldPath) {
        updateField(fieldPath, newText);
      }
    }
  };

  const content = children || value;

  if (!isEditing) {
    return (
      <Component className={className} style={style} {...rest}>
        {content}
      </Component>
    );
  }

  return (
    <Component
      ref={textRef as any}
      contentEditable={true}
      suppressContentEditableWarning={true}
      onBlur={handleBlur}
      className={`visual-editable-text ${className}`}
      style={{
        ...style,
        position: 'relative',
        cursor: 'text',
      }}
      title="Click to edit text"
      {...rest}
    >
      {content}
    </Component>
  );
}

interface EditableImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fieldPath?: string;
  onImageChange?: (newUrl: string) => void;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function EditableImage({
  src,
  alt,
  fieldPath,
  onImageChange,
  label = 'Product / Banner Image',
  className = '',
  style = {},
  ...rest
}: EditableImageProps) {
  const { isEditing, openMediaPicker, updateField } = useVisualEdit();

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openMediaPicker({
      type: 'image',
      currentUrl: src,
      label,
      onSave: (newUrl: string) => {
        if (onImageChange) {
          onImageChange(newUrl);
        } else if (fieldPath) {
          updateField(fieldPath, newUrl);
        }
      },
    });
  };

  if (!isEditing) {
    return <img src={src} alt={alt} className={className} style={style} {...rest} />;
  }

  return (
    <div
      className="visual-editable-media-wrap"
      style={{ position: 'relative', display: 'inline-block', width: '100%', height: '100%' }}
    >
      <img src={src} alt={alt} className={className} style={style} {...rest} />
      <button
        type="button"
        onClick={handleEditClick}
        className="visual-edit-media-btn"
        title={`Replace ${label}`}
      >
        <Camera size={13} />
        <span>Change Image</span>
      </button>
    </div>
  );
}

interface EditableVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  fieldPath?: string;
  onVideoChange?: (newUrl: string) => void;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function EditableVideo({
  src,
  fieldPath,
  onVideoChange,
  label = 'Background Video',
  className = '',
  style = {},
  children,
  ...rest
}: EditableVideoProps) {
  const { isEditing, openMediaPicker, updateField } = useVisualEdit();

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openMediaPicker({
      type: 'video',
      currentUrl: src,
      label,
      onSave: (newUrl: string) => {
        if (onVideoChange) {
          onVideoChange(newUrl);
        } else if (fieldPath) {
          updateField(fieldPath, newUrl);
        }
      },
    });
  };

  if (!isEditing) {
    return (
      <video src={src} className={className} style={style} {...rest}>
        {children}
      </video>
    );
  }

  return (
    <div
      className="visual-editable-media-wrap"
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      <video src={src} className={className} style={style} {...rest}>
        {children}
      </video>
      <button
        type="button"
        onClick={handleEditClick}
        className="visual-edit-media-btn"
        style={{ top: '24px', right: '24px' }}
        title={`Replace ${label}`}
      >
        <Video size={13} />
        <span>Change Video</span>
      </button>
    </div>
  );
}

export function MediaPickerModal() {
  const { mediaModal, closeMediaPicker } = useVisualEdit();
  const [urlInput, setUrlInput] = useState('');
  const [activeTab, setActiveTab] = useState<'presets' | 'url' | 'upload'>('presets');

  useEffect(() => {
    if (mediaModal) {
      setUrlInput(mediaModal.currentUrl || '');
    }
  }, [mediaModal]);

  if (!mediaModal) return null;

  const handleApply = () => {
    if (urlInput.trim()) {
      mediaModal.onSave(urlInput.trim());
    }
    closeMediaPicker();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read as Base64 data URL for instant client visual edit
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUrlInput(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const presets = mediaModal.type === 'video' ? PRESET_VIDEOS : PRESET_IMAGES;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={closeMediaPicker}
    >
      <div
        style={{
          backgroundColor: '#161616',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          color: '#ffffff',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#ffffff' }}>
              Replace {mediaModal.type === 'video' ? 'Video' : 'Image'}
            </h3>
            <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#999999' }}>
              {mediaModal.label}
            </p>
          </div>
          <button
            type="button"
            onClick={closeMediaPicker}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#888888',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selection */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: activeTab === 'presets' ? 'rgba(201, 147, 90, 0.15)' : 'transparent',
              color: activeTab === 'presets' ? '#d4a366' : '#888888',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer',
              borderBottom: activeTab === 'presets' ? '2px solid #c9935a' : 'none',
            }}
          >
            Store Presets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: activeTab === 'url' ? 'rgba(201, 147, 90, 0.15)' : 'transparent',
              color: activeTab === 'url' ? '#d4a366' : '#888888',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer',
              borderBottom: activeTab === 'url' ? '2px solid #c9935a' : 'none',
            }}
          >
            Custom URL
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: activeTab === 'upload' ? 'rgba(201, 147, 90, 0.15)' : 'transparent',
              color: activeTab === 'upload' ? '#d4a366' : '#888888',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer',
              borderBottom: activeTab === 'upload' ? '2px solid #c9935a' : 'none',
            }}
          >
            Upload File
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'presets' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: '#888888', letterSpacing: '0.08em' }}>
                CHOOSE FROM EXISTING ATELIER ASSETS:
              </span>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: mediaModal.type === 'video' ? '1fr' : 'repeat(3, 1fr)',
                  gap: '10px',
                  maxHeight: '320px',
                  overflowY: 'auto',
                  paddingRight: '4px',
                }}
              >
                {presets.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setUrlInput(item.url)}
                    style={{
                      border:
                        urlInput === item.url
                          ? '2px solid #c9935a'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: '#202020',
                      padding: mediaModal.type === 'video' ? '12px' : '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    {mediaModal.type === 'image' && (
                      <div
                        style={{
                          width: '100%',
                          height: '90px',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          backgroundColor: '#0a0a0a',
                        }}
                      >
                        <img
                          src={item.url}
                          alt={item.label}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <span
                      style={{
                        fontSize: '11px',
                        color: urlInput === item.url ? '#d4a366' : '#cccccc',
                        fontWeight: 500,
                        textAlign: 'center',
                        lineHeight: 1.2,
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'url' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <label style={{ fontSize: '12px', color: '#aaaaaa' }}>Enter direct media URL:</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/asset.jpg or /images/..."
                  style={{
                    flex: 1,
                    background: '#222222',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div
              style={{
                border: '2px dashed rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '36px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <Upload size={28} color="#c9935a" />
              <div style={{ fontSize: '13px', color: '#cccccc' }}>
                Click to browse file from your device
              </div>
              <input
                type="file"
                accept={mediaModal.type === 'video' ? 'video/*' : 'image/*'}
                onChange={handleFileUpload}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer',
                }}
              />
            </div>
          )}

          {/* Current Selection Preview */}
          {urlInput && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              {mediaModal.type === 'image' ? (
                <img
                  src={urlInput}
                  alt="Preview"
                  style={{
                    width: '44px',
                    height: '44px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                  }}
                />
              ) : (
                <Video size={24} color="#c9935a" />
              )}
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: '10px', color: '#888888', letterSpacing: '0.08em' }}>
                  SELECTED ASSET:
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#ffffff',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {urlInput}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            background: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          <button
            type="button"
            onClick={closeMediaPicker}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#cccccc',
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={!urlInput.trim()}
            style={{
              background: '#c9935a',
              border: 'none',
              color: '#121212',
              padding: '8px 22px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: urlInput.trim() ? 'pointer' : 'not-allowed',
              opacity: urlInput.trim() ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Check size={14} />
            <span>Apply Change</span>
          </button>
        </div>
      </div>
    </div>
  );
}
