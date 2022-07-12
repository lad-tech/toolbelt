# Logger

A simple logger on top of the console interface

## Logger Options

```typescript
interface LoggerOptions {
  // Provide a custom logger implementation
  logger?: GenericLogger;
  // Set logger location
  location?: string;
  // Set metadata to be passed to the output formatter
  metadata?: DictOf<unknown>;
  // Set log verbosity explicitly
  verbosity?: LogVerbosity;
  // Provide a custom input parser implementation
  inputParser?: InputParser;
  // Provide a custom output formatter implementation
  outputFormatter?: OutputFormatter;
}
```

## Usage

### Logger

```typescript
import { Logs } from '@lad-tech/toolbelt';

async function main() {
  const logger = new Logs.Logger();

  try {
    logger.info('Calling `maybeFails()`');

    await maybeFails();
  } catch (err) {
    logger.error('Something bad happened', err);
  }
}
```

### InputParser

```typescript
import { Logs } from '@lad-tech/toolbelt';

class CustomInputParser implements InputParser {
  public tryToParse(inputArg: unknown): ParseResult {
    const result = parseInputArgSomehow(inputArg);

    if (result.ok) {
      return { success: true, value: result.value };
    }

    return { success: false };
  }
}

const logger = new Logs.Logger({
  inputParser: new CustomInputParser(),
});
```

### OutputFormatter

```typescript
import { Logs } from '@lad-tech/toolbelt';

class CustomOutputFormatter implements OutputFormatter {
  public format(params: FormatParameters): string {
    const nowISO = new Date().toISOString();
    const verbosityString = params.verbosityString.toUpperCase();

    return `${nowISO} | ${verbosityString} | ${params.metadata.traceId} | ${params.parsedArgs.join(' ')}`;
  }
}

const logger = new Logs.Logger({
  outputFormatter: new CustomOutputFormatter(),
});
```
