import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

interface Bubble {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  isFoam?: boolean;
}

const BeerBubbles = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    // Create foam bubbles at the top
    const foamBubbles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 15 + 5,
      duration: Math.random() * 1.5 + 1,
      delay: Math.random() * 0.5,
      isFoam: true,
    }));

    // Create rising bubbles that will accumulate
    const risingBubbles = Array.from({ length: 45 }, (_, i) => ({
      id: i + 50,
      x: Math.random() * 100,
      size: Math.random() * 20 + 10,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 1,
      isFoam: false,
    }));

    setBubbles([...foamBubbles, ...risingBubbles]);
  }, []);

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
    >
      {bubbles.map(bubble => (
        <Box
          key={bubble.id}
          sx={{
            position: 'absolute',
            bottom: bubble.isFoam ? 'auto' : '-20px',
            top: bubble.isFoam ? '0' : 'auto',
            left: `${bubble.x}%`,
            width: bubble.size,
            height: bubble.size,
            borderRadius: '50%',
            background: bubble.isFoam 
              ? 'rgba(210,180,140,0.25)'
              : 'rgba(210,180,140,0.15)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(210,180,140,0.25)',
            animation: bubble.isFoam
              ? `foam ${bubble.duration}s ease-in-out ${bubble.delay}s infinite`
              : `riseAndFoam ${bubble.duration}s ease-in-out ${bubble.delay}s infinite`,
            '@keyframes riseAndFoam': {
              '0%': {
                transform: 'translate3d(0, 0, 0) scale(1)',
                opacity: 0,
              },
              '10%': {
                opacity: 0.8,
              },
              '80%': {
                transform: 'translate3d(0, -90vh, 0) scale(0.9)',
                opacity: 0.8,
              },
              '90%': {
                transform: 'translate3d(0, -95vh, 0) scale(0.85)',
                opacity: 0.7,
              },
              '100%': {
                transform: 'translate3d(0, -100vh, 0) scale(0.8)',
                opacity: 0.6,
              },
            },
            '@keyframes foam': {
              '0%': {
                transform: 'translate3d(0, 0, 0) scale(1)',
                opacity: 0.6,
              },
              '25%': {
                transform: 'translate3d(3px, -3px, 0) scale(1.03)',
                opacity: 0.7,
              },
              '50%': {
                transform: 'translate3d(-3px, -6px, 0) scale(1.06)',
                opacity: 0.8,
              },
              '75%': {
                transform: 'translate3d(3px, -3px, 0) scale(1.03)',
                opacity: 0.7,
              },
              '100%': {
                transform: 'translate3d(0, 0, 0) scale(1)',
                opacity: 0.6,
              },
            },
            willChange: 'transform, opacity',
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
            perspective: '1000px',
          }}
        />
      ))}
    </Box>
  );
};

export default BeerBubbles; 