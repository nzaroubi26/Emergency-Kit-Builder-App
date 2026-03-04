import { type FC } from 'react';

interface StarRatingProps {
  rating: number;
  reviewCount: number;
}

const STAR_CHAR = '★★★★★';

export const StarRating: FC<StarRatingProps> = ({ rating, reviewCount }) => {
  const percentage = (rating / 5) * 100;

  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={`Rated ${rating.toFixed(1)} out of 5 based on ${reviewCount} reviews`}
      role="img"
    >
      <span className="relative inline-block text-sm leading-none">
        <span
          className="text-[var(--color-neutral-300)]"
          aria-hidden="true"
        >
          {STAR_CHAR}
        </span>
        <span
          className="absolute inset-0 overflow-hidden text-[var(--color-brand-accent)]"
          style={{ width: `${percentage}%` }}
          aria-hidden="true"
        >
          {STAR_CHAR}
        </span>
      </span>
      <span className="text-xs text-[var(--color-neutral-500)]">
        {rating.toFixed(1)} ({reviewCount.toLocaleString()} reviews)
      </span>
    </div>
  );
};
