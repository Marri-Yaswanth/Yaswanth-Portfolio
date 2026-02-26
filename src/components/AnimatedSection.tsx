import React, { useEffect, useRef, ReactNode } from 'react';

type AnimationDirection = 'up' | 'left' | 'right';

interface AnimatedSectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  delayMultiplier?: number;
  direction?: AnimationDirection;
  onClick?: () => void;
}

const directionClass: Record<AnimationDirection, string> = {
  up: '',
  left: 'stagger-left',
  right: 'stagger-right',
};

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ 
  children, 
  id, 
  className = '',
  delayMultiplier = 0,
  direction = 'up',
  onClick,
}) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add a small delay based on the multiplier to create a cascading effect
            setTimeout(() => {
              entry.target.classList.add('show');
            }, delayMultiplier * 150);
            
            // Once it's visible, stop observing
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when at least 10% of the element is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [delayMultiplier]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`fade-in-section ${directionClass[direction]} ${className}`}
      onClick={onClick}
    >
      {children}
    </section>
  );
};

export default AnimatedSection;