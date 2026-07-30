import { useState, useEffect, useRef } from 'react';

export default function useCountUp(end, duration = 900, startCounting = false) {
  const [count, setCount] = useState(0);
  const frameRef = useRef(null);
  const startTime = useRef(null);

  useEffect(() => {
    if (!startCounting) return;

    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [end, duration, startCounting]);

  return count;
}