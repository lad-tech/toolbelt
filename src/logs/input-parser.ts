import { tryToStringifyJSON } from '../util/json';
import { isBoolean, isNumber, isString } from '../util/predicates';

export type SuccessParseResult = { success: boolean; value: string };
export type FailParseResult = { success: false };
export type ParseResult = SuccessParseResult | FailParseResult;

export interface InputParser {
  tryToParse(input: unknown): ParseResult;
}

export default class DefaultInputParser implements InputParser {
  public tryToParse(input: unknown): ParseResult {
    if (input instanceof Error) {
      return this.success(input.message);
    }

    if (isNumber(input) || isBoolean(input)) {
      return this.success(input.toString());
    }

    if (isString(input)) {
      return this.success(input);
    }

    const result = tryToStringifyJSON(input);

    if (result) {
      return this.success(result);
    }

    return this.fail();
  }

  private success(value: string): SuccessParseResult {
    return { success: true, value };
  }

  private fail(): FailParseResult {
    return { success: false };
  }
}
