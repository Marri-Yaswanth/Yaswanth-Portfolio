import React, { useState, useEffect } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SectionArrowProps {
  to: string;
  prev?: string;
  label?: string;
  prevLabel?: string;
}

const SectionArrow: React.FC<SectionArrowProps> = ({ to, prev, label = 'Next Section', prevLabel = 'Previous Section' }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`flex justify-center items-center gap-4 pt-10 pb-2 transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {prev && (
        <Link
          to={prev}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md text-amber-500 hover:text-amber-600 hover:shadow-lg transition-all animate-bounce"
          aria-label={prevLabel}
        >
          <ArrowUp size={20} />
        </Link>
      )}
      <Link
        to={to}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md text-amber-500 hover:text-amber-600 hover:shadow-lg transition-all animate-bounce"
        aria-label={label}
      >
        <ArrowDown size={20} />
      </Link>
    </div>
  );
};

export default SectionArrow;
