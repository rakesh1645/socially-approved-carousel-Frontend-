import { useEffect, useRef, useState } from 'react';

/**
 * Tracks whether an element is currently in the viewport.
 * Used to (a) lazy-load video sources/thumbnails only when they scroll
 * into view, and (b) pause videos as soon as they scroll out of view.
 */
export function useInView({ threshold = 0.5, rootMargin = '100px' } = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, isInView];
}
