import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Candle {
  id: number;
  isLit: boolean;
  x: number;
  y: number;
}

interface BirthdayCakeProps {
  isBlowing: boolean;
  onCandlesChange: (litCandles: number) => void;
}

export default function BirthdayCake({ isBlowing, onCandlesChange }: BirthdayCakeProps) {
  const [candles, setCandles] = useState<Candle[]>([
    { id: 1, isLit: true, x: 150, y: 130 },
  ]);

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (isBlowing) {
      setCandles(prev => 
        prev.map(candle => {
          if (candle.isLit && Math.random() > 0.3) {
            return { ...candle, isLit: false };
          }
          return candle;
        })
      );
    }
  }, [isBlowing]);

  useEffect(() => {
    const litCandles = candles.filter(candle => candle.isLit).length;
    onCandlesChange(litCandles);
  }, [candles, onCandlesChange]);

  const addCandle = (event: React.MouseEvent<SVGSVGElement>) => {
    // Limit to 21 candles maximum
    if (candles.length >= 21) return;
    
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 300;
    const y = ((event.clientY - rect.top) / rect.height) * 300;

    // Check if click is on the cake area
    const cakeLeft = 70;
    const cakeRight = 230;
    const cakeCenterX = 150;
    const cakePeakY = 130;
    const curvature = 1 / 320;

    if (x > cakeLeft && x < cakeRight) {
      const cakeTopY = curvature * Math.pow(x - cakeCenterX, 2) + cakePeakY;
      const clickableBand = 20;

      if (y > cakeTopY - clickableBand && y < cakeTopY + clickableBand) {
        const newCandle: Candle = {
          id: Date.now(),
          isLit: true,
          x: x,
          y: cakeTopY
        };
        setCandles(prev => [...prev, newCandle]);
      }
    }
  };

  const relightCandles = () => {
    setCandles(prev => prev.map(candle => ({ ...candle, isLit: true })));
  };

  return (
    <div className="relative">
      <div className="w-80 h-80 mx-auto">
        <svg
          ref={svgRef}
          viewBox="0 0 300 300"
          className="w-full h-full cursor-pointer"
          onClick={addCandle}
        >
          {/* Cake plate */}
          <path
            d="M 40 250 Q 150 280 260 250"
            stroke="#333"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Cake body */}
          <path
            d="M 70,250 C 70,250 70,150 70,150 C 70,130 230,130 230,150 C 230,150 230,250 230,250 Z"
            fill="#FFC0CB"
            stroke="#333"
            strokeWidth="2.5"
          />
          
          {/* Cake decoration lines */}
          <path
            d="M 70 180 Q 110 160, 150 180 T 230 180"
            stroke="#333"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 70 220 Q 110 200, 150 220 T 230 220"
            stroke="#333"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Candles */}
          {candles.map((candle) => (
            <g key={candle.id} transform={`translate(${candle.x}, ${candle.y})`}>
              {/* Candle body */}
              <rect
                x="-5"
                y="-30"
                width="10"
                height="30"
                rx="2"
                fill="#ffa5be"
                stroke="#333"
                strokeWidth="2.5"
              />
              
              {/* Flame */}
              <AnimatePresence>
                {candle.isLit && (
                  <motion.g
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.ellipse
                      cx="0"
                      cy="-45"
                      rx="7"
                      ry="15"
                      fill="url(#flameGradient)"
                      animate={{
                        scaleX: [1, 1.1, 0.9, 1],
                        scaleY: [1, 0.9, 1.1, 1],
                        rotate: [-2, 2, -1, 1, 0]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{
                        filter: 'drop-shadow(0 0 10px rgba(255, 165, 0, 0.8))'
                      }}
                    />
                  </motion.g>
                )}
              </AnimatePresence>
            </g>
          ))}

          {/* Flame gradient definition */}
          <defs>
            <radialGradient id="flameGradient" cx="50%" cy="80%" r="60%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="30%" stopColor="#FF8C00" />
              <stop offset="70%" stopColor="#FF4500" />
              <stop offset="100%" stopColor="#DC143C" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Relight Button */}
      {candles.every(candle => !candle.isLit) && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={relightCandles}
          className="mt-8 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 border-2 border-gray-800"
        >
          🎂 Light the Candles Again! 🎂
        </motion.button>
      )}
    </div>
  );
}