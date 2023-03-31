type Locales = typeof TDate.Locales[keyof typeof TDate.Locales];

type UnitOfTime = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';

type ShortFormatOptions = {
  time?: boolean;
  date?: boolean;
} & Object;

export class TDate extends Date {
  static readonly Locales = {
    RU: 'ru-RU',
    EN: 'en-US',
    SV: 'sv-SE',
  } as const;

  constructor(date?: Date | number | string) {
    super(date ?? new Date());
  }

  static max(dates: Date[]) {
    const sorted = dates.sort((dateA, dateB) => (dateA > dateB ? -1 : 1));
    return new TDate(sorted[0]);
  }

  static min(dates: Date[]) {
    const sorted = dates.sort((dateA, dateB) => (dateA > dateB ? -1 : 1));
    return new TDate(sorted[sorted.length - 1]);
  }

  private isShortFormaOptions(options: ShortFormatOptions | Intl.DateTimeFormatOptions): options is ShortFormatOptions {
    return options.hasOwnProperty('time') || options.hasOwnProperty('date');
  }

  public unix() {
    return +this;
  }

  public format(
    locale: Locales = TDate.Locales.RU,
    options: ShortFormatOptions | Intl.DateTimeFormatOptions = { time: true, date: true },
  ) {
    if (!this.isShortFormaOptions(options)) {
      return new Intl.DateTimeFormat(locale, options).format(this);
    }

    if (options.date === false && options.time === false) {
      return '';
    }

    const dateFormat =
      options.date === false
        ? { year: undefined, month: undefined, day: undefined }
        : { year: 'numeric' as const, month: '2-digit' as const, day: '2-digit' as const };
    const timeFormat =
      options.time === false
        ? { hour: undefined, minute: undefined, second: undefined }
        : { hour: '2-digit' as const, minute: '2-digit' as const, second: '2-digit' as const };

    return new Intl.DateTimeFormat(locale, { ...dateFormat, ...timeFormat, timeZone: 'UTC' }).format(this);
  }

  public add(amount: number, unit: UnitOfTime) {
    if (unit === 'year') {
      this.setFullYear(this.getFullYear() + amount);
    }

    if (unit === 'month') {
      this.setMonth(this.getMonth() + amount);
    }

    if (unit === 'day') {
      this.setDate(this.getDate() + amount);
    }

    if (unit === 'hour') {
      this.setHours(this.getHours() + amount);
    }

    if (unit === 'minute') {
      this.setMinutes(this.getMinutes() + amount);
    }

    if (unit === 'second') {
      this.setSeconds(this.getSeconds() + amount);
    }

    if (unit === 'millisecond') {
      this.setMilliseconds(this.getMilliseconds() + amount);
    }

    return this;
  }

  public subtract(amount: number, unit: UnitOfTime) {
    return this.add(-amount, unit);
  }

  public isBefore(date: Date, shiftInMilliseconds: number = 0) {
    return +this + shiftInMilliseconds < +date;
  }

  public isAfter(date: Date, shiftInMilliseconds: number = 0) {
    return +this - shiftInMilliseconds > +date;
  }

  public isBetween(start: Date, end: Date) {
    return this > start && this < end;
  }

  public startOf(unit: UnitOfTime) {
    this.setUTCMilliseconds(0);

    if (['year', 'month', 'day', 'hour', 'minute'].includes(unit)) {
      this.setUTCSeconds(0);
    }

    if (['year', 'month', 'day', 'hour'].includes(unit)) {
      this.setUTCMinutes(0);
    }

    if (['year', 'month', 'day'].includes(unit)) {
      this.setUTCHours(0);
    }

    if (['year', 'month'].includes(unit)) {
      this.setUTCDate(1);
    }

    if (['year'].includes(unit)) {
      this.setUTCMonth(0);
    }

    return this;
  }
}
