import DefaultOutputFormatter, { OutputFormatter } from '../../src/logs/output-formatter';

const LOGGER_LOCATION = 'toolbelt/test/logger/logger.test.ts';

describe('correct argument parsing', () => {
  let outputFormatter: OutputFormatter;

  beforeEach(() => {
    outputFormatter = new DefaultOutputFormatter();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should correctly format the output', () => {
    const verbosityString = 'error';

    const result = outputFormatter.format({
      location: LOGGER_LOCATION,
      metadata: {},
      parsedArgs: ['Oops!'],
      verbosityString,
    });

    expect(result).toEqual(expect.stringContaining(`${verbosityString.toUpperCase()} | ${LOGGER_LOCATION} | {} | Oops!`));
  });
});
