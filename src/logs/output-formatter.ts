import { DictOf } from '../common/types/util';

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
  public format(params: FormatParameters): string {
    const nowISO = new Date().toISOString();

    return `${nowISO} | ${params.verbosityString.toUpperCase()} | ${params.location} | ${params.parsedArgs.join(' ')}`;
  }
}
