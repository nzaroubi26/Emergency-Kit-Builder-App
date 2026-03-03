import { type FC } from 'react';

interface SubkitProgressIndicatorProps {
  current: number;
  total: number;
  categoryColor: string;
}

export const SubkitProgressIndicator: FC<SubkitProgressIndicatorProps> = ({
  current,
  total,
  categoryColor,
}) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  const fillStyle: React.CSSProperties = {
    width: `${percentage}%`,
    backgroundColor: categoryColor,
    transition: 'width 220ms var(--ease-standard)',
  };

  return (
    <div className="flex flex-col gap-1.5" role="group" aria-label={`Subkit ${current} of ${total}`}>
      <span className="text-xs font-medium text-[var(--color-neutral-500)]">
        Subkit {current} of {total}
      </span>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-neutral-200)]">
        <div
          className="h-full rounded-full"
          style={fillStyle}
          role="progressbar"
          aria-label={`Subkit progress: ${current} of ${total}`}
          aria-valuenow={current}
          aria-valuemin={1}
          aria-valuemax={total}
        />
      </div>
    </div>
  );
};
