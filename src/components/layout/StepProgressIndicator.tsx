import { type FC, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

interface StepProgressIndicatorProps {}

interface StepRenderData {
  label: string;
  number: number;
  labelClasses: string;
  badgeClasses: string;
  connectorColor: string;
  showConnector: boolean;
}

const STEPS = [
  { label: 'Build Your Kit' },
  { label: 'Configure Items' },
  { label: 'Review Kit' },
] as const;

function getActiveStep(pathname: string): number {
  if (pathname.startsWith('/summary')) return 2;
  if (pathname.startsWith('/configure')) return 1;
  return 0;
}

function buildStepData(activeStep: number): StepRenderData[] {
  return STEPS.map((step, index) => {
    const isActive = index === activeStep;
    const isCompleted = index < activeStep;

    const labelClasses = isActive
      ? 'text-sm text-[var(--color-brand-primary)] font-semibold hidden sm:inline'
      : isCompleted
        ? 'text-sm text-[var(--color-neutral-500)] hidden sm:inline'
        : 'text-sm text-[var(--color-neutral-400)] hidden sm:inline';

    const badgeClasses = isActive
      ? 'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium bg-[var(--color-brand-primary)] text-white'
      : isCompleted
        ? 'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium bg-[var(--color-brand-primary-light)] text-[var(--color-brand-primary)]'
        : 'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium bg-[var(--color-neutral-200)] text-[var(--color-neutral-500)]';

    const connectorColor = isCompleted || isActive
      ? 'var(--color-brand-primary)'
      : 'var(--color-neutral-300)';

    return {
      label: step.label,
      number: index + 1,
      labelClasses,
      badgeClasses,
      connectorColor,
      showConnector: index > 0,
    };
  });
}

export const StepProgressIndicator: FC<StepProgressIndicatorProps> = () => {
  const { pathname } = useLocation();
  const activeStep = getActiveStep(pathname);
  const steps = useMemo(() => buildStepData(activeStep), [activeStep]);

  return (
    <nav aria-label="Kit building progress" className="flex items-center gap-2">
      {steps.map((step) => (
        <div key={step.label} className="flex items-center gap-2">
          {step.showConnector && (
            <div
              className="h-px w-4"
              style={{ backgroundColor: step.connectorColor }}
            />
          )}
          <div className="flex items-center gap-1.5">
            <span className={step.badgeClasses} aria-hidden="true">
              {step.number}
            </span>
            <span className={step.labelClasses}>
              {step.label}
            </span>
          </div>
        </div>
      ))}
    </nav>
  );
};
