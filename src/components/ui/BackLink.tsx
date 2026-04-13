import { type FC } from 'react';
import { Link } from 'react-router-dom';

interface BackLinkProps {
  to: string;
  label?: string;
}

export const BackLink: FC<BackLinkProps> = ({ to, label = 'Back' }) => {
  return (
    <Link
      to={to}
      className="mb-6 inline-flex text-sm font-medium transition-colors"
      style={{ color: '#6B7280' }}
      onMouseEnter={(e) => { e.currentTarget.style.color = '#374151'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = '#6B7280'; }}
    >
      ← {label}
    </Link>
  );
};
