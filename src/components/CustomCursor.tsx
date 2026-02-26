import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show custom cursor on non-touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const move = (e: MouseEvent) => {
      if (!visible) setVisible(true);
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
    };

    const onEnterInteractive = () => setHovering(true);
    const onLeaveInteractive = () => setHovering(false);

    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseleave', leave);
    document.addEventListener('mouseenter', enter);

    // Attach to interactive elements
    const interactiveNodes = document.querySelectorAll('a, button, [role="button"], input, textarea, select, .project-card');
    interactiveNodes.forEach((el) => {
      el.addEventListener('mouseenter', onEnterInteractive);
      el.addEventListener('mouseleave', onLeaveInteractive);
    });

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
      document.removeEventListener('mouseenter', enter);
      interactiveNodes.forEach((el) => {
        el.removeEventListener('mouseenter', onEnterInteractive);
        el.removeEventListener('mouseleave', onLeaveInteractive);
      });
    };
  }, [visible]);

  // Don't render anything on touch devices
  if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    return null;
  }

  return (
    <>
      {/* Dot cursor */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-transform duration-100 ease-out"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <div
          className={`rounded-full bg-amber-400 transition-all duration-200 ${
            hovering ? 'w-10 h-10 opacity-30' : 'w-2.5 h-2.5 opacity-80'
          }`}
        />
      </div>

      {/* Glow ring */}
      <div
        ref={glowRef}
        className="fixed pointer-events-none z-[99] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <div
          className={`rounded-full border border-amber-400/40 transition-all duration-300 ${
            hovering ? 'w-14 h-14 border-amber-400/60' : 'w-8 h-8'
          }`}
        />
      </div>
    </>
  );
};

export default CustomCursor;
