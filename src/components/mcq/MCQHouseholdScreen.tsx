import { type FC, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Baby, HeartHandshake, Accessibility, PawPrint } from 'lucide-react';
import { useMCQStore } from '../../store/mcqStore';
import type { HouseholdOption } from '../../store/mcqStore';
import { MCQTile } from './MCQTile';
import { MCQNotaTile } from './MCQNotaTile';
import { MCQStepIndicator } from './MCQStepIndicator';
import { BackLink } from '../ui/BackLink';
import { PrimaryButton } from '../ui/PrimaryButton';

const Q2_TILES = [
  { label: 'Kids', icon: Baby, value: 'kids' as HouseholdOption },
  { label: 'Older Adults', icon: HeartHandshake, value: 'older-adults' as HouseholdOption },
  { label: 'Person with a Disability', icon: Accessibility, value: 'disability' as HouseholdOption },
  { label: 'Pets', icon: PawPrint, value: 'pets' as HouseholdOption },
] as const;

export const MCQHouseholdScreen: FC = () => {
  const navigate = useNavigate();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const storedHousehold = useMCQStore((s) => s.householdComposition);
  const setHouseholdComposition = useMCQStore((s) => s.setHouseholdComposition);

  const [selected, setSelected] = useState<HouseholdOption[]>(storedHousehold);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const isNotaSelected = selected.includes('none');

  const toggleOption = (value: HouseholdOption) => {
    setSelected((prev) => {
      if (prev.includes(value)) {
        const next = prev.filter((o) => o !== value);
        const label = Q2_TILES.find((t) => t.value === value)?.label ?? value;
        setAnnouncement(`${label} deselected`);
        return next;
      }
      // Selecting a regular option clears NOTA
      const withoutNota = prev.filter((o) => o !== 'none');
      const label = Q2_TILES.find((t) => t.value === value)?.label ?? value;
      setAnnouncement(`${label} selected`);
      return [...withoutNota, value];
    });
  };

  const toggleNota = () => {
    if (isNotaSelected) {
      setSelected([]);
      setAnnouncement('None of the Above deselected');
    } else {
      setSelected(['none']);
      setAnnouncement('None of the Above selected, all other options deselected');
    }
  };

  const handleNext = () => {
    if (selected.length === 0) return;
    setHouseholdComposition(selected);
    navigate('/choose');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="flex items-center justify-between">
        <BackLink to="/build" label="Back" />
        <MCQStepIndicator currentStep={2} totalSteps={2} />
      </div>

      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-bold outline-none"
        style={{ color: '#111827', marginBottom: '8px' }}
      >
        Who will you be caring for?
      </h1>
      <p className="mb-6 text-sm" style={{ color: '#6B7280' }}>
        Select all that apply.
      </p>

      <fieldset>
        <legend className="sr-only">Who will you be caring for?</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Q2_TILES.map((tile) => (
            <MCQTile
              key={tile.value}
              label={tile.label}
              icon={tile.icon}
              selected={selected.includes(tile.value)}
              onClick={() => toggleOption(tile.value)}
            />
          ))}
        </div>
        <MCQNotaTile selected={isNotaSelected} onClick={toggleNota} />
      </fieldset>

      <div className="mt-8">
        <PrimaryButton
          onClick={handleNext}
          ariaDisabled={selected.length === 0}
          className="w-full"
        >
          Next
        </PrimaryButton>
      </div>

      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </div>
  );
};
