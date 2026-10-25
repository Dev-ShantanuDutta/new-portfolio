import { formatYearsOfExperience } from './experience-duration.util';

describe('formatYearsOfExperience', () => {
  it('rounds down to the nearest half year', () => {
    expect(formatYearsOfExperience('2022-01-15', new Date('2026-01-15'))).toBe('4+');
    expect(formatYearsOfExperience('2022-01-15', new Date('2026-07-15'))).toBe('4.5+');
  });

  it('rounds down an in-progress month when the as-of day precedes the start day', () => {
    // 2022-01-15 -> 2026-01-10 is 3 years and 11 full months (the 12th month
    // isn't complete yet, since day 10 is before day 15) — must still round
    // down to the 4.0 half-year mark, not up to 4.0 from a naive month diff.
    expect(formatYearsOfExperience('2022-01-15', new Date('2026-01-10'))).toBe('3.5+');
  });

  it('never returns a negative duration for a start date in the future', () => {
    expect(formatYearsOfExperience('2027-01-01', new Date('2026-01-01'))).toBe('0+');
  });
});
