import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VariableProximity from './components/VariableProximity';
import BirthdayCake from './components/BirthdayCake';
import BubbleBackground from './components/BubbleBackground';
import { useAudioController } from './hooks/useAudioController';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [candleCount, setCandleCount] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const { isBlowing } = useAudioController();

  const handleCandlesChange = (litCandles: number) => {
    setCandleCount(litCandles);
    if (litCandles === 0 && candleCount > 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden"
    >
      {/* Bubble Background */}
      <BubbleBackground />

      {/* Header with Interactive Text */}
      <div className="text-center mb-12 relative">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4"
        >
          <span className="text-4xl mr-4">🎉</span>
          <VariableProximity
            label="HAPPY BIRTHDAY DEVIKA"
            fromFontVariationSettings="'wght' 400, 'opsz' 14"
            toFontVariationSettings="'wght' 900, 'opsz' 72"
            containerRef={containerRef}
            radius={120}
            falloff="exponential"
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
          />
          <span className="text-4xl ml-4">🎉</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg text-gray-700 mb-8 font-semibold"
        >
          Move your mouse over the text above to see the magic! ✨
        </motion.p>
      </div>

      {/* Candle Counter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-8 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-pink-200"
      >
        <span className="text-xl font-bold text-gray-800">
          Candles on the Cake: <span className="text-pink-600 font-bold">{candleCount}</span> / 21
        </span>
      </motion.div>

      {/* Instructions */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="text-lg text-gray-700 mb-8 text-center font-semibold"
      >
        Blow into your microphone to blow out the candles! 💨<br />
        <span className="text-sm">Click on the cake to add more candles (max 21)</span>
      </motion.p>

      {/* Birthday Cake */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8, type: "spring" }}
        className="relative"
      >
        <BirthdayCake 
          isBlowing={isBlowing}
          onCandlesChange={handleCandlesChange}
        />
      </motion.div>

      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="text-center"
            >
              <div className="text-8xl mb-4">🎉</div>
              <div 
                className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent"
                style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
              >
                HAPPY BIRTHDAY DEVUUUUU!
              </div>
              <div className="text-2xl text-gray-700 mt-2">
                All candles blown out! 🎂
              </div>
            </motion.div>
            
            {/* Confetti */}
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full"
                style={{
                  left: `${50 + (Math.random() - 0.5) * 100}%`,
                  top: `${30 + (Math.random() - 0.5) * 40}%`,
                }}
                initial={{ scale: 0, y: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  y: [0, -200, -400],
                  x: [(Math.random() - 0.5) * 200]
                }}
                transition={{ 
                  duration: 3,
                  delay: Math.random() * 0.5,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="mt-16 text-center text-gray-600 text-sm font-medium"
      >
        <p>🎈 Wishing you the happiest of birthdays, Devika! 🎈</p>
      </motion.div>
    </div>
  );
}

export default App;