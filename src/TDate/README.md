# TDate

TDate is a simple wrapper around the native Date class that provides an additional API. You can create a new TDate in the same way as a native Date object.

```js
const tdate = new TDate();
```

## Additional API

### Static method **max**

The method selects the maximum date from the passed array and returns TDate

```js
const result = TDate.max([new Date('2023-01-01'), new Date('2020-01-01'), new Date('2090-01-01')]);
// result will be the TDate 2090-01-01
```

### Static method **min**

The method selects the minimum date from the passed array and returns TDate

```js
const result = TDate.min([new Date('2023-01-01'), new Date('2020-01-01'), new Date('2090-01-01')]);
// result will be the TDate 2020-01-01
```

### Method **unix**

Returns timestamp in milliseconds

```js
const result = new TDate().unix(); // result will be many numbers :)
```

### Method **format**

The method returns a formatted date string. You can pass the locale and an object with options to the method. Options can be short or extended

1. Short

```js
{
  date: boolean; // Adds a date to the output. Default value true.
  time: boolean; // Adds a time to the output. Default value true.
}
```

2. Extended

An extended settings object is a settings object Intl.DateTimeFormatOptions. Example.

```js
{
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZone: 'UTC'
}
```

Supported locales - RU, EN, SV

### Method **add**

The method increments the TDate by the passed value

```js
new TDate().add(1, 'hour'); // added 1 hour and returned TDate
```

### Method **subtract**

The method decrements the TDate by the passed value

```js
new TDate().subtract(1, 'hour'); // subtracted 1 hour and returned TDate
```

### Method **isBefore**

Method to check if the TDate is in the past

```js
new TDate().isBefore(new Date('2090-01-01')); // true
new TDate().isBefore(new Date('1890-01-01')); // false
```

### Method **isAfter**

Method to check if the TDate is in the future

```js
new TDate().isAfter(new Date('2090-01-01')); // false
new TDate().isAfter(new Date('1890-01-01')); // true
```

### Method **isBetween**

Method to check if a TDate is between dates

```js
new TDate().isBetween(new Date('1890-01-01'), new Date('2090-01-01')); // true
new TDate().isBetween(new Date('2090-01-01'), new Date('2090-01-01')); // false
```

### Method **startOf**

Mutates the original TDate by setting it to the start of a unit of time.

```js
new TDate().startOf('year'); // If TDate was 2023-03-03 12:12:12 then TDae will be 2023-01-01 00:00:00
```
