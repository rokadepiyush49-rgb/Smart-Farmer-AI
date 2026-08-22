/**
 * Original crop glyphs, drawn as inline SVG so they stay crisp, themeable and
 * offline-safe. Deliberately soft and rounded — friendly, not botanical.
 */
export type CropId =
  | "wheat" | "rice" | "maize" | "tomato" | "potato"
  | "soybean" | "cotton" | "onion" | "sugarcane";

const stroke = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function CropGlyph({ crop, className = "h-8 w-8" }: { crop: CropId; className?: string }) {
  const common = { viewBox: "0 0 48 48", className, "aria-hidden": true } as const;

  switch (crop) {
    case "wheat":
      return (
        <svg {...common}>
          <path d="M24 42V18" stroke="#8A6A4F" strokeWidth="3" {...stroke} />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <path d={`M24 ${16 + i * 6}c-6 0-9 3-9 6 5 1 9-2 9-6z`} fill="#F5A524" />
              <path d={`M24 ${16 + i * 6}c6 0 9 3 9 6-5 1-9-2-9-6z`} fill="#E5941A" />
            </g>
          ))}
          <path d="M24 14c0-4 2-7 5-9 1 5-1 9-5 9z" fill="#34C77B" />
        </svg>
      );
    case "rice":
      return (
        <svg {...common}>
          <path d="M24 42V22" stroke="#8A6A4F" strokeWidth="3" {...stroke} />
          <path d="M24 24c-8-1-13-6-15-13 9-1 14 4 15 13z" fill="#34C77B" />
          <path d="M24 24c8-1 13-6 15-13-9-1-14 4-15 13z" fill="#1B7A45" />
          <circle cx="24" cy="15" r="3.5" fill="#F5A524" />
        </svg>
      );
    case "maize":
      return (
        <svg {...common}>
          <path d="M24 6c6 4 8 12 8 18s-3 12-8 16c-5-4-8-10-8-16S18 10 24 6z" fill="#F5A524" />
          <path d="M24 6c6 4 8 12 8 18s-3 12-8 16" fill="#E5941A" />
          {[14, 21, 28, 35].map((y) => (
            <path key={y} d={`M17 ${y}h14`} stroke="#B87708" strokeWidth="1.6" opacity="0.5" {...stroke} />
          ))}
          <path d="M16 20c-6-2-9-7-9-13 7 0 11 5 11 12z" fill="#34C77B" />
        </svg>
      );
    case "tomato":
      return (
        <svg {...common}>
          <circle cx="24" cy="28" r="14" fill="#E5484D" />
          <path d="M24 16c4 0 8 3 10 8" stroke="#fff" strokeWidth="2.4" opacity="0.35" {...stroke} />
          <path d="M24 15c-4-3-8-3-11-1 2 3 5 5 11 5s9-2 11-5c-3-2-7-2-11 1z" fill="#1B7A45" />
          <path d="M24 15V9" stroke="#1B7A45" strokeWidth="3" {...stroke} />
        </svg>
      );
    case "potato":
      return (
        <svg {...common}>
          <path d="M11 26c0-9 8-14 16-13s12 6 11 14-8 13-16 13-11-5-11-14z" fill="#C79A6B" />
          {[[19, 24], [29, 22], [26, 32], [33, 30]].map(([cx, cy], i) => (
            <ellipse key={i} cx={cx} cy={cy} rx="2.2" ry="1.5" fill="#8A6A4F" opacity="0.75" />
          ))}
        </svg>
      );
    case "soybean":
      return (
        <svg {...common}>
          <path d="M14 34c-4-8 0-18 8-22 6 8 6 18-1 24-3 2-6 1-7-2z" fill="#34C77B" />
          <path d="M22 12c8 2 13 10 12 18-9 1-15-6-12-18z" fill="#1B7A45" />
          <circle cx="20" cy="27" r="2.6" fill="#FBF8F1" opacity="0.85" />
          <circle cx="27" cy="24" r="2.6" fill="#FBF8F1" opacity="0.6" />
        </svg>
      );
    case "cotton":
      return (
        <svg {...common}>
          <path d="M24 40V26" stroke="#8A6A4F" strokeWidth="3" {...stroke} />
          <circle cx="18" cy="20" r="7" fill="#FFFFFF" />
          <circle cx="30" cy="20" r="7" fill="#F4F1E8" />
          <circle cx="24" cy="14" r="7.5" fill="#FFFFFF" />
          <circle cx="24" cy="24" r="6.5" fill="#F4F1E8" />
          <path d="M24 26l-5 4M24 26l5 4" stroke="#8A6A4F" strokeWidth="2" {...stroke} />
        </svg>
      );
    case "onion":
      return (
        <svg {...common}>
          <path d="M24 42c-8 0-13-6-13-13S18 16 24 16s13 6 13 13-5 13-13 13z" fill="#B86BA8" />
          <path d="M24 16v26M17 19c-2 7-2 15 0 21M31 19c2 7 2 15 0 21" stroke="#8E4F82" strokeWidth="1.6" opacity="0.6" {...stroke} />
          <path d="M24 16c-2-6-1-10 2-13M24 16c2-5 5-8 8-9" stroke="#34C77B" strokeWidth="2.6" {...stroke} />
        </svg>
      );
    case "sugarcane":
      return (
        <svg {...common}>
          <rect x="20" y="10" width="8" height="32" rx="4" fill="#8FBF5A" />
          {[18, 26, 34].map((y) => (
            <path key={y} d={`M20 ${y}h8`} stroke="#5E8A32" strokeWidth="2" {...stroke} />
          ))}
          <path d="M20 16c-6-2-9-6-10-11 7 0 11 4 11 10z" fill="#34C77B" />
          <path d="M28 22c6-2 9-6 10-11-7 0-11 4-11 10z" fill="#1B7A45" />
        </svg>
      );
  }
}

/** Big soft leaf used by hero/empty states. */
export function LeafArt({ className = "h-40 w-40" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <linearGradient id="leafg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4FD891" />
          <stop offset="100%" stopColor="#1B7A45" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="88" fill="#E4F5EA" />
      <path
        d="M100 168c-34-10-56-40-56-76 0-24 14-46 36-58 10 24 30 34 48 46 20 13 28 30 24 50-4 22-24 36-52 38z"
        fill="url(#leafg)"
      />
      <path d="M100 168c-6-32-4-64 12-96" stroke="#E4F5EA" strokeWidth="5" fill="none" strokeLinecap="round" />
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M${104 + i * 2} ${140 - i * 22}c10-4 18-12 22-22`}
          stroke="#E4F5EA"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          opacity={0.85}
        />
      ))}
    </svg>
  );
}
