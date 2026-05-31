'use client';
import { motion } from 'framer-motion';

export default function FloatingNotes() {
  return (
    <div style={{ display: 'flex', gap: '6rem', alignItems: 'center', justifyContent: 'center' }}>
      {/* Note 1: Double Beamed Note */}
      <motion.div
        animate={{ y: [0, -40, 0, 40, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0 }}
      >
        <svg 
          viewBox="0 0 12 12" 
          style={{ 
            width: '250px', 
            height: '250px', 
            shapeRendering: 'crispEdges',
            filter: 'drop-shadow(-20px 20px 0 rgba(0, 170, 255, 0.2))'
          }}
        >
          <path 
            d="M3 8 h3 v2 h-3 z M8 7 h3 v3 h-3 z M5 2 h1 v7 h-1 z M10 1 h1 v7 h-1 z M5 1 h6 v2 h-6 z" 
            fill="#00aaff" 
          />
        </svg>
      </motion.div>

      {/* Note 2: Quarter Note */}
      <motion.div
        animate={{ y: [0, -40, 0, 40, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <svg 
          viewBox="0 0 12 12" 
          style={{ 
            width: '200px', 
            height: '200px', 
            shapeRendering: 'crispEdges',
            filter: 'drop-shadow(-20px 20px 0 rgba(170, 0, 255, 0.2))'
          }}
        >
          <path 
            d="M4 8 h3 v3 h-3 z M6 2 h1 v8 h-1 z M7 2 h3 v2 h-3 z" 
            fill="#aa00ff" 
          />
        </svg>
      </motion.div>

      {/* Note 3: Eighth Note */}
      <motion.div
        animate={{ y: [0, -40, 0, 40, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <svg 
          viewBox="0 0 12 12" 
          style={{ 
            width: '220px', 
            height: '220px', 
            shapeRendering: 'crispEdges',
            filter: 'drop-shadow(-20px 20px 0 rgba(255, 0, 170, 0.2))'
          }}
        >
          <path 
            d="M4 8 h3 v3 h-3 z M6 2 h1 v8 h-1 z M7 2 h4 v2 h-4 z M10 4 h1 v2 h-1 z M9 5 h1 v2 h-1 z" 
            fill="#ff00aa" 
          />
        </svg>
      </motion.div>
    </div>
  );
}
