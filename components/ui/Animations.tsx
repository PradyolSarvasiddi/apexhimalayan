'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function Animations() {
  const pathname = usePathname();

  useEffect(() => {
    // ----------------------------------------------------
    // Loading bar (fake)
    // ----------------------------------------------------
    const loadingBar = document.createElement('div');
    loadingBar.className = 'loading-bar';
    document.body.appendChild(loadingBar);
    
    setTimeout(() => { loadingBar.style.width = '100%'; }, 100);
    setTimeout(() => { 
      loadingBar.style.opacity = '0'; 
      setTimeout(() => loadingBar.remove(), 300);
    }, 600);

    // ----------------------------------------------------
    // Navbar scroll
    // ----------------------------------------------------
    const navbar = document.querySelector('.navbar');
    const onScroll = () => {
      if (window.scrollY > 50) navbar?.classList.add('scrolled');
      else navbar?.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll);
    onScroll(); // initial check

    // Vanilla fade/stagger observers removed in favor of Framer Motion

    // ----------------------------------------------------
    // Back to top
    // ----------------------------------------------------
    const backToTop = document.querySelector('.back-to-top');
    const onBackToTopScroll = () => {
      if(window.scrollY > 500) backToTop?.classList.add('visible');
      else backToTop?.classList.remove('visible');
    };
    if (backToTop) {
      window.addEventListener('scroll', onBackToTopScroll);
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // ----------------------------------------------------
    // Accordion
    // ----------------------------------------------------
    const accordions = document.querySelectorAll('.accordion__header');
    const handleAccordion = (e: Event) => {
      const acc = e.currentTarget as HTMLElement;
      const content = acc.nextElementSibling as HTMLElement;
      const icon = acc.querySelector('.accordion__icon') as HTMLElement;
      acc.classList.toggle('active');
      if(content.style.maxHeight && content.style.maxHeight !== '0px') {
        content.style.maxHeight = '0px';
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    };
    accordions.forEach(acc => {
      acc.addEventListener('click', handleAccordion);
    });

    // ----------------------------------------------------
    // Lightbox
    // ----------------------------------------------------
    const galleryItems = document.querySelectorAll('.masonry-item');
    const lightbox = document.querySelector('.lightbox');
    const handleGalleryClick = (e: Event) => {
      const item = e.currentTarget as HTMLElement;
      const img = lightbox?.querySelector('.lightbox__img') as HTMLImageElement;
      const itemImg = item.querySelector('img');
      if (img && itemImg) {
        img.src = itemImg.src;
        lightbox?.classList.add('active');
      }
    };
    const handleLightboxClose = () => lightbox?.classList.remove('active');
    const handleLightboxOutsideClick = (e: Event) => {
      if(e.target === lightbox) lightbox?.classList.remove('active');
    };

    if(lightbox && galleryItems.length > 0) {
      galleryItems.forEach(item => item.addEventListener('click', handleGalleryClick));
      const close = lightbox.querySelector('.lightbox__close');
      if(close) close.addEventListener('click', handleLightboxClose);
      lightbox.addEventListener('click', handleLightboxOutsideClick);
    }

    // ----------------------------------------------------
    // Reading Progress Bar
    // ----------------------------------------------------
    const onProgressScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      const bar = document.getElementById('progressBar');
      if (bar) bar.style.width = scrolled + '%';
    };
    window.addEventListener('scroll', onProgressScroll);

    // ----------------------------------------------------
    // Cleanup
    // ----------------------------------------------------
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onProgressScroll);
      if (backToTop) window.removeEventListener('scroll', onBackToTopScroll);
      accordions.forEach(acc => acc.removeEventListener('click', handleAccordion));
      if(lightbox && galleryItems.length > 0) {
        galleryItems.forEach(item => item.removeEventListener('click', handleGalleryClick));
        const close = lightbox.querySelector('.lightbox__close');
        if(close) close.removeEventListener('click', handleLightboxClose);
        lightbox.removeEventListener('click', handleLightboxOutsideClick);
      }
    };
  }, [pathname]);

  return (
    <>
      <button className="back-to-top" aria-label="Back to top">↑</button>
    </>
  );
}
