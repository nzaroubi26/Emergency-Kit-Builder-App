import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import { SubkitSelectionScreen } from '../../src/components/subkit-selection/SubkitSelectionScreen';
import { useKitStore } from '../../src/store/kitStore';
import { useMCQStore } from '../../src/store/mcqStore';

const renderScreen = () =>
  render(
    <MemoryRouter>
      <SubkitSelectionScreen />
    </MemoryRouter>
  );

describe('SubkitSelectionScreen layout', () => {
  beforeEach(() => {
    useKitStore.setState({
      selectedSubkits: [],
      itemSelections: {},
      emptyContainers: [],
      currentConfigIndex: 0,
    });
    useMCQStore.setState({
      emergencyTypes: [],
      householdComposition: [],
      kitPath: null,
    });
  });

  it('renders outer container with max-w-[1120px] and horizontal padding', () => {
    const { container } = renderScreen();
    const outer = container.firstElementChild as HTMLElement;
    expect(outer.className).toContain('max-w-[1120px]');
    expect(outer.className).toContain('mx-auto');
    expect(outer.className).toContain('px-6');
  });

  it('renders flex layout container with lg:flex-row and lg:gap-8', () => {
    const { container } = renderScreen();
    const flexContainer = container.querySelector('.flex.flex-col.lg\\:flex-row');
    expect(flexContainer).not.toBeNull();
    expect(flexContainer!.className).toContain('lg:gap-8');
    expect(flexContainer!.className).toContain('gap-6');
  });

  it('renders left column with lg:w-[40%] and lg:sticky', () => {
    const { container } = renderScreen();
    const leftCol = container.querySelector('.lg\\:w-\\[40\\%\\]');
    expect(leftCol).not.toBeNull();
    expect(leftCol!.className).toContain('lg:sticky');
    expect(leftCol!.className).toContain('lg:top-6');
    expect(leftCol!.className).toContain('lg:self-start');
  });

  it('renders right column with lg:w-[60%]', () => {
    const { container } = renderScreen();
    const rightCol = container.querySelector('.lg\\:w-\\[60\\%\\]');
    expect(rightCol).not.toBeNull();
  });

  it('renders card grid with grid-cols-2 for mobile and lg:grid-cols-1 for desktop', () => {
    const { container } = renderScreen();
    const grid = container.querySelector('.grid.grid-cols-2');
    expect(grid).not.toBeNull();
    expect(grid!.className).toContain('lg:grid-cols-1');
    expect(grid!.className).toContain('gap-3');
  });

  it('renders page heading "Build Your Emergency Kit"', () => {
    renderScreen();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Build Your Emergency Kit');
  });

  it('renders "Configure Items" CTA in the left column', () => {
    const { container } = renderScreen();
    const leftCol = container.querySelector('.lg\\:w-\\[40\\%\\]');
    expect(leftCol).not.toBeNull();
    const cta = leftCol!.querySelector('button');
    expect(cta).not.toBeNull();
    expect(cta!.textContent).toContain('Configure Items');
  });
});
