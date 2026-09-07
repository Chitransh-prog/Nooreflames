'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, Edit3, Save, X, RotateCcw, Check, Sparkles, Eye } from 'lucide-react';
import { useVisualEdit } from '@/context/VisualEditContext';

export default function VisualEditToolbar() {
  const pathname = usePathname();
  const {
    isEditing,
    toggleEditing,
    hasChanges,
    changesCount,
    saveChanges,
    discardChanges,
    toastMessage,
  } = useVisualEdit();

  const [isSaving, setIsSaving] = useState(false);

  const [isMobileCollapsed, setIsMobileCollapsed] = useState(true);

  const handleSave = async () => {
    setIsSaving(true);
    await saveChanges();
    setIsSaving(false);
  };

  const handleToggleEditing = () => {
    setIsMobileCollapsed(false);
    toggleEditing();
  };

  // Do not render visual edit floating dock on Admin Panel pages
  if (pathname?.startsWith('/admin')) {
    return toastMessage ? (
      <div
        style={{
          position: 'fixed',
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#1b3d39',
          color: '#ffffff',
          border: '1px solid #c9935a',
          padding: '10px 24px',
          borderRadius: '30px',
          fontSize: '13px',
          fontWeight: 600,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          zIndex: 100001,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeInDown 0.3s ease',
        }}
      >
        <Sparkles size={16} color="#c9935a" />
        <span>{toastMessage}</span>
      </div>
    ) : null;
  }

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#1b3d39',
            color: '#ffffff',
            border: '1px solid #c9935a',
            padding: '10px 24px',
            borderRadius: '30px',
            fontSize: '13px',
            fontWeight: 600,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            zIndex: 100001,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeInDown 0.3s ease',
          }}
        >
          <Sparkles size={16} color="#c9935a" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Visual Edit Info Banner when Active */}
      {isEditing && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            height: '32px',
            backgroundColor: 'rgba(201, 147, 90, 0.95)',
            color: '#121212',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            zIndex: 99998,
            boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
          }}
        >
          <span>✦ VISUAL EDITING ACTIVE ✦ Click any text to type directly · Hover images & videos to replace</span>
          {hasChanges && (
            <span
              style={{
                background: '#121212',
                color: '#ffffff',
                padding: '1px 8px',
                borderRadius: '10px',
                fontSize: '10px',
              }}
            >
              {changesCount} Unsaved {changesCount === 1 ? 'Edit' : 'Edits'}
            </span>
          )}
        </div>
      )}

      {/* Bottom-Left Floating Toolbar Dock */}
      <div
        className={`visual-edit-dock ${isMobileCollapsed && !isEditing ? 'mobile-collapsed' : 'mobile-expanded'}`}
      >
        {/* Mobile Collapsed Floating Trigger (Discreet FAB so it never covers product titles or buy buttons) */}
        <button
          type="button"
          onClick={() => setIsMobileCollapsed(false)}
          className="visual-edit-fab-trigger"
          title="Open Visual Edit & Admin controls"
        >
          <Settings size={14} color="#dfab72" />
          <span className="visual-edit-fab-label">Admin</span>
        </button>

        {/* Expanded Toolbar Elements */}
        <div className="visual-edit-expanded-group">
          {/* Button 1: Visual Edit Toggle Pill */}
          <button
            type="button"
            onClick={handleToggleEditing}
            className={`visual-edit-btn-pill ${isEditing ? 'active' : ''}`}
            title={isEditing ? 'Exit visual editing mode' : 'Enable visual in-place editing'}
          >
            <span style={{ fontSize: '13px' }}>✏️</span>
            <span>{isEditing ? 'Exit Visual Edit' : 'Visual Edit'}</span>
          </button>

          {/* If editing & has unsaved changes: Show Save Pill */}
          {isEditing && (
            <>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                className="visual-edit-btn-save"
                title="Save all visual edits to store database"
              >
                <Save size={14} />
                <span>
                  {isSaving
                    ? 'Saving...'
                    : hasChanges
                    ? `Save (${changesCount})`
                    : 'Saved'}
                </span>
              </button>

              {hasChanges && (
                <button
                  type="button"
                  onClick={discardChanges}
                  className="visual-edit-btn-discard"
                  title="Discard unsaved edits"
                >
                  <RotateCcw size={13} />
                  <span>Discard</span>
                </button>
              )}
            </>
          )}

          {/* Button 2: Admin Panel Pill */}
          <Link
            href="/admin"
            className="visual-edit-btn-pill admin-link"
            title="Open Commerce Hub Admin Panel"
          >
            <span style={{ fontSize: '13px' }}>⚙️</span>
            <span>Admin Panel</span>
          </Link>

          {/* Minimize / Close button on mobile */}
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsMobileCollapsed(true)}
              className="visual-edit-minimize-btn"
              title="Minimize to corner"
              aria-label="Minimize admin toolbar"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <style jsx global>{`
        /* Visual Edit Dock & Action Pills */
        .visual-edit-dock {
          position: fixed;
          bottom: 24px;
          left: 24px;
          z-index: 99999;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .visual-edit-expanded-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .visual-edit-fab-trigger {
          display: none;
          background-color: #141414;
          color: #dfab72;
          border: 1px solid rgba(201, 147, 90, 0.5);
          border-radius: 9999px;
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          align-items: center;
          gap: 6px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          transition: all 0.2s ease;
        }

        .visual-edit-fab-trigger:hover {
          background-color: #222222;
          transform: translateY(-2px);
          border-color: #c9935a;
        }

        .visual-edit-btn-pill {
          background-color: #141414;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 9999px;
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.45);
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
        }

        .visual-edit-btn-pill:hover {
          background-color: #222222;
          border-color: rgba(255, 255, 255, 0.35);
          transform: translateY(-2px);
        }

        .visual-edit-btn-pill.active {
          background-color: #c9935a;
          color: #121212;
          border-color: #c9935a;
        }

        .visual-edit-btn-save {
          background-color: #2e7d32;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.45);
          transition: all 0.25s ease;
        }

        .visual-edit-btn-discard {
          background-color: #2a1212;
          color: #ff8a80;
          border: 1px solid rgba(255, 138, 128, 0.3);
          border-radius: 9999px;
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        }

        .visual-edit-minimize-btn {
          background-color: rgba(30, 30, 30, 0.9);
          color: #c0c0c0;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .visual-edit-minimize-btn:hover {
          background-color: #333333;
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.4);
        }

        /* Mobile Viewport Responsiveness */
        @media (max-width: 768px) {
          .visual-edit-dock {
            bottom: 16px;
            left: 14px;
            gap: 6px;
          }

          /* If PDP sticky buy bar is visible, push toolbar safely above it */
          body:has(.pdp-sticky-bar.visible) .visual-edit-dock {
            bottom: 74px;
          }

          /* Mobile Collapsed: Show only the compact trigger pill */
          .visual-edit-dock.mobile-collapsed .visual-edit-fab-trigger {
            display: inline-flex;
          }
          .visual-edit-dock.mobile-collapsed .visual-edit-expanded-group {
            display: none !important;
          }

          /* Mobile Expanded: Show compact pills */
          .visual-edit-dock.mobile-expanded .visual-edit-fab-trigger {
            display: none !important;
          }
          .visual-edit-dock.mobile-expanded .visual-edit-expanded-group {
            display: flex;
            background: rgba(18, 18, 18, 0.94);
            backdrop-filter: blur(12px);
            padding: 4px 6px;
            border-radius: 9999px;
            border: 1px solid rgba(201, 147, 90, 0.35);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
            gap: 6px;
          }

          .visual-edit-btn-pill {
            padding: 6px 12px;
            font-size: 11px;
            gap: 5px;
          }
          .visual-edit-btn-save {
            padding: 6px 12px;
            font-size: 11px;
            gap: 5px;
          }
          .visual-edit-btn-discard {
            padding: 6px 10px;
            font-size: 11px;
            gap: 4px;
          }
          .visual-edit-minimize-btn {
            width: 26px;
            height: 26px;
          }
        }

        .visual-editable-text:hover {
          outline: 2px dashed #c9935a !important;
          outline-offset: 4px;
          border-radius: 4px;
          background-color: rgba(201, 147, 90, 0.08);
        }
        .visual-editable-text:focus {
          outline: 2px solid #c9935a !important;
          outline-offset: 4px;
          border-radius: 4px;
          background-color: rgba(201, 147, 90, 0.12);
        }
        .visual-editable-media-wrap {
          position: relative;
        }
        .visual-editable-media-wrap:hover .visual-edit-media-btn {
          opacity: 1 !important;
          pointer-events: auto !important;
          transform: translateY(0) !important;
        }
        .visual-edit-media-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 50;
          background-color: rgba(18, 18, 18, 0.92);
          backdrop-filter: blur(8px);
          color: #ffffff;
          border: 1px solid rgba(201, 147, 90, 0.6);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
          opacity: 0;
          pointer-events: none;
          transform: translateY(-4px);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .visual-edit-media-btn:hover {
          background-color: #c9935a;
          color: #121212;
          border-color: #c9935a;
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translate(-50%, -12px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </>
  );
}
