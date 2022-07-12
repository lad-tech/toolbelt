import { Maybe, DictOf, ReadonlyArrayOf } from '../common/types/util';

import DefaultInputParser, { InputParser } from './input-parser';
import DefaultOutputFormatter, { OutputFormatter } from './output-formatter';

export enum LogVerbosity {
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

export const LOGGER_METHODS_BY_VERBOSITY = Object.freeze({
  [LogVerbosity.TRACE]: 'trace',
  [LogVerbosity.DEBUG]: 'debug',
  [LogVerbosity.INFO]: 'info',
  [LogVerbosity.WARN]: 'warn',
  [LogVerbosity.ERROR]: 'error',
} as const);

const DEFAULT_LOGGER_METADATA = {};

function tryToGetLogVerbosityFromEnv(): Maybe<LogVerbosity> {
  const verbosityString = process.env.LOG_VERBOSITY ?? process.env.LOG_LEVEL ?? '';

  switch (verbosityString) {
    case 'trace':
    case 'TRACE':
      return LogVerbosity.TRACE;
    case 'debug':
    case 'DEBUG':
      return LogVerbosity.DEBUG;
    case 'info':
    case 'INFO':
      return LogVerbosity.INFO;
    case 'warn':
    case 'WARN':
      return LogVerbosity.WARN;
    case 'error':
    case 'ERROR':
      return LogVerbosity.ERROR;
    default:
      return null;
  }
}

export type LoggerMethods = typeof LOGGER_METHODS_BY_VERBOSITY[LogVerbosity];
export type GenericLogger = Pick<Console, LoggerMethods>;

export interface LoggerOptions {
  logger?: GenericLogger;
  location?: string;
  metadata?: DictOf<unknown>;
  verbosity?: LogVerbosity;
  inputParser?: InputParser;
  outputFormatter?: OutputFormatter;
}

export default class Logger {
  constructor(options?: LoggerOptions) {
    this.logger_ = options?.logger || console;
    this.location_ = options?.location ?? 'unknown';
    this.metadata_ = { ...DEFAULT_LOGGER_METADATA, ...(options?.metadata || {}) };
    this.verbosity_ = options?.verbosity ?? tryToGetLogVerbosityFromEnv() ?? LogVerbosity.ERROR;
    this.inputParser_ = options?.inputParser || new DefaultInputParser();
    this.outputFormatter_ = options?.outputFormatter || new DefaultOutputFormatter();
  }

  public trace(...args: ReadonlyArrayOf<unknown>): void {
    this.log(LogVerbosity.TRACE, args);
  }

  public debug(...args: ReadonlyArrayOf<unknown>): void {
    this.log(LogVerbosity.DEBUG, args);
  }

  public info(...args: ReadonlyArrayOf<unknown>): void {
    this.log(LogVerbosity.INFO, args);
  }

  public warn(...args: ReadonlyArrayOf<unknown>): void {
    this.log(LogVerbosity.WARN, args);
  }

  public error(...args: ReadonlyArrayOf<unknown>): void {
    this.log(LogVerbosity.ERROR, args);
  }

  public getLogger(): GenericLogger {
    return this.logger_;
  }

  public setLogger(logger: GenericLogger): this {
    this.logger_ = logger;

    return this;
  }

  public getLocation(): string {
    return this.location_;
  }

  public setLocation(location: string): this {
    this.location_ = location;

    return this;
  }

  public getMetadata(): DictOf<unknown> {
    return this.metadata_;
  }

  public setMetadata(metadata: DictOf<unknown>): this {
    this.metadata_ = metadata;

    return this;
  }

  public getVerbosity(): LogVerbosity {
    return this.verbosity_;
  }

  public setVerbosity(verbosity: LogVerbosity): this {
    this.verbosity_ = verbosity;

    return this;
  }

  private log(verbosity: LogVerbosity, args: ReadonlyArrayOf<unknown>): void {
    if (verbosity >= this.verbosity_) {
      const parsedArgs: string[] = [];

      for (const arg of args) {
        const result = this.inputParser_.tryToParse(arg);

        if (result.success) {
          parsedArgs.push(result.value);
        }
      }

      const verbosityString = LOGGER_METHODS_BY_VERBOSITY[this.verbosity_];

      const output = this.outputFormatter_.format({
        parsedArgs,
        verbosityString,
        location: this.location_,
        metadata: this.metadata_,
      });

      this.logger_[verbosityString](output);
    }
  }

  private logger_: GenericLogger;
  private location_: string;
  private metadata_: DictOf<unknown>;
  private verbosity_: LogVerbosity;

  private readonly inputParser_: InputParser;
  private readonly outputFormatter_: OutputFormatter;
}
