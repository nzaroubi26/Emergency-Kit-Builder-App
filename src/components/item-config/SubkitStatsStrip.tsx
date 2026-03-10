import { type FC } from 'react';

interface SubkitStatsStripProps {
  weightLbs: number;
  volumePct: number;
  categoryColor: string;
}

export const SubkitStatsStrip: FC<SubkitStatsStripProps> = ({
  weightLbs,
  volumePct,
  categoryColor,
}) => {
  const weightLabel = `~${weightLbs.toFixed(1)} lbs`;
  const volumeLabel = `${volumePct}% filled`;
  const ariaLabel = `Subkit stats — ${weightLbs.toFixed(1)} lbs, ${volumePct}% of container capacity filled`;
  const barWidth = Math.min(volumePct, 100) + '%';

  return (
    <div
      className="mb-3 flex items-center justify-between gap-4 py-2 px-3"
      style={{ backgroundColor: '#F3F4F6', borderRadius: '10px' }}
      aria-label={ariaLabel}
    >
      <span className="text-xs font-normal text-[var(--color-neutral-500)]">
        {weightLabel}
      </span>
      <div className="flex items-center gap-2">
        <div
          className="rounded-full"
          style={{ width: '120px', height: '6px', backgroundColor: '#E5E7EB' }}
          role="progressbar"
          aria-valuenow={volumePct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Container volume"
        >
          <div
            className="h-full rounded-full"
            style={{
              backgroundColor: categoryColor,
              width: barWidth,
              transition: 'width 150ms cubic-bezier(0.4,0,0.2,1)',
            }}
          />
        </div>
        <span className="text-xs font-normal text-[var(--color-neutral-500)]">
          {volumeLabel}
        </span>
      </div>
    </div>
  );
};
