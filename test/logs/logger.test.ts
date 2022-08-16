import Logger, { GenericLogger, LogVerbosity, LOGGER_METHODS_BY_VERBOSITY } from '../../src/logs/logger';

const LOGGER_LOCATION = 'toolbelt/test/logger/logger.test.ts';
const LOG_VERBOSITY = [
  LogVerbosity.TRACE,
  LogVerbosity.DEBUG,
  LogVerbosity.INFO,
  LogVerbosity.WARN,
  LogVerbosity.ERROR,
] as const;
const DEFAULT_LOG_VERBOSITY = LogVerbosity.ERROR;

function makeLoggerImplStub(): GenericLogger {
  return {
    trace: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
}

describe('using logging methods', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger({
      location: LOGGER_LOCATION,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const err = new Error('Oops!');
  const loggerImplStub = makeLoggerImplStub();

  it.each(LOG_VERBOSITY)('should correctly log the message', (verbosity) => {
    const verbosityString = LOGGER_METHODS_BY_VERBOSITY[verbosity];
    const otherMethods = new Set([
      LogVerbosity.TRACE,
      LogVerbosity.DEBUG,
      LogVerbosity.INFO,
      LogVerbosity.WARN,
      LogVerbosity.ERROR,
    ]);

    otherMethods.delete(verbosity);

    logger.setLogger(loggerImplStub).setVerbosity(verbosity);
    logger[verbosityString]('Something bad happened', err);

    expect(loggerImplStub[verbosityString]).toHaveBeenCalledTimes(1);
    expect(loggerImplStub[verbosityString]).toHaveBeenCalledWith(
      expect.stringContaining(`${verbosityString.toUpperCase()} | ${LOGGER_LOCATION} | {} | Something bad happened Oops!`),
    );

    for (const otherMethod of otherMethods) {
      const method = LOGGER_METHODS_BY_VERBOSITY[otherMethod];

      expect(loggerImplStub[method]).not.toHaveBeenCalled();
    }
  });

  it.each(LOG_VERBOSITY)('should use the correct logging level', (verbosity) => {
    logger.setLogger(loggerImplStub).setVerbosity(verbosity);

    for (const otherMethod of LOG_VERBOSITY) {
      const method = LOGGER_METHODS_BY_VERBOSITY[otherMethod];

      logger[method]('Something bad happened', err);

      if (otherMethod >= verbosity) {
        expect(loggerImplStub[method]).toHaveBeenCalledTimes(1);
        expect(loggerImplStub[method]).toHaveBeenCalledWith(expect.stringContaining(method.toUpperCase()));
      } else {
        expect(loggerImplStub[method]).not.toHaveBeenCalled();
      }
    }
  });
});

describe('using setter methods', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each(LOG_VERBOSITY)('should correctly set verbosity via method call', (verbosity) => {
    logger.setVerbosity(verbosity);

    expect(logger.getVerbosity()).toBe(verbosity);
  });

  it('should correctly set logger implementation via method call', () => {
    const loggerImplStub = makeLoggerImplStub();

    logger.setLogger(loggerImplStub);

    expect(logger.getLogger()).toBe(loggerImplStub);
  });

  it('should correctly set location via method call', () => {
    logger.setLocation(LOGGER_LOCATION);

    expect(logger.getLocation()).toBe(LOGGER_LOCATION);
  });

  it('should correctly set metadata via method call', () => {
    const metadata = { answer: 42 };

    logger.setMetadata(metadata);

    expect(logger.getMetadata()).toBe(metadata);
  });
});

describe('verbosity', () => {
  afterEach(() => {
    delete process.env.LOG_VERBOSITY;
    delete process.env.LOG_LEVEL;

    jest.resetAllMocks();
  });

  it.each(LOG_VERBOSITY)(
    'should correctly set verbosity from the `LOG_VERBOSITY` environment variable',
    (verbosity) => {
      process.env.LOG_VERBOSITY = LOGGER_METHODS_BY_VERBOSITY[verbosity];

      const logger = new Logger();

      expect(logger.getVerbosity()).toBe(verbosity);
    },
  );

  it.each(LOG_VERBOSITY)('should correctly set verbosity from the `LOG_LEVEL` environment variable', (verbosity) => {
    process.env.LOG_LEVEL = LOGGER_METHODS_BY_VERBOSITY[verbosity];

    const logger = new Logger();

    expect(logger.getVerbosity()).toBe(verbosity);
  });

  it('should set verbosity from the options', () => {
    const logger = new Logger({ verbosity: LogVerbosity.TRACE });

    expect(logger.getVerbosity()).toBe(LogVerbosity.TRACE);
  });

  it('should set default verbosity if not specified explicitly', () => {
    const logger = new Logger();

    expect(logger.getVerbosity()).toBe(DEFAULT_LOG_VERBOSITY);
  });
});
