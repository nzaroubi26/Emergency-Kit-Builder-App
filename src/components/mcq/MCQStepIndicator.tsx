import { type FC } from 'react';

interface MCQStepIndicatorProps {
  currentStep: 1 | 2;
  totalSteps: number;
}

export const MCQStepIndicator: FC<MCQStepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <span className="text-xs" style={{ color: '#9CA3AF' }}>
      Step {currentStep} of {totalSteps}
    </span>
  );
};
