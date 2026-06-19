/**
 * Lightweight logger for test automation.
 * Writes to console with timestamps and log levels.
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

class Logger {
  private context: string;

  constructor(context: string = 'Test') {
    this.context = context;
  }

  private log(level: LogLevel, message: string): void {
    const timestamp = new Date().toISOString();
    const formatted = `[${timestamp}] [${level}] [${this.context}] ${message}`;
    switch (level) {
      case LogLevel.ERROR:
        console.error(formatted);
        break;
      case LogLevel.WARN:
        console.warn(formatted);
        break;
      default:
        console.log(formatted);
    }
  }

  debug(message: string): void {
    this.log(LogLevel.DEBUG, message);
  }

  info(message: string): void {
    this.log(LogLevel.INFO, message);
  }

  warn(message: string): void {
    this.log(LogLevel.WARN, message);
  }

  error(message: string): void {
    this.log(LogLevel.ERROR, message);
  }

  /** Create a child logger with a different context */
  child(context: string): Logger {
    return new Logger(`${this.context}:${context}`);
  }
}

export function createLogger(context: string): Logger {
  return new Logger(context);
}