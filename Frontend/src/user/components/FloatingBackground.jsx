import React, { useEffect, useState, useMemo } from 'react';
import '../styles/FloatingBackground.css';

export default function FloatingBackground() {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Subtle Mouse Parallax Effect (Disabled on touch devices for performance)
  useEffect(() => {
    // Check for reduced motion preference
    const mediaQueryReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQueryReducedMotion.matches) return;

    // Check if device supports fine hover pointer
    const isHoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isHoverCapable) return;

    let rafId = null;

    const handleMouseMove = (e) => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        // Calculate normalized offset from screen center (-1 to 1)
        const normX = (e.clientX / window.innerWidth - 0.5) * 2;
        const normY = (e.clientY / window.innerHeight - 0.5) * 2;
        setMouseOffset({ x: normX, y: normY });
        rafId = null;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Generate a small, deterministic array of 18 lightweight particles
  const particles = useMemo(() => {
    return [
      { id: 1, left: '8%', size: 4, duration: 18, delay: 0, opacity: 0.35 },
      { id: 2, left: '16%', size: 3, duration: 22, delay: 4, opacity: 0.25 },
      { id: 3, left: '25%', size: 5, duration: 16, delay: 2, opacity: 0.3 },
      { id: 4, left: '34%', size: 3, duration: 25, delay: 7, opacity: 0.2 },
      { id: 5, left: '42%', size: 4, duration: 19, delay: 1, opacity: 0.35 },
      { id: 6, left: '52%', size: 6, duration: 24, delay: 5, opacity: 0.25 },
      { id: 7, left: '61%', size: 3, duration: 20, delay: 3, opacity: 0.3 },
      { id: 8, left: '70%', size: 4, duration: 17, delay: 8, opacity: 0.25 },
      { id: 9, left: '79%', size: 5, duration: 23, delay: 2, opacity: 0.2 },
      { id: 10, left: '88%', size: 3, duration: 21, delay: 6, opacity: 0.35 },
      { id: 11, left: '94%', size: 4, duration: 19, delay: 4, opacity: 0.25 },
      { id: 12, left: '12%', size: 3, duration: 26, delay: 9, opacity: 0.2 },
      { id: 13, left: '28%', size: 4, duration: 18, delay: 11, opacity: 0.3 },
      { id: 14, left: '48%', size: 5, duration: 22, delay: 10, opacity: 0.25 },
      { id: 15, left: '66%', size: 3, duration: 20, delay: 12, opacity: 0.2 },
      { id: 16, left: '84%', size: 4, duration: 25, delay: 8, opacity: 0.3 },
    ];
  }, []);

  return (
    <div className="rentaro-global-bg" aria-hidden="true">
      {/* 1. Global Background Video: landding_bg */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        className="global-landding-video"
      >
        <source src="/landding_bg.mp4" type="video/mp4" />
      </video>

      {/* 2. Semi-Transparent Light Glass Overlay */}
      <div className="global-video-overlay" />

      {/* 3. Large Soft Floating Gradient Blobs with Parallax */}
      <div 
        className="bg-blob blob-coral-1"
        style={{
          transform: `translate3d(${mouseOffset.x * -8}px, ${mouseOffset.y * -8}px, 0)`
        }}
      />
      <div 
        className="bg-blob blob-blue-1"
        style={{
          transform: `translate3d(${mouseOffset.x * 10}px, ${mouseOffset.y * 10}px, 0)`
        }}
      />
      <div 
        className="bg-blob blob-coral-2"
        style={{
          transform: `translate3d(${mouseOffset.x * 6}px, ${mouseOffset.y * -6}px, 0)`
        }}
      />
      <div 
        className="bg-blob blob-blue-2"
        style={{
          transform: `translate3d(${mouseOffset.x * -12}px, ${mouseOffset.y * 12}px, 0)`
        }}
      />
      <div 
        className="bg-blob blob-amber-soft"
        style={{
          transform: `translate3d(${mouseOffset.x * 7}px, ${mouseOffset.y * 7}px, 0)`
        }}
      />

      {/* 4. Automotive Abstract Motion Lines & Subtle Curves */}
      <svg className="bg-automotive-svg" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none">
        <path 
          d="M-100,200 C300,100 600,450 1100,280 C1350,190 1500,320 1600,380" 
          className="road-line-anim line-primary"
        />
        <path 
          d="M-50,650 C250,550 700,750 1150,580 C1380,490 1520,620 1600,680" 
          className="road-line-anim line-secondary"
        />
        <path 
          d="M100,850 C450,780 850,920 1350,760" 
          className="road-line-anim line-tertiary"
        />
      </svg>

      {/* 5. Subtle Aerodynamic Ring Outlines */}
      <div 
        className="bg-aero-ring ring-top-right"
        style={{
          transform: `translate3d(${mouseOffset.x * -15}px, ${mouseOffset.y * -15}px, 0)`
        }}
      >
        <div className="ring-inner-pulse" />
      </div>
      
      <div 
        className="bg-aero-ring ring-bottom-left"
        style={{
          transform: `translate3d(${mouseOffset.x * 12}px, ${mouseOffset.y * 12}px, 0)`
        }}
      >
        <div className="ring-inner-pulse pulse-delay" />
      </div>

      {/* 6. Light Floating Atmosphere Particles */}
      <div className="bg-particles-container">
        {particles.map((p) => (
          <div
            key={p.id}
            className="floating-particle"
            style={{
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>
    </div>
  );
}
