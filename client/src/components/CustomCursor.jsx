import React, { useEffect, useState, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [cursorState, setCursorState] = useState({
    active: false,
    text: '',
    variant: 'default', // default | view | drag | explore | book
    visible: false,
  });

  const mousePos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const rafId = useRef(null);

  useEffect(() => {
    // Only enable on desktop with fine pointer
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(hover: none) or (pointer: coarse)').matches;
    if (isTouch) return;

    document.body.classList.add('has-custom-cursor');

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!cursorState.visible) {
        setCursorState((prev) => ({ ...prev, visible: true }));
      }
    };

    const handleMouseLeave = () => {
      setCursorState((prev) => ({ ...prev, visible: false }));
    };

    const handleMouseEnter = () => {
      setCursorState((prev) => ({ ...prev, visible: true }));
    };

    const handleInteractionOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        const cursorType = target.getAttribute('data-cursor');
        const text = target.getAttribute('data-cursor-text') || cursorType;
        setCursorState((prev) => ({
          ...prev,
          active: true,
          variant: cursorType,
          text: text.toUpperCase(),
        }));
      } else if (e.target.closest('button, a, input, select, textarea')) {
        setCursorState((prev) => ({
          ...prev,
          active: true,
          variant: 'interactive',
          text: '',
        }));
      } else {
        setCursorState((prev) => ({
          ...prev,
          active: false,
          variant: 'default',
          text: '',
        }));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleInteractionOver);

    // Smooth RAF follower
    const render = () => {
      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * 0.18;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * 0.18;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      rafId.current = requestAnimationFrame(render);
    };

    rafId.current = requestAnimationFrame(render);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleInteractionOver);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(hover: none) or (pointer: coarse)').matches) {
    return null;
  }

  const isText = Boolean(cursorState.text);

  return (
    <div
      ref={cursorRef}
      className={`cursor-follower fixed top-0 left-0 pointer-events-none z-[99999] flex items-center justify-center transition-opacity duration-300 ${
        cursorState.visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ willChange: 'transform' }}
    >
      <div
        className={`rounded-full flex items-center justify-center transition-all duration-300 ${
          isText
            ? 'w-16 h-16 bg-[#C5A880] text-[#0B0B0B] text-[9px] font-mono tracking-widest font-bold shadow-2xl scale-100'
            : cursorState.variant === 'interactive'
            ? 'w-10 h-10 bg-white/10 border border-white/30 backdrop-blur-[1px] scale-100'
            : 'w-2.5 h-2.5 bg-[#F4F2ED] scale-100'
        }`}
      >
        {isText && <span className="animate-fade-in select-none">{cursorState.text}</span>}
      </div>
    </div>
  );
};

export default CustomCursor;
