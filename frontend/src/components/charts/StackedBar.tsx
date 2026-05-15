interface StackedBarSegment {
  label: string;
  value: number | null;
  colorClass: string;
}

interface StackedBarProps {
  segments: StackedBarSegment[];
}

export function StackedBar({ segments }: StackedBarProps) {
  const hasValue = segments.some((s) => s.value !== null);

  if (!hasValue) {
    return <p className="text-2xl text-muted-foreground">—</p>;
  }

  return (
    <>
      <div className="flex h-6 rounded-lg overflow-hidden gap-0.5 mb-4">
        {segments.map((seg) =>
          seg.value !== null ? (
            <div key={seg.label} style={{ width: `${seg.value}%` }} className={seg.colorClass} />
          ) : null,
        )}
      </div>

      <div className="flex flex-wrap gap-6 text-sm">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-sm shrink-0 ${seg.colorClass}`} />
            <span className="text-muted-foreground">{seg.label}</span>
            <span className="font-medium">{seg.value !== null ? `${seg.value}%` : "—"}</span>
          </div>
        ))}
      </div>
    </>
  );
}
