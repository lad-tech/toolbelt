import DefaultInputParser, { InputParser } from '../../src/logs/input-parser';

describe('correct argument parsing', () => {
  let inputParser: InputParser;

  beforeEach(() => {
    inputParser = new DefaultInputParser();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should correctly parse the input error', () => {
    const inputError = new Error('Oops!');

    const result = inputParser.tryToParse(inputError);

    expect(result).toStrictEqual({ success: true, value: inputError.message });
  });

  it('should correctly parse the input number', () => {
    const inputNumber = 42;

    const result = inputParser.tryToParse(inputNumber);

    expect(result).toStrictEqual({ success: true, value: String(inputNumber) });
  });

  it('should correctly parse the input boolean value', () => {
    const inputBoolean = true;

    const result = inputParser.tryToParse(inputBoolean);

    expect(result).toStrictEqual({ success: true, value: String(inputBoolean) });
  });

  it('should correctly parse the input string', () => {
    const inputString = '42';

    const result = inputParser.tryToParse(inputString);

    expect(result).toStrictEqual({ success: true, value: inputString });
  });

  it('should correctly parse the input JSON', () => {
    const inputJSON = { answer: 42 };

    const result = inputParser.tryToParse(inputJSON);

    expect(result).toStrictEqual({ success: true, value: JSON.stringify(inputJSON) });
  });
});

describe('incorrect argument parsing', () => {
  let inputParser: InputParser;

  beforeEach(() => {
    inputParser = new DefaultInputParser();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fail to parse an object with circular reference', () => {
    const objectWithCircularReferenceInput: { circularRef?: unknown } = {};
    objectWithCircularReferenceInput['circularRef'] = objectWithCircularReferenceInput;

    const result = inputParser.tryToParse(objectWithCircularReferenceInput);

    expect(result).toStrictEqual({ success: false });
  });

  it('should fail to parse an undefined input', () => {
    const undefinedInput = undefined;

    const result = inputParser.tryToParse(undefinedInput);

    expect(result).toStrictEqual({ success: false });
  });
});
