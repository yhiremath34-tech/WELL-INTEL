import React from 'react';

export const WaveContainer: React.FC<{
  className?: string;
  fillColor?: string;
  invert?: boolean;
}> = ({
  className = 'w-full overflow-hidden leading-none',
  fillColor = '#06131F',
  invert = false,
}) => {
  return (
    <div className={`${className} ${invert ? 'rotate-180' : ''}`}>
      <svg
        className="relative block w-[200%] h-14 md:h-24 animate-wave text-opacity-10"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,60 L1200,120 L0,120 Z"
          fill={fillColor}
          fillOpacity="0.4"
        />
        <path
          d="M0,20 C200,80 420,-10 650,55 C880,120 1050,40 1200,80 L1200,120 L0,120 Z"
          fill={fillColor}
          fillOpacity="0.85"
        />
      </svg>
    </div>
  );
};
