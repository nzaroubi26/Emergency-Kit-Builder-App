import { type FC, useState } from 'react';

type DeliveryMethod = 'deliver' | 'pickup';

const PICKUP_LOCATIONS = [
  'Downtown Hub — 123 Main St',
  'Eastside Center — 456 Oak Ave',
  'West End Depot — 789 Pine Rd',
];

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
];

export const DeliverySection: FC = () => {
  const [method, setMethod] = useState<DeliveryMethod>('deliver');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [pickupLocation, setPickupLocation] = useState(PICKUP_LOCATIONS[0]);

  const inputClass = 'w-full rounded-[var(--radius-md)] border px-3 py-2 text-sm';

  return (
    <div
      className="rounded-2xl p-6"
      style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}
    >
      <h3 className="mb-4 text-lg font-semibold" style={{ color: '#111827' }}>
        Delivery Options
      </h3>

      <fieldset>
        <legend className="sr-only">Choose delivery method</legend>
        <div className="space-y-3">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="radio"
              name="delivery-method"
              value="deliver"
              checked={method === 'deliver'}
              onChange={() => setMethod('deliver')}
              className="h-4 w-4"
            />
            <span className="text-sm font-medium" style={{ color: '#374151' }}>
              Deliver to my address
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="radio"
              name="delivery-method"
              value="pickup"
              checked={method === 'pickup'}
              onChange={() => setMethod('pickup')}
              className="h-4 w-4"
            />
            <span className="text-sm font-medium" style={{ color: '#374151' }}>
              Pick up at a location
            </span>
          </label>
        </div>
      </fieldset>

      {method === 'deliver' && (
        <div className="mt-4 space-y-3" data-testid="address-form">
          <div>
            <label htmlFor="street" className="mb-1 block text-sm" style={{ color: '#374151' }}>
              Street
            </label>
            <input
              id="street"
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className={inputClass}
              style={{ borderColor: '#D1D5DB' }}
            />
          </div>
          <div>
            <label htmlFor="city" className="mb-1 block text-sm" style={{ color: '#374151' }}>
              City
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={inputClass}
              style={{ borderColor: '#D1D5DB' }}
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="state" className="mb-1 block text-sm" style={{ color: '#374151' }}>
                State
              </label>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              >
                <option value="">Select state</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="zip" className="mb-1 block text-sm" style={{ color: '#374151' }}>
                ZIP
              </label>
              <input
                id="zip"
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
          </div>
        </div>
      )}

      {method === 'pickup' && (
        <div className="mt-4" data-testid="pickup-form">
          <label htmlFor="pickup-location" className="mb-1 block text-sm" style={{ color: '#374151' }}>
            Select location
          </label>
          <select
            id="pickup-location"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            className={inputClass}
            style={{ borderColor: '#D1D5DB' }}
          >
            {PICKUP_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
