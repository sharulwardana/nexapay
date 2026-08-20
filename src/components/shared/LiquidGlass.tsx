'use client';

import React, { useRef, useState, useEffect, useId } from 'react';
import { cn } from '@/lib/utils';

export interface LiquidGlassProps {
  children?: React.ReactNode;
  displacementScale?: number;
  blurAmount?: number;
  saturation?: number;
  aberrationIntensity?: number;
  elasticity?: number;
  cornerRadius?: number | string;
  className?: string;
  padding?: string;
  style?: React.CSSProperties;
  overLight?: boolean;
  onClick?: () => void;
  mouseContainer?: React.RefObject<HTMLElement | null> | null;
  mode?: 'standard' | 'polar' | 'prominent' | 'shader';
  globalMousePos?: { x: number; y: number };
  mouseOffset?: { x: number; y: number };
}

export default function LiquidGlass({
  children,
  displacementScale = 70,
  blurAmount = 0.0625,
  saturation = 140,
  aberrationIntensity = 2,
  elasticity = 0.15,
  cornerRadius = 999,
  className = '',
  padding,
  style,
  overLight = false,
  onClick,
  mouseContainer = null,
  mode = 'standard',
  globalMousePos,
  mouseOffset = { x: 0, y: 0 },
}: LiquidGlassProps) {
  const filterId = useId().replace(/:/g, '');
  const containerRef = useRef<HTMLDivElement>(null);

  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [elasticPos, setElasticPos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    let animId: number;

    const updateElastic = () => {
      setElasticPos((prev) => {
        const dx = mousePos.x - prev.x;
        const dy = mousePos.y - prev.y;
        if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
          return prev;
        }
        return {
          x: prev.x + dx * (elasticity * 1.5),
          y: prev.y + dy * (elasticity * 1.5),
        };
      });
      animId = requestAnimationFrame(updateElastic);
    };

    animId = requestAnimationFrame(updateElastic);
    return () => cancelAnimationFrame(animId);
  }, [mousePos, elasticity]);

  useEffect(() => {
    if (globalMousePos) {
      setMousePos(globalMousePos);
      return;
    }

    const targetEl = mouseContainer?.current || containerRef.current;
    if (!targetEl) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = targetEl.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePos({
        x: Math.max(0, Math.min(1, x + mouseOffset.x)),
        y: Math.max(0, Math.min(1, y + mouseOffset.y)),
      });
    };

    const handleMouseLeave = () => {
      setMousePos({ x: 0.5, y: 0.5 });
    };

    targetEl.addEventListener('mousemove', handleMouseMove);
    targetEl.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      targetEl.removeEventListener('mousemove', handleMouseMove);
      targetEl.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseContainer, globalMousePos, mouseOffset]);

  const calcBlur = Math.max(4, blurAmount * 64);
  const calcScale = displacementScale * 0.3;
  const shiftX = (elasticPos.x - 0.5) * aberrationIntensity * 4;
  const shiftY = (elasticPos.y - 0.5) * aberrationIntensity * 4;

  const radiusStyle =
    typeof cornerRadius === 'number' ? `${cornerRadius}px` : cornerRadius;

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      style={{
        borderRadius: radiusStyle,
        padding: padding,
        ...style,
      }}
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden transition-shadow duration-300 select-none cursor-pointer',
        className
      )}
    >
      {/* SVG Liquid Refraction Filter */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id={`liquid-glass-refract-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={calcScale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feColorMatrix
              type="saturate"
              values={`${saturation / 100}`}
            />
          </filter>
        </defs>
      </svg>

      {/* Glass Base Layer */}
      <div
        className={cn(
          'absolute inset-0 rounded-[inherit] transition-all duration-300 pointer-events-none',
          overLight
            ? 'bg-white/20 border border-black/10 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.6)]'
            : 'bg-white/[0.08] dark:bg-black/35 border border-white/30 dark:border-white/20 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.4),0_12px_40px_rgba(0,0,0,0.5)]'
        )}
        style={{
          backdropFilter: `blur(${calcBlur}px) saturate(${saturation}%)`,
          WebkitBackdropFilter: `blur(${calcBlur}px) saturate(${saturation}%)`,
          filter: mode === 'shader' ? `url(#liquid-glass-refract-${filterId})` : undefined,
        }}
      />

      {/* Chromatic Aberration Specular Edges */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none transition-transform duration-100"
        style={{
          transform: `translate(${shiftX}px, ${shiftY}px)`,
          boxShadow: `inset 1px 1px 2px rgba(255,0,128,${0.15 * aberrationIntensity}), inset -1px -1px 2px rgba(0,255,255,${0.15 * aberrationIntensity})`,
        }}
      />

      {/* Light Reflection Polish */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none bg-gradient-to-br from-white/30 via-transparent to-transparent"
        style={{
          opacity: 0.7,
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
