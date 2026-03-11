import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { CartSidebar } from '../../src/components/cart/CartSidebar';
import { useKitStore } from '../../src/store/kitStore';

expect.extend(matchers);

vi.mock('../../src/store/kitStore', () => ({
  useKitStore: vi.fn(),
}));

const mockToggleItem = vi.fn();
const mockSetItemQuantity = vi.fn();

const defaultMockState = {
  selectedSubkits: [],
  itemSelections: {},
  emptyContainers: [],
  toggleItem: mockToggleItem,
  setItemQuantity: mockSetItemQuantity,
};

beforeEach(() => {
  vi.mocked(useKitStore).mockReturnValue(defaultMockState as ReturnType<typeof useKitStore>);
  mockToggleItem.mockClear();
  mockSetItemQuantity.mockClear();
});

describe('CartSidebar', () => {
  it('has translate-x-full class when isOpen is false', () => {
    render(<CartSidebar isOpen={false} onClose={vi.fn()} />);
    const panel = screen.getByRole('dialog');
    expect(panel.classList.contains('translate-x-full')).toBe(true);
  });

  it('does not have translate-x-full class when isOpen is true', () => {
    render(<CartSidebar isOpen={true} onClose={vi.fn()} />);
    const panel = screen.getByRole('dialog');
    expect(panel.classList.contains('translate-x-full')).toBe(false);
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<CartSidebar isOpen={true} onClose={onClose} />);
    const backdrop = document.querySelector('[aria-hidden="true"]')!;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when X button is clicked', () => {
    const onClose = vi.fn();
    render(<CartSidebar isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close cart'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('has role="dialog" and aria-label="Cart" on panel root', () => {
    render(<CartSidebar isOpen={true} onClose={vi.fn()} />);
    const panel = screen.getByRole('dialog');
    expect(panel).toHaveAttribute('aria-label', 'Cart');
  });

  it('has no accessibility violations when open', async () => {
    const { container } = render(
      <CartSidebar isOpen={true} onClose={vi.fn()} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders empty message when no subkits are selected', () => {
    render(<CartSidebar isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/your kit is empty/i)).toBeInTheDocument();
  });

  it('renders item name when one subkit has one included item', () => {
    vi.mocked(useKitStore).mockReturnValue({
      ...defaultMockState,
      selectedSubkits: [
        { subkitId: 'power', categoryId: 'power', size: 'regular', selectionOrder: 1 },
      ],
      itemSelections: {
        'power::power-station': {
          itemId: 'power-station',
          subkitId: 'power',
          quantity: 1,
          included: true,
        },
      },
    } as ReturnType<typeof useKitStore>);
    render(<CartSidebar isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Portable Power Station')).toBeInTheDocument();
  });

  it('renders line total formatted correctly for known price and quantity', () => {
    vi.mocked(useKitStore).mockReturnValue({
      ...defaultMockState,
      selectedSubkits: [
        { subkitId: 'power', categoryId: 'power', size: 'regular', selectionOrder: 1 },
      ],
      itemSelections: {
        'power::power-station': {
          itemId: 'power-station',
          subkitId: 'power',
          quantity: 2,
          included: true,
        },
      },
    } as ReturnType<typeof useKitStore>);
    render(<CartSidebar isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('$299.98')).toBeInTheDocument();
  });

  it('renders subkit subtotal reflecting container price plus item costs', () => {
    vi.mocked(useKitStore).mockReturnValue({
      ...defaultMockState,
      selectedSubkits: [
        { subkitId: 'power', categoryId: 'power', size: 'regular', selectionOrder: 1 },
      ],
      itemSelections: {
        'power::power-station': {
          itemId: 'power-station',
          subkitId: 'power',
          quantity: 1,
          included: true,
        },
      },
    } as ReturnType<typeof useKitStore>);
    render(<CartSidebar isOpen={true} onClose={vi.fn()} />);
    const subtotalLabel = screen.getByText('Subtotal');
    const subtotalRow = subtotalLabel.closest('div')!;
    expect(subtotalRow.textContent).toContain('$189.99');
  });

  it('renders grand total equal to sum of all subkit subtotals', () => {
    vi.mocked(useKitStore).mockReturnValue({
      ...defaultMockState,
      selectedSubkits: [
        { subkitId: 'power', categoryId: 'power', size: 'regular', selectionOrder: 1 },
        { subkitId: 'lighting', categoryId: 'lighting', size: 'large', selectionOrder: 2 },
      ],
      itemSelections: {
        'power::power-station': {
          itemId: 'power-station',
          subkitId: 'power',
          quantity: 1,
          included: true,
        },
        'lighting::light-matches': {
          itemId: 'light-matches',
          subkitId: 'lighting',
          quantity: 1,
          included: true,
        },
      },
    } as ReturnType<typeof useKitStore>);
    render(<CartSidebar isOpen={true} onClose={vi.fn()} />);
    const total = (40 + 149.99 + 60 + 6.99).toFixed(2);
    expect(screen.getByText(`$${total}`)).toBeInTheDocument();
  });

  it('calls setItemQuantity with quantity - 1 when minus button is clicked', () => {
    vi.mocked(useKitStore).mockReturnValue({
      ...defaultMockState,
      selectedSubkits: [
        { subkitId: 'power', categoryId: 'power', size: 'regular', selectionOrder: 1 },
      ],
      itemSelections: {
        'power::power-station': {
          itemId: 'power-station',
          subkitId: 'power',
          quantity: 3,
          included: true,
        },
      },
    } as ReturnType<typeof useKitStore>);
    render(<CartSidebar isOpen={true} onClose={vi.fn()} />);
    fireEvent.click(screen.getByLabelText('Decrease quantity of Portable Power Station'));
    expect(mockSetItemQuantity).toHaveBeenCalledWith('power', 'power-station', 2);
  });

  it('calls toggleItem when remove X icon is clicked', () => {
    vi.mocked(useKitStore).mockReturnValue({
      ...defaultMockState,
      selectedSubkits: [
        { subkitId: 'power', categoryId: 'power', size: 'regular', selectionOrder: 1 },
      ],
      itemSelections: {
        'power::power-station': {
          itemId: 'power-station',
          subkitId: 'power',
          quantity: 1,
          included: true,
        },
      },
    } as ReturnType<typeof useKitStore>);
    render(<CartSidebar isOpen={true} onClose={vi.fn()} />);
    fireEvent.click(screen.getByLabelText('Remove Portable Power Station from cart'));
    expect(mockToggleItem).toHaveBeenCalledWith('power', 'power-station');
  });

  it('renders empty container text and no quantity controls for empty-container subkit', () => {
    vi.mocked(useKitStore).mockReturnValue({
      ...defaultMockState,
      selectedSubkits: [
        { subkitId: 'power', categoryId: 'power', size: 'regular', selectionOrder: 1 },
        { subkitId: 'lighting', categoryId: 'lighting', size: 'large', selectionOrder: 2 },
      ],
      emptyContainers: ['power'],
      itemSelections: {
        'lighting::light-matches': {
          itemId: 'light-matches',
          subkitId: 'lighting',
          quantity: 1,
          included: true,
        },
      },
    } as ReturnType<typeof useKitStore>);
    render(<CartSidebar isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/◈ Empty container/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Decrease quantity of Portable Power Station/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Increase quantity of Portable Power Station/)).not.toBeInTheDocument();
  });

  it('renders empty state when all selected subkits are empty containers with no included items', () => {
    vi.mocked(useKitStore).mockReturnValue({
      ...defaultMockState,
      selectedSubkits: [
        { subkitId: 'power', categoryId: 'power', size: 'regular', selectionOrder: 1 },
      ],
      emptyContainers: ['power'],
      itemSelections: {},
    } as ReturnType<typeof useKitStore>);
    render(<CartSidebar isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/your kit is empty/i)).toBeInTheDocument();
    expect(screen.queryByText('Subtotal')).not.toBeInTheDocument();
    expect(screen.queryByText(/◈ Empty container/)).not.toBeInTheDocument();
  });

  it('has no accessibility violations with populated cart content', async () => {
    vi.mocked(useKitStore).mockReturnValue({
      ...defaultMockState,
      selectedSubkits: [
        { subkitId: 'power', categoryId: 'power', size: 'regular', selectionOrder: 1 },
      ],
      itemSelections: {
        'power::power-station': {
          itemId: 'power-station',
          subkitId: 'power',
          quantity: 2,
          included: true,
        },
      },
    } as ReturnType<typeof useKitStore>);
    const { container } = render(
      <CartSidebar isOpen={true} onClose={vi.fn()} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
