import { useState, useEffect } from 'react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-8 right-8 z-50 p-4 transition-all duration-300
        bg-p4-yellow text-p4-black border-2 border-p4-black shadow-[4px_4px_0px_0px_#111111]
        hover:-translate-y-1 active:translate-y-0 active:shadow-none
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
      `}
      style={{ transform: 'skewX(-10deg)' }}
    >
      <div style={{ transform: 'skewX(10deg)' }}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="m18 15-6-6-6 6"/>
        </svg>
      </div>
    </button>
  );
}
