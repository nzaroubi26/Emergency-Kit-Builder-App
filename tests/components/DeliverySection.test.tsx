import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DeliverySection } from '../../src/components/review/DeliverySection';

describe('DeliverySection', () => {
  it('renders two radio options', () => {
    render(<DeliverySection />);
    expect(screen.getByLabelText('Deliver to my address')).toBeInTheDocument();
    expect(screen.getByLabelText('Pick up at a location')).toBeInTheDocument();
  });

  it('shows address form by default (deliver selected)', () => {
    render(<DeliverySection />);
    expect(screen.getByLabelText('Deliver to my address')).toBeChecked();
    expect(screen.getByTestId('address-form')).toBeInTheDocument();
    expect(screen.getByLabelText('Street')).toBeInTheDocument();
    expect(screen.getByLabelText('City')).toBeInTheDocument();
    expect(screen.getByLabelText('State')).toBeInTheDocument();
    expect(screen.getByLabelText('ZIP')).toBeInTheDocument();
  });

  it('switches to pickup dropdown when pickup selected', () => {
    render(<DeliverySection />);
    fireEvent.click(screen.getByLabelText('Pick up at a location'));

    expect(screen.getByLabelText('Pick up at a location')).toBeChecked();
    expect(screen.getByTestId('pickup-form')).toBeInTheDocument();
    expect(screen.getByLabelText('Select location')).toBeInTheDocument();
    expect(screen.queryByTestId('address-form')).not.toBeInTheDocument();
  });

  it('shows mock pickup locations in dropdown', () => {
    render(<DeliverySection />);
    fireEvent.click(screen.getByLabelText('Pick up at a location'));

    const select = screen.getByLabelText('Select location');
    const options = select.querySelectorAll('option');
    expect(options).toHaveLength(3);
    expect(options[0].textContent).toBe('Downtown Hub — 123 Main St');
    expect(options[1].textContent).toBe('Eastside Center — 456 Oak Ave');
    expect(options[2].textContent).toBe('West End Depot — 789 Pine Rd');
  });

  it('switches back to address form when deliver reselected', () => {
    render(<DeliverySection />);
    fireEvent.click(screen.getByLabelText('Pick up at a location'));
    expect(screen.getByTestId('pickup-form')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Deliver to my address'));
    expect(screen.getByTestId('address-form')).toBeInTheDocument();
    expect(screen.queryByTestId('pickup-form')).not.toBeInTheDocument();
  });
});
