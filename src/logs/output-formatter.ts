import { DictOf } from '../common/types/util';
import { tryToStringifyJSON } from '../util/json';

export interface FormatParameters {
  location: string;
  metadata: DictOf<unknown>;
  parsedArgs: string[];
  verbosityString: string;
}

export interface OutputFormatter {
  format(params: FormatParameters): string;
}

export default class DefaultOutputFormatter implements OutputFormatter {
  public format({ location, metadata, parsedArgs, verbosityString }: FormatParameters): string {
    const nowISO = new Date().toISOString();

    const outputParts = [
      nowISO,
      verbosityString.toUpperCase(),
      location,
      tryToStringifyJSON(metadata),
      parsedArgs.join(' '),
    ];

    return outputParts.join(' | ');
  }
}
