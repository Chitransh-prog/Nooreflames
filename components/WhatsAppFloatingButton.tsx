'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function WhatsAppFloatingButton() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  // Do not render on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const phoneNumber = '919302306478';
  const defaultMessage = encodeURIComponent(
    'Hello NOOR-E-FLAMES Atelier, I would like to inquire about your fragrances and candles.'
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <aside aria-label="WhatsApp Concierge" className="whatsapp-floating-wrapper">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with NOOR-E-FLAMES Atelier on WhatsApp"
        className="whatsapp-floating-btn"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Soft pulse wave */}
        <span className="whatsapp-floating-pulse" aria-hidden="true" />

        {/* Hover / Label Tooltip */}
        <span
          className={`whatsapp-floating-tooltip ${isHovered ? 'tooltip-visible' : ''}`}
          aria-hidden="true"
        >
          <span className="tooltip-indicator" />
          <span>Chat with Atelier</span>
        </span>

        {/* Official WhatsApp Vector Icon */}
        <svg
          className="whatsapp-floating-icon"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 2C8.268 2 2 8.268 2 16C2 18.618 2.716 21.07 3.96 23.176L2.6 28.532C2.464 29.066 2.934 29.536 3.468 29.4L8.824 28.04C10.93 29.284 13.382 30 16 30C23.732 30 30 23.732 30 16C30 8.268 23.732 2 16 2ZM11.168 8.874C10.898 8.27 10.61 8.258 10.158 8.24C9.972 8.232 9.76 8.232 9.548 8.232C9.176 8.232 8.592 8.372 8.114 8.892C7.636 9.412 6.282 10.674 6.282 13.25C6.282 15.826 8.168 18.32 8.434 18.672C8.7 19.024 12.068 24.498 17.432 26.582C21.89 28.314 22.8 27.568 23.754 27.48C24.708 27.392 26.832 26.224 27.284 24.962C27.736 23.7 27.736 22.616 27.602 22.39C27.468 22.164 27.124 22.028 26.592 21.764C26.06 21.5 23.46 20.222 22.982 20.048C22.504 19.874 22.158 19.786 21.814 20.306C21.47 20.826 20.488 22.028 20.196 22.374C19.904 22.72 19.612 22.764 19.08 22.5C18.548 22.236 16.84 21.674 14.814 19.868C13.238 18.462 12.172 16.726 11.88 16.228C11.588 15.73 11.848 15.46 12.114 15.196C12.354 14.958 12.646 14.576 12.912 14.268C13.178 13.96 13.266 13.73 13.444 13.376C13.622 13.022 13.534 12.712 13.4 12.448C13.266 12.184 12.224 9.584 11.758 8.528C11.304 7.502 11.438 7.478 11.168 8.874Z"
            fill="currentColor"
          />
        </svg>
      </a>

      <style jsx global>{`
        .whatsapp-floating-wrapper {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 990;
          display: flex;
          align-items: center;
          pointer-events: auto;
        }

        .whatsapp-floating-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(145deg, #25D366 0%, #128C7E 100%);
          color: #ffffff;
          box-shadow: 0 8px 24px rgba(37, 211, 102, 0.42), 0 3px 8px rgba(0, 0, 0, 0.25);
          text-decoration: none;
          transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.28s ease;
          border: 1.5px solid rgba(255, 255, 255, 0.3);
          outline: none;
        }

        .whatsapp-floating-btn:hover {
          transform: scale(1.08) translateY(-2px);
          box-shadow: 0 12px 28px rgba(37, 211, 102, 0.55), 0 4px 12px rgba(0, 0, 0, 0.3);
          color: #ffffff;
        }

        .whatsapp-floating-btn:active {
          transform: scale(0.96);
        }

        .whatsapp-floating-icon {
          width: 32px;
          height: 32px;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15));
          position: relative;
          z-index: 2;
        }

        .whatsapp-floating-pulse {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: rgba(37, 211, 102, 0.35);
          animation: whatsapp-glow-pulse 2.8s cubic-bezier(0.24, 0, 0.38, 1) infinite;
          z-index: 1;
          pointer-events: none;
        }

        @keyframes whatsapp-glow-pulse {
          0% {
            transform: scale(0.92);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.35);
            opacity: 0;
          }
          100% {
            transform: scale(1.35);
            opacity: 0;
          }
        }

        .whatsapp-floating-tooltip {
          position: absolute;
          right: calc(100% + 12px);
          white-space: nowrap;
          background: rgba(18, 18, 18, 0.94);
          backdrop-filter: blur(8px);
          color: #ffffff;
          font-family: 'Montserrat', sans-serif;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.05em;
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
          pointer-events: none;
          opacity: 0;
          transform: translateX(8px);
          transition: opacity 0.22s ease, transform 0.22s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .whatsapp-floating-tooltip.tooltip-visible {
          opacity: 1;
          transform: translateX(0);
        }

        .tooltip-indicator {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #25D366;
          box-shadow: 0 0 6px #25D366;
        }

        @media (max-width: 640px) {
          .whatsapp-floating-wrapper {
            bottom: 20px;
            right: 16px;
          }
          .whatsapp-floating-btn {
            width: 52px;
            height: 52px;
          }
          .whatsapp-floating-icon {
            width: 30px;
            height: 30px;
          }
          .whatsapp-floating-tooltip {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
}
