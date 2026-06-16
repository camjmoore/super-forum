interface IconProps {
  size?: number;
  style?: React.CSSProperties;
}

export function SearchIcon({ size = 15, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}>
      <circle cx="7" cy="7" r="4.3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10.3 10.3L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function PlusIcon({ size = 15, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}>
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function BackIcon({ size = 15, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}>
      <path d="M9.5 3.5L5 8l4.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BookmarkIcon({ size = 14, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}>
      <path d="M4 2.5h8v11l-4-2.6-4 2.6v-11z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export function ShareIcon({ size = 14, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}>
      <circle cx="12" cy="4" r="1.8" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="4" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12" cy="12" r="1.8" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10.4 5L5.6 7M5.6 9l4.8 2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function CommentIcon({ size = 14, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}>
      <path d="M2.5 4.2a1.7 1.7 0 011.7-1.7h7.6a1.7 1.7 0 011.7 1.7v5a1.7 1.7 0 01-1.7 1.7H6.5l-3 2.4V11H4.2A1.7 1.7 0 012.5 9.2v-5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export function EyeIcon({ size = 14, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}>
      <path d="M1.5 8S3.8 3.8 8 3.8 14.5 8 14.5 8 12.2 12.2 8 12.2 1.5 8 1.5 8z" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function ReplyIcon({ size = 14, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}>
      <path d="M6 4L2.5 7.5 6 11M3 7.5h6.5a3.5 3.5 0 013.5 3.5v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronIcon({ size = 14, dir = 'up', style }: IconProps & { dir?: 'up' | 'down' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ transform: dir === 'down' ? 'rotate(180deg)' : 'none', ...style }}>
      <path d="M8 3.5L13 11H3L8 3.5Z" fill="currentColor" />
    </svg>
  );
}
