interface PanelProps {
  title?: string;
  children: React.ReactNode;
}

export default function Panel({ title, children }: PanelProps) {
  return (
    <section style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 18px' }}>
      {title && (
        <h2 className="meta" style={{ margin: '0 0 13px', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--muted)', fontSize: 11 }}>
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
