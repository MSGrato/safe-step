import { useCallback, useRef } from 'react';

export function useTripleTap(onTripleTap: () => void, threshold = 500) {
  const tapsRef = useRef<number[]>([]);

  const handleTap = useCallback(() => {
    const now = Date.now();
    tapsRef.current.push(now);

    // Keep only taps within the threshold window
    tapsRef.current = tapsRef.current.filter(t => now - t < threshold);

    if (tapsRef.current.length >= 3) {
      tapsRef.current = [];
      onTripleTap();
    }
  }, [onTripleTap, threshold]);

  return handleTap;
}
