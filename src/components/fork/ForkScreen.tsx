import { type FC, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { useMCQStore } from '../../store/mcqStore';
import { useKitStore } from '../../store/kitStore';
import { ESSENTIALS_BUNDLE } from '../../data/essentialsConfig';
import { ForkCard } from './ForkCard';
import { BundlePreview } from './BundlePreview';
import { BackLink } from '../ui/BackLink';

export const ForkScreen: FC = () => {
  const navigate = useNavigate();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const handleEssentials = () => {
    const kitStore = useKitStore.getState();
    kitStore.resetKit();
    ESSENTIALS_BUNDLE.forEach((item) => {
      kitStore.selectSubkit(item.subkit);
      if (item.size === 'large') {
        kitStore.setSubkitSize(item.subkit, 'large');
      }
    });
    useMCQStore.getState().setKitPath('essentials');
    navigate('/review');
  };

  const handleCustom = () => {
    useMCQStore.getState().setKitPath('custom');
    navigate('/builder');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <BackLink to="/build/household" label="Back" />

      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mb-6 text-2xl font-bold outline-none"
        style={{ color: '#111827' }}
      >
        Choose Your Path
      </h1>

      <div className="flex flex-col gap-6 md:flex-row">
        <ForkCard
          icon={ShieldCheck}
          heading="Get The Essentials Kit"
          ctaLabel="Get The Essentials Kit"
          onCtaClick={handleEssentials}
        >
          <span
            className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-medium"
            style={{ backgroundColor: '#E8F5EE', color: '#1F4D35' }}
          >
            Recommended for most households
          </span>
          <p className="mb-4 text-sm" style={{ color: '#6B7280' }}>
            We've done the research so you don't have to. This expert-curated kit
            covers the essentials for most emergency situations.
          </p>
          <BundlePreview bundle={ESSENTIALS_BUNDLE} />
        </ForkCard>

        <ForkCard
          icon={SlidersHorizontal}
          heading="Build My Own Kit"
          ctaLabel="Start Building"
          onCtaClick={handleCustom}
        >
          <p className="mb-4 text-sm" style={{ color: '#6B7280' }}>
            You know your household best. Choose your own subkits, sizes, and items
            for a fully customized emergency kit.
          </p>
          <ul className="space-y-2 text-sm" style={{ color: '#374151' }}>
            <li className="flex items-center gap-2">
              <span style={{ color: '#22C55E' }}>&#10003;</span> Choose from 9 categories
            </li>
            <li className="flex items-center gap-2">
              <span style={{ color: '#22C55E' }}>&#10003;</span> Pick Regular or Large sizes
            </li>
            <li className="flex items-center gap-2">
              <span style={{ color: '#22C55E' }}>&#10003;</span> Select items & quantities
            </li>
          </ul>
        </ForkCard>
      </div>
    </div>
  );
};
