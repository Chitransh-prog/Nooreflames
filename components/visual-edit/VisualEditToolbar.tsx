'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Settings, Edit3, Save, X, RotateCcw, Check, Sparkles, Eye } from 'lucide-react';
import { useVisualEdit } from '@/context/VisualEditContext';

export default function VisualEditToolbar() {
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

  const handleSave = async () => {
    setIsSaving(true);
    await saveChanges();
    setIsSaving(false);
  };

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

      {/* Bottom-Left Floating Toolbar Dock (Matching reference screenshot) */}
      <div
        className="visual-edit-dock"
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {/* Button 1: Visual Edit Toggle Pill */}
        <button
          type="button"
          onClick={toggleEditing}
          style={{
            backgroundColor: isEditing ? '#c9935a' : '#141414',
            color: isEditing ? '#121212' : '#ffffff',
            border: isEditing
              ? '1px solid #c9935a'
              : '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '9999px',
            padding: '8px 18px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.45)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={(e) => {
            if (!isEditing) {
              e.currentTarget.style.backgroundColor = '#222222';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isEditing) {
              e.currentTarget.style.backgroundColor = '#141414';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
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
              style={{
                backgroundColor: hasChanges ? '#2e7d32' : '#333333',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '9999px',
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: hasChanges && !isSaving ? 'pointer' : 'default',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 6px 24px rgba(0, 0, 0, 0.45)',
                opacity: hasChanges ? 1 : 0.6,
                transition: 'all 0.25s ease',
              }}
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
                style={{
                  backgroundColor: '#2a1212',
                  color: '#ff8a80',
                  border: '1px solid rgba(255, 138, 128, 0.3)',
                  borderRadius: '9999px',
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
                }}
                title="Discard unsaved edits"
              >
                <RotateCcw size={13} />
                <span>Discard</span>
              </button>
            )}
          </>
        )}

        {/* Button 2: Admin Panel Pill (Matching reference screenshot) */}
        <Link
          href="/admin"
          style={{
            backgroundColor: '#141414',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '9999px',
            padding: '8px 18px',
            fontSize: '13px',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.45)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#222222';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#141414';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          title="Open Commerce Hub Admin Panel"
        >
          <span style={{ fontSize: '13px' }}>⚙️</span>
          <span>Admin Panel</span>
        </Link>
      </div>

      <style jsx global>{`
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
