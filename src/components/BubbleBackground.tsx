import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  opacity: number;
}

export default function BubbleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const animationRef = useRef<number>();

  const colors = [
    'rgba(255, 255, 255, 0.6)',
    'rgba(255, 192, 203, 0.4)',
    'rgba(255, 182, 193, 0.5)',
    'rgba(255, 228, 225, 0.7)',
    'rgba(255, 240, 245, 0.8)',
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    // Initialize bubbles
    for (let i = 0; i < 30; i++) {
      bubblesRef.current.push({
        id: i,
        x: Math.random() * containerWidth,
        y: Math.random() * containerHeight,
        size: Math.random() * 60 + 20,
        speed: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.6 + 0.2,
      });
    }

    const animate = () => {
      bubblesRef.current.forEach((bubble) => {
        bubble.y -= bubble.speed;
        
        // Reset bubble when it goes off screen
        if (bubble.y + bubble.size < 0) {
          bubble.y = containerHeight + bubble.size;
          bubble.x = Math.random() * containerWidth;
        }
      });

      // Re-render bubbles
      const bubbleElements = container.querySelectorAll('.bubble');
      bubbleElements.forEach((element, index) => {
        const bubble = bubblesRef.current[index];
        if (bubble && element instanceof HTMLElement) {
          element.style.transform = `translate(${bubble.x}px, ${bubble.y}px)`;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ 
        background: 'linear-gradient(135deg, #faf9f6 0%, #fff0f5 50%, #ffe4e1 100%)'
      }}
    >
      {bubblesRef.current.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="bubble absolute rounded-full"
          style={{
            width: bubble.size,
            height: bubble.size,
            backgroundColor: bubble.color,
            opacity: bubble.opacity,
            filter: 'blur(1px)',
          }}
          initial={{ 
            x: bubble.x, 
            y: bubble.y,
            scale: 0 
          }}
          animate={{ 
            scale: [0, 1, 1, 0.8, 1],
            opacity: [0, bubble.opacity, bubble.opacity, bubble.opacity * 0.7, bubble.opacity],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}
      
      {/* Additional floating particles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-pink-200 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}