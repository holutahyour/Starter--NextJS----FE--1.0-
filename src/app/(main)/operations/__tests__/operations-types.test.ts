import {
  MOCK_FACILITY,
  fmtDate,
  fmtDateTime,
  fmtMoney,
  fmtNumber,
  fmtText,
  totalFuelCost,
  unallocated,
} from '../_components/types';

describe('operations helpers', () => {
  describe('unallocated', () => {
    it('subtracts allocated from total', () => {
      expect(unallocated({ id: 'a', name: 'A', total: 15, allocated: 12 })).toBe(3);
    });

    it('never returns a negative count when allocated exceeds total', () => {
      expect(unallocated({ id: 'a', name: 'A', total: 10, allocated: 12 })).toBe(0);
    });
  });

  describe('totalFuelCost', () => {
    it('multiplies litres by unit cost', () => {
      expect(totalFuelCost({ quantityLitres: 40, unitCost: 1250 })).toBe(50000);
    });
  });

  describe('formatters', () => {
    it('trims a date to its ISO day', () => {
      expect(fmtDate('2026-09-07T08:30')).toBe('2026-09-07');
      expect(fmtDate(undefined)).toBe('—');
    });

    it('renders a datetime-local value without the T separator', () => {
      expect(fmtDateTime('2026-09-07T08:30')).toBe('2026-09-07 08:30');
      expect(fmtDateTime('')).toBe('—');
    });

    it('falls back to a dash for blank text and missing numbers', () => {
      expect(fmtText('  ')).toBe('—');
      expect(fmtText('Cassava')).toBe('Cassava');
      expect(fmtNumber(undefined)).toBe('—');
      expect(fmtNumber(0)).toBe('0');
      expect(fmtMoney(undefined)).toBe('—');
    });
  });

  describe('mock facility data', () => {
    it('keeps the cohort breakdown consistent with the greenhouse total', () => {
      const sum = MOCK_FACILITY.cohorts.reduce((s, c) => s + c.count, 0);
      expect(sum).toBe(MOCK_FACILITY.stats.greenhouses);
    });

    it('keeps the staff block totals consistent with the accommodation total', () => {
      const sum = MOCK_FACILITY.staffBlocks.reduce((s, b) => s + b.total, 0);
      expect(sum).toBe(MOCK_FACILITY.stats.staffAccommodation);
    });
  });
});
