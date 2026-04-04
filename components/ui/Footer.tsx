import Link from 'next/link';
import { Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__logo">APEX HIMALAYAN RIDES</div>
            <p className="mb-4">Premium motorcycle expeditions across the Himalayas. Ride beyond roads.</p>
          </div>
          <div>
            <h4 className="footer__title">Quick Links</h4>
            <ul className="footer__links">
              <li><Link href="/rides">Expeditions</Link></li>
              <li><Link href="/stays">Luxury Stays</Link></li>
              <li><Link href="/about">Our Story</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="footer__title">Contact</h4>
            <ul className="footer__links">
              <li><a href="mailto:apexhimalayanrides@gmail.com">apexhimalayanrides@gmail.com</a></li>
              <li><a href="tel:+919805206007">+91 98052 06007</a></li>
              <li>Near Vashishth, Manali, HP, India</li>
            </ul>
          </div>
          <div>
            <h4 className="footer__title">Newsletter</h4>
            <p className="mb-4">Get updates on new routes and early bird offers.</p>
            <form style={{ display: 'flex', gap: '8px' }}>
              <label htmlFor="newsletter-email" className="sr-only">Newsletter Email</label>
              <input id="newsletter-email" type="email" placeholder="Your email" className="form-input" style={{ padding: '12px' }} />
              <button type="button" className="btn btn--primary" style={{ padding: '12px 24px' }}>Join</button>
            </form>
          </div>
        </div>
        <div className="footer__bottom">
          <div>&copy; {new Date().getFullYear()} Apex Himalayan Rides. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms &amp; Conditions</Link>
            <Link href="/admin/login" className="text-text-muted hover:text-text-primary transition-colors ml-4" title="Admin Login">
              <Lock size={14} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
