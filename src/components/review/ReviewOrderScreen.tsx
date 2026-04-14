import { type FC, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMCQStore } from '../../store/mcqStore';
import { KitSummaryCard } from './KitSummaryCard';
import { DeliverySection } from './DeliverySection';
import { BackLink } from '../ui/BackLink';
import { PrimaryButton } from '../ui/PrimaryButton';

export const ReviewOrderScreen: FC = () => {
  const navigate = useNavigate();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const kitPath = useMCQStore((s) => s.kitPath);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const handlePlaceOrder = () => {
    navigate('/confirmation');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <BackLink
        to={kitPath === 'custom' ? '/summary' : '/choose'}
        label={kitPath === 'custom' ? 'Back to Kit Summary' : 'Back'}
      />

      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mb-6 text-2xl font-bold outline-none"
        style={{ color: '#111827' }}
      >
        Review & Order
      </h1>

      <div className="space-y-6">
        <KitSummaryCard path={kitPath === 'essentials' ? 'essentials' : 'custom'} />
        <DeliverySection />
      </div>

      <div className="mt-8">
        <PrimaryButton onClick={handlePlaceOrder} className="w-full">
          Place Order
        </PrimaryButton>
      </div>
    </div>
  );
};
