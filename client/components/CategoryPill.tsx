interface CategoryPillProps {
  name: string;
  active?: boolean;
  onClick?: () => void;
}

export default function CategoryPill({ name, active = false, onClick }: CategoryPillProps) {
  return (
    <button
      onClick={onClick}
      className="meta"
      style={{
        border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
        background: active ? 'var(--accent-tint-2)' : 'transparent',
        color: active ? 'var(--accent)' : 'var(--ink-soft)',
        borderRadius: 99,
        padding: '3px 11px',
        fontSize: 11.5,
        transition: 'all .15s',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
          (e.currentTarget as HTMLElement).style.color = 'var(--ink)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
          (e.currentTarget as HTMLElement).style.color = 'var(--ink-soft)';
        }
      }}
    >
      {name}
    </button>
  );
}
