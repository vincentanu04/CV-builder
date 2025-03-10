import { useEffect, useRef, useState, ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  threshold?: number; // How much of the element needs to be visible to trigger the animation (0-1)
  delay?: number; // Delay before animation starts (ms)
  duration?: number; // Animation duration (ms)
  once?: boolean; // Whether to animate only once or every time the element enters the viewport
  className?: string;
}

export function FadeIn({
  children,
  threshold = 0.1,
  delay = 0,
  duration = 600,
  once = true,
  className = '',
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // If we only want to animate once and it's already animated, do nothing
        if (once && hasAnimated) return;

        if (entry.isIntersecting) {
          // Delay the visibility change
          setTimeout(() => {
            setIsVisible(true);
            if (once) setHasAnimated(true);
          }, delay);
        } else if (!once) {
          // If not once, hide when out of viewport
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, delay, once, hasAnimated]);

  return (
    <div
      ref={ref}
      className={`transition-opacity ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
      }}
    >
      {children}
    </div>
  );
}
