import { type FC, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, Tornado, CloudRainWind, Thermometer } from 'lucide-react';
import { useMCQStore } from '../../store/mcqStore';
import type { EmergencyType } from '../../store/mcqStore';
import { MCQTile } from './MCQTile';
import { MCQStepIndicator } from './MCQStepIndicator';
import { BackLink } from '../ui/BackLink';
import { PrimaryButton } from '../ui/PrimaryButton';

const Q1_TILES = [
  { label: 'Flood', icon: Droplets, value: 'flood' as EmergencyType },
  { label: 'Tornado', icon: Tornado, value: 'tornado' as EmergencyType },
  { label: 'Hurricane', icon: CloudRainWind, value: 'hurricane' as EmergencyType },
  { label: 'Tropical Storm', icon: CloudRainWind, value: 'tropical-storm' as EmergencyType },
] as const;

export const MCQEmergencyTypeScreen: FC = () => {
  const navigate = useNavigate();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const storedTypes = useMCQStore((s) => s.emergencyTypes);
  const setEmergencyTypes = useMCQStore((s) => s.setEmergencyTypes);

  const [selected, setSelected] = useState<EmergencyType[]>(storedTypes);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const toggleType = (value: EmergencyType) => {
    setSelected((prev) => {
      const isSelected = prev.includes(value);
      const next = isSelected ? prev.filter((t) => t !== value) : [...prev, value];
      const label = Q1_TILES.find((t) => t.value === value)?.label ?? value;
      setAnnouncement(`${label} ${isSelected ? 'deselected' : 'selected'}`);
      return next;
    });
  };

  const handleNext = () => {
    if (selected.length === 0) return;
    setEmergencyTypes(selected);
    navigate('/build/household');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="flex items-center justify-between">
        <BackLink to="/" label="Back" />
        <MCQStepIndicator currentStep={1} totalSteps={2} />
      </div>

      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-bold outline-none"
        style={{ color: '#111827', marginBottom: '8px' }}
      >
        What type of emergency are you prepping for?
      </h1>
      <p className="mb-6 text-sm" style={{ color: '#6B7280' }}>
        Select all that apply.
      </p>

      <fieldset>
        <legend className="sr-only">What type of emergency are you prepping for?</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Q1_TILES.map((tile) => (
            <MCQTile
              key={tile.value}
              label={tile.label}
              icon={tile.icon}
              selected={selected.includes(tile.value)}
              onClick={() => toggleType(tile.value)}
            />
          ))}
          <MCQTile
            label="Extreme Heat"
            icon={Thermometer}
            selected={false}
            disabled
            disabledLabel="Coming Soon"
            onClick={() => {}}
          />
        </div>
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
