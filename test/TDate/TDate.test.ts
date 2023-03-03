import { TDate } from '../../src';

describe('TDate', () => {
  beforeEach(jest.clearAllMocks);

  const date = 1677855689000; // 03.03.2023, 15:01:29

  jest.useFakeTimers();
  jest.setSystemTime(new Date(date));

  test('static method max. Return the maximum TDate of multiple dates', () => {
    const dateMax = new Date('2090-01-01');
    const params = [new Date('2023-01-01'), new Date('2020-01-01'), dateMax];

    expect(TDate.max(params)).toEqual(dateMax);
  });
  test('static method max. Returns the minimum TDate of multiple dates', () => {
    const dateMin = new Date('1890-01-01');
    const params = [new Date('2023-01-01'), new Date('2020-01-01'), dateMin];

    expect(TDate.min(params)).toEqual(dateMin);
  });
  test('unix method. Returns timestamp in milliseconds', () => {
    expect(new TDate().unix()).toBe(date);
  });

  describe('format', () => {
    test('you can get the date string for the RU locale', () => {
      expect(new TDate().format()).toBe('03.03.2023, 15:01:29');
    });
    test('you can get the date string for the EN locale', () => {
      expect(new TDate().format(TDate.Locales.EN)).toBe('03/03/2023, 03:01:29 PM');
    });
    test('you can get the date string for the SV locale', () => {
      expect(new TDate().format(TDate.Locales.SV)).toBe('2023-03-03 15:01:29');
    });
    test('you can only get the date string', () => {
      expect(new TDate().format(TDate.Locales.RU, { time: false })).toBe('03.03.2023');
    });
    test('you can only get the time string', () => {
      expect(new TDate().format(TDate.Locales.RU, { date: false })).toBe('15:01:29');
    });
    test('if you do not display either date or time, an empty string will be returned.', () => {
      expect(new TDate().format(TDate.Locales.RU, { date: false, time: false })).toBe('');
    });
    test('сan be customized with advanced options Intl.DateTimeFormatOptions and output only the year string', () => {
      expect(new TDate().format(TDate.Locales.RU, { year: 'numeric' })).toBe('2023');
    });
  });

  describe('add', () => {
    test('you can add a year to the TDate', () => {
      expect(new TDate().add(1, 'year').format()).toBe('03.03.2024, 15:01:29');
    });
    test('you can add a month to the TDate', () => {
      expect(new TDate().add(1, 'month').format()).toBe('03.04.2023, 15:01:29');
    });
    test('you can add a day to the TDate', () => {
      expect(new TDate().add(1, 'day').format()).toBe('04.03.2023, 15:01:29');
    });
    test('you can add a hour to the TDate', () => {
      expect(new TDate().add(1, 'hour').format()).toBe('03.03.2023, 16:01:29');
    });
    test('you can add a minute to the TDate', () => {
      expect(new TDate().add(1, 'minute').format()).toBe('03.03.2023, 15:02:29');
    });
    test('you can add a second to the TDate', () => {
      expect(new TDate().add(1, 'second').format()).toBe('03.03.2023, 15:01:30');
    });
    test('you can add a millisecond to the TDate', () => {
      expect(new TDate().add(1, 'millisecond').format()).toBe('03.03.2023, 15:01:29');
    });
  });

  describe('subtract', () => {
    test('you can subtract a year from a TDate', () => {
      expect(new TDate().subtract(1, 'year').format()).toBe('03.03.2022, 15:01:29');
    });
    test('you can subtract a month from a TDate', () => {
      expect(new TDate().subtract(1, 'month').format()).toBe('03.02.2023, 15:01:29');
    });
    test('you can subtract a day from a TDate', () => {
      expect(new TDate().subtract(1, 'day').format()).toBe('02.03.2023, 15:01:29');
    });
    test('you can subtract a hour from a TDate', () => {
      expect(new TDate().subtract(1, 'hour').format()).toBe('03.03.2023, 14:01:29');
    });
    test('you can subtract a minute from a TDate', () => {
      expect(new TDate().subtract(1, 'minute').format()).toBe('03.03.2023, 15:00:29');
    });
    test('you can second a minute from a TDate', () => {
      expect(new TDate().subtract(1, 'second').format()).toBe('03.03.2023, 15:01:28');
    });
    test('you can second a millisecond from a TDate', () => {
      expect(new TDate().subtract(1, 'millisecond').format()).toBe('03.03.2023, 15:01:28');
    });
  });

  describe('isBefore', () => {
    test('Если TDate меньше чем целевая дата возврашается true', () => {
      expect(new TDate().isBefore(new Date('2090-01-01'))).toBeTruthy();
    });
    test('Если TDate больше чем целевая дата возврашается false', () => {
      expect(new TDate().isBefore(new Date('1890-01-01'))).toBeFalsy();
    });
  });

  describe('isAfter', () => {
    test('if TDate is less than the target date, returned false.', () => {
      expect(new TDate().isAfter(new Date('2090-01-01'))).toBeFalsy();
    });
    test('if TDate is greater than the target date, returned true.', () => {
      expect(new TDate().isAfter(new Date('1890-01-01'))).toBeTruthy();
    });
  });

  describe('isBetween', () => {
    test('returns true if TDate is between two dates', () => {
      expect(new TDate().isBetween(new Date('2023-03-03'), new Date('2023-03-03 20:00:00'))).toBeTruthy();
    });
    test('returns false if TDate is not between two dates', () => {
      expect(new TDate().isBetween(new Date('2023-03-01'), new Date('2023-03-01 20:00:00'))).toBeFalsy();
    });
  });

  describe('startOf', () => {
    test('you can reset the TDate to the beginning of the year', () => {
      expect(new TDate().startOf('year').format()).toBe('01.01.2023, 00:00:00');
    });
    test('you can reset the TDate to the beginning of the month', () => {
      expect(new TDate().startOf('month').format()).toBe('01.03.2023, 00:00:00');
    });
    test('you can reset the TDate to the beginning of the day', () => {
      expect(new TDate().startOf('day').format()).toBe('03.03.2023, 00:00:00');
    });
    test('you can reset the TDate to the beginning of the hour', () => {
      expect(new TDate().startOf('hour').format()).toBe('03.03.2023, 15:00:00');
    });
    test('you can reset the TDate to the beginning of the minute', () => {
      expect(new TDate().startOf('minute').format()).toBe('03.03.2023, 15:01:00');
    });
    test('you can reset the TDate to the beginning of the second', () => {
      expect(new TDate().startOf('second').format()).toBe('03.03.2023, 15:01:29');
    });
  });
});
