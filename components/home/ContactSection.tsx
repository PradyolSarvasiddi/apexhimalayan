import { FadeUp } from '@/components/ui/motion-wrappers';
import Image from 'next/image';
import { Phone, Mail, Link as LinkIcon, MessageSquareQuote, Clock } from 'lucide-react';
import Magnetic from '@/components/ui/Magnetic';

export default function ContactSection() {
  const contactMethods = [
    {
      icon: <MessageSquareQuote size={28} />,
      label: 'WHATSAPP',
      value: '98169 96799',
      href: 'https://wa.me/919816996799?text=Hi!%20I\'m%20interested%20in%20a%20Himalayan%20expedition.',
      color: '#25D366'
    },
    {
      icon: <Phone size={28} />,
      label: 'CALL US',
      value: '98052 06007',
      href: 'tel:+919805206007',
      color: 'var(--color-accent-gold)'
    },
    {
      icon: <Mail size={28} />,
      label: 'EMAIL US',
      value: 'apexhimalayanrides@gmail.com',
      href: 'mailto:apexhimalayanrides@gmail.com',
      color: 'var(--color-accent-gold)'
    },
    {
      icon: <LinkIcon size={28} />,
      label: 'INSTAGRAM',
      value: '@apex_himalayan_rides',
      href: 'https://instagram.com/apex_himalayan_rides',
      color: 'var(--color-accent-gold)'
    }
  ];

  return (
    <section id="contact" className="section relative overflow-hidden" 
             style={{ 
               backgroundColor: 'transparent', 
               padding: '160px 0',
             }}>
      {/* Subtle Texture Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.15, pointerEvents: 'none', zIndex: -1 }}>
        <Image 
          src="/background/b4.png" 
          alt="" 
          fill 
          style={{ objectFit: 'cover', opacity: 0.4 }} 
        />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.3, pointerEvents: 'none', backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-leather.png")' }}></div>
      </div>

      <div className="container px-4 sm:px-6 lg:px-8" style={{ position: 'relative', zIndex: 2 }}>
        <FadeUp>
          <div className="text-center mb-12 md:mb-20">
            <h2 className="headline mb-6" style={{ 
              fontSize: 'clamp(2.2rem, 8vw, 3.5rem)', 
              color: 'var(--color-accent-gold)', 
              background: 'linear-gradient(to right, #D6A85C, #FFF3E0, #D6A85C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'none',
              lineHeight: '1.2'
            }}>Direct Access to Adventure</h2>
            <p className="subheadline px-4" style={{ 
              opacity: 0.6, 
              maxWidth: '700px', 
              margin: '0 auto',
              fontSize: 'clamp(1rem, 4vw, 1.1rem)',
              lineHeight: '1.6'
            }}>
              Skip the forms. Reach our expedition captains directly through your preferred channel.
            </p>
          </div>
        </FadeUp>

        <FadeUp>
          <div style={{
            position: 'relative',
            backgroundColor: 'transparent',
            border: '2px solid transparent',
            backgroundImage: 'linear-gradient(transparent, transparent), linear-gradient(135deg, #A8864E 0%, #D6A85C 50%, #A8864E 100%)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            borderRadius: '16px',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.05)',
            padding: '2px'
          }}>
            <div className="flex flex-wrap w-full bg-transparent rounded-xl p-10 max-lg:p-6 lg:flex-row flex-col max-lg:gap-y-4">
              {contactMethods.map((method, idx) => (
                <div key={idx} className={`flex-1 min-w-[250px] flex flex-col items-center justify-center text-center p-5 relative border-white/10 ${(idx === 0 || idx === 2) ? 'lg:border-r' : ''} max-lg:border-b last:max-lg:border-b-0`}>
                  <Magnetic>
                    <a href={method.href} 
                       target={method.href.startsWith('http') ? '_blank' : '_self'}
                       className="flex flex-col items-center">
                      <div style={{ 
                        color: method.color, 
                        marginBottom: '24px',
                        filter: 'drop-shadow(0 0 8px rgba(214, 168, 92, 0.3))'
                      }}>
                        {method.icon}
                      </div>
                      <h4 className="label tracking-[0.3em] font-bold mb-3 text-[0.7rem]" style={{ 
                        color: 'var(--color-accent-gold)', 
                      }}>
                        {method.label}
                      </h4>
                      <span className="subheadline text-base opacity-90 tracking-wide text-[#EAECEF]" style={{ 
                        fontFamily: 'var(--font-body)',
                      }}>
                        {method.value}
                      </span>
                    </a>
                  </Magnetic>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        <FadeUp>
          <div className="text-center mt-12 flex items-center justify-center gap-2" style={{ opacity: 0.4 }}>
            <Clock size={16} className="text-gold" />
            <p className="label tracking-[0.25em] text-[0.65rem]">AVAILABLE 9 AM — 8 PM IST</p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
