import React, { useEffect, useRef, ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  delayMultiplier?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ 
  children, 
  id, 
  className = '',
  delayMultiplier = 0
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
      className={`fade-in-section ${className}`}
    >
      {children}
    </section>
  );
};

export default AnimatedSection;