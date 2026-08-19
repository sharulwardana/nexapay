/**
 * Lightweight structured logger for NexaPay.
 *
 * In production, outputs JSON for log aggregation services (Datadog, CloudWatch, etc.).
 * In development, outputs human-readable colored console messages.
 *
 * Zero external dependencies — uses only built-in console API.
 */

type LogLevel = 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

const isProd = process.env.NODE_ENV === 'production';

function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  if (isProd) {
    // Structured JSON for production log aggregation
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      service: 'nexapay',
      ...context,
    });
  }
  // Human-readable for development
  const prefix = {
    info: '[INFO]',
    warn: '[WARN]',
    error: '[ERROR]',
  }[level];
  const contextStr = context ? ` ${JSON.stringify(context)}` : '';
  return `${prefix} ${message}${contextStr}`;
}

export const logger = {
  info(message: string, context?: LogContext) {
    console.log(formatMessage('info', message, context));
  },

  warn(message: string, context?: LogContext) {
    console.warn(formatMessage('warn', message, context));
  },

  error(message: string, error?: unknown, context?: LogContext) {
    const errorInfo: LogContext = { ...context };
    if (error instanceof Error) {
      errorInfo.errorName = error.name;
      errorInfo.errorMessage = error.message;
      if (!isProd) {
        errorInfo.stack = error.stack;
      }
    } else if (error !== undefined) {
      errorInfo.errorRaw = String(error);
    }
    console.error(formatMessage('error', message, errorInfo));
  },
};

export default logger;
