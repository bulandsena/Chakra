import React from 'react';

interface ChakraLogoProps {
  size?: number;
  className?: string;
  showWordmark?: boolean;
  showTagline?: boolean;
  light?: boolean;
}

export const ChakraLogo: React.FC<ChakraLogoProps> = ({
  size = 40,
  className = '',
  showWordmark = true,
  showTagline = false,
  light = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Sacred Geometry Circular CHAKRA Emblem */}
      <div
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm transition-transform duration-500 hover:rotate-45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Sun Ring */}
          <circle
            cx="50"
            cy="50"
            r="46"
            stroke="#D8AD60"
            strokeWidth="1.5"
            strokeDasharray="2 3"
            opacity="0.8"
          />

          {/* Primary Golden Boundary Ring */}
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="#D8AD60"
            strokeWidth="2.5"
          />

          {/* Deep Forest Green Interior Field */}
          <circle
            cx="50"
            cy="50"
            r="39.5"
            fill="#132C28"
          />

          {/* Concentric Golden Inner Ring */}
          <circle
            cx="50"
            cy="50"
            r="26"
            stroke="#D8AD60"
            strokeWidth="1.2"
            opacity="0.9"
          />

          {/* 8 Radiating Sacred Energy Spokes / Petals */}
          <g stroke="#D8AD60" strokeWidth="2" strokeLinecap="round">
            <line x1="50" y1="12" x2="50" y2="24" />
            <line x1="50" y1="76" x2="50" y2="88" />
            <line x1="12" y1="50" x2="24" y2="50" />
            <line x1="76" y1="50" x2="88" y2="50" />

            <line x1="23.1" y1="23.1" x2="31.6" y2="31.6" />
            <line x1="68.4" y1="68.4" x2="76.9" y2="76.9" />
            <line x1="23.1" y1="76.9" x2="31.6" y2="68.4" />
            <line x1="68.4" y1="31.6" x2="76.9" y2="23.1" />
          </g>

          {/* Eight Diamond Points of Illumination */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => {
            const rad = (angle * Math.PI) / 180;
            const cx = 50 + 33 * Math.cos(rad);
            const cy = 50 + 33 * Math.sin(rad);
            return (
              <circle
                key={idx}
                cx={cx}
                cy={cy}
                r="1.8"
                fill="#D8AD60"
              />
            );
          })}

          {/* Inner Golden Wheel Hub (Bindu Center) */}
          <circle
            cx="50"
            cy="50"
            r="12"
            fill="#D8AD60"
          />
          <circle
            cx="50"
            cy="50"
            r="8"
            fill="#132C28"
          />
          <circle
            cx="50"
            cy="50"
            r="3.5"
            fill="#D8AD60"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-xl font-bold tracking-wider font-serif ${
                light ? 'text-chakra-ivory' : 'text-chakra-green dark:text-chakra-ivory'
              }`}
              style={{ letterSpacing: '0.12em' }}
            >
              CHAKRA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-chakra-gold shrink-0 inline-block mb-0.5" />
          </div>
          {showTagline && (
            <span
              className={`text-[10px] tracking-widest uppercase mt-0.5 ${
                light
                  ? 'text-chakra-gold-light'
                  : 'text-stone-500 dark:text-stone-400'
              }`}
              style={{ letterSpacing: '0.18em' }}
            >
              Create • Sell • Earn
            </span>
          )}
        </div>
      )}
    </div>
  );
};
