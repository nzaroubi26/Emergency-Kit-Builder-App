import { type FC } from 'react';
import { resolveIcon } from '../../utils/iconResolver';

interface ImageWithFallbackProps {
  src: string | null;
  alt: string;
  categoryIcon: string;
  categoryTint: string;
  categoryColor: string;
  className?: string;
}

export const ImageWithFallback: FC<ImageWithFallbackProps> = ({
  src,
  alt,
  categoryIcon,
  categoryTint,
  categoryColor,
  className = '',
}) => {
  const IconComponent = resolveIcon(categoryIcon);

  if (src) {
    return (
      <div
        className={`relative overflow-hidden ${className}`}
        style={{ backgroundColor: categoryTint }}
      >
        <img src={src} alt={alt} className="h-full w-full object-contain p-2" />
      </div>
    );
  }

  const containerStyles: React.CSSProperties = {
    backgroundColor: categoryTint,
  };

  const iconContent = IconComponent
    ? <IconComponent size={32} style={{ color: categoryColor }} aria-hidden="true" />
    : null;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={containerStyles}
      role="img"
      aria-label={alt}
    >
      {iconContent}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background: `linear-gradient(transparent, ${categoryTint})`,
        }}
        aria-hidden="true"
      />
    </div>
  );
};
