'use client';

import { useState } from 'react';

interface ContactButtonsProps {
  phone: string;       // e.g. "9816996799"
  waPhone: string;     // e.g. "919816996799"
  waMessage?: string;
}

export default function ContactButtons({ phone, waPhone, waMessage }: ContactButtonsProps) {
  const [showPhone, setShowPhone] = useState(false);
  const [showWa, setShowWa] = useState(false);

  const formattedPhone = phone.replace(/(\d{5})(\d{5})/, '$1 $2');
  const formattedWa = waPhone.startsWith('91') ? waPhone.slice(2).replace(/(\d{5})(\d{5})/, '$1 $2') : waPhone.replace(/(\d{5})(\d{5})/, '$1 $2');

  const waUrl = `https://wa.me/${waPhone}${waMessage ? `?text=${encodeURIComponent(waMessage)}` : ''}`;

  return (
    <>
      {/* ── Call Us ─────────────────────────────────────── */}

      {/* Mobile: direct tel: link */}
      <a
        href={`tel:${phone}`}
        className="btn btn--primary btn--full mb-4"
        style={{ display: 'block' }}
        aria-label="Call Us"
        // hide on desktop via CSS
        data-mobile-only
      >
        Call Us
      </a>

      {/* Desktop: show number on click */}
      <button
        type="button"
        className="btn btn--primary btn--full mb-4"
        style={{ display: 'none', width: '100%' }}
        onClick={() => setShowPhone(v => !v)}
        data-desktop-only
        aria-expanded={showPhone}
      >
        {showPhone ? `📞 +91 ${formattedPhone}` : 'Call Us'}
      </button>

      {/* ── WhatsApp ─────────────────────────────────────── */}

      {/* Mobile: direct wa.me link */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn--whatsapp btn--full"
        data-mobile-only
        aria-label="Enquire on WhatsApp"
      >
        Enquire on WhatsApp
      </a>

      {/* Desktop: show number on click */}
      <button
        type="button"
        className="btn btn--whatsapp btn--full"
        style={{ display: 'none', width: '100%' }}
        onClick={() => setShowWa(v => !v)}
        data-desktop-only
        aria-expanded={showWa}
      >
        {showWa ? `💬 +91 ${formattedWa}` : 'Enquire on WhatsApp'}
      </button>

      <style>{`
        /* Mobile (< 1024px): show mobile anchors, hide desktop buttons */
        [data-mobile-only] { display: block; }
        [data-desktop-only] { display: none !important; }

        @media (min-width: 1024px) {
          [data-mobile-only] { display: none !important; }
          [data-desktop-only] { display: block !important; }
        }
      `}</style>
    </>
  );
}
