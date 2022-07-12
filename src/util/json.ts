import { Maybe } from '../common/types/util';

export function tryToStringifyJSON(input: unknown): Maybe<string> {
  try {
    return JSON.stringify(input);
  } catch {
    return null;
  }
}
