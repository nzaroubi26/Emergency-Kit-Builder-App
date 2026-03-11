import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initiateCheckout } from '../../src/services/checkoutService';
import type { SubkitSelection, ItemSelection } from '../../src/types';

vi.mock('../../src/tokens/env', () => ({
  ENV: { purchaseUrl: 'https://api.example.com/checkout' },
}));

const mockSubkits: SubkitSelection[] = [
  { subkitId: 'sub-1', categoryId: 'power', size: 'regular', selectionOrder: 0 },
  { subkitId: 'sub-2', categoryId: 'lighting', size: 'large', selectionOrder: 1 },
];

const mockItemSelections: Record<string, ItemSelection> = {
  'item-a': { itemId: 'item-a', subkitId: 'sub-1', quantity: 2, included: true },
  'item-b': { itemId: 'item-b', subkitId: 'sub-1', quantity: 1, included: true },
  'item-c': { itemId: 'item-c', subkitId: 'sub-2', quantity: 3, included: true },
};

describe('initiateCheckout', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('test-uuid-1234' as `${string}-${string}-${string}-${string}-${string}`);
  });

  it('builds correct payload and returns redirectUrl on success', async () => {
    const mockResponse = { redirectUrl: 'https://store.example.com/order/123' };
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(mockResponse), { status: 200 })
    );

    const result = await initiateCheckout(mockSubkits, mockItemSelections, []);

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kitId: 'test-uuid-1234',
        subkits: [
          {
            subkitId: 'sub-1',
            categoryId: 'power',
            size: 'regular',
            selectionOrder: 0,
            emptyContainer: false,
            items: [
              { itemId: 'item-a', quantity: 2 },
              { itemId: 'item-b', quantity: 1 },
            ],
          },
          {
            subkitId: 'sub-2',
            categoryId: 'lighting',
            size: 'large',
            selectionOrder: 1,
            emptyContainer: false,
            items: [
              { itemId: 'item-c', quantity: 3 },
            ],
          },
        ],
      }),
    });

    expect(result).toEqual({ success: true, redirectUrl: 'https://store.example.com/order/123' });
  });

  it('marks subkit as empty container when in emptyContainers list', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ redirectUrl: 'https://example.com' }), { status: 200 })
    );

    await initiateCheckout(mockSubkits, mockItemSelections, ['sub-2']);

    const call = vi.mocked(fetch).mock.calls[0];
    const body = JSON.parse(call[1]!.body as string);
    expect(body.subkits[0].emptyContainer).toBe(false);
    expect(body.subkits[1].emptyContainer).toBe(true);
  });

  it('returns error message on non-ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('Server Error', { status: 500 })
    );

    const result = await initiateCheckout(mockSubkits, mockItemSelections, []);

    expect(result).toEqual({ success: false, errorMessage: 'Something went wrong. Please try again.' });
  });

  it('returns connection error on fetch failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));

    const result = await initiateCheckout(mockSubkits, mockItemSelections, []);

    expect(result).toEqual({
      success: false,
      errorMessage: 'Unable to connect. Please check your connection and try again.',
    });
  });

  it('filters items to correct subkit', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ redirectUrl: 'https://example.com' }), { status: 200 })
    );

    await initiateCheckout(mockSubkits, mockItemSelections, []);

    const call = vi.mocked(fetch).mock.calls[0];
    const body = JSON.parse(call[1]!.body as string);
    expect(body.subkits[0].items).toHaveLength(2);
    expect(body.subkits[1].items).toHaveLength(1);
  });

  it('handles empty item selections', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ redirectUrl: 'https://example.com' }), { status: 200 })
    );

    await initiateCheckout(mockSubkits, {}, []);

    const call = vi.mocked(fetch).mock.calls[0];
    const body = JSON.parse(call[1]!.body as string);
    expect(body.subkits[0].items).toEqual([]);
    expect(body.subkits[1].items).toEqual([]);
  });
});
