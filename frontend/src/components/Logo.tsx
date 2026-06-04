import React from "react";

interface LogoProps {
  showText?: boolean;
  className?: string;
  iconSize?: number;
}

const Logo = ({ showText = true, className = "flex items-center gap-3 select-none", iconSize = 28 }: LogoProps) => {
  return (
    <div className={className}>
      {/* Luxury fintech vector SVG logo */}
      <svg 
        width={iconSize} 
        height={iconSize} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Outer segmented luxury circle */}
        <circle cx="16" cy="16" r="14" stroke="var(--color-gold-hex)" strokeWidth="1" strokeDasharray="3 3" opacity="0.35" />
        
        {/* Stylized structural pillars and Monogram M */}
        <path 
          d="M8 22V10L13 15L16 12L19 15L24 10V22" 
          stroke="var(--color-text-hex)" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* Golden upwards growth trend segment */}
        <path 
          d="M8 20C12 20 14 16 16 16C18 16 20 12 24 12" 
          stroke="var(--color-gold-hex)" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* Arrow head on the golden growth trend */}
        <path 
          d="M20 12H24V16" 
          stroke="var(--color-gold-hex)" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* Central accent wealth dot */}
        <circle cx="16" cy="16" r="1.5" fill="var(--color-gold-hex)" />
      </svg>

      {/* Wordmark logo */}
      {showText && (
        <span className="text-base font-serif font-bold tracking-widest text-text-app uppercase ml-0.5">
          Monetra
        </span>
      )}
    </div>
  );
};

export default Logo;
export { Logo };

