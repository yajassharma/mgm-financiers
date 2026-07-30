import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { TServerResponse } from '../types/server-response.type';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest<any>();

    const requestId = request.requestId;
    const path = request.url;
    const method = request.method;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let title = 'Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;
      message = res?.message || exception.message;
      title = res?.title || 'Error';
    }

    // -------------------------------
    // 🔥 Extract file + line number
    // -------------------------------
    let file = null;
    let line = null;

    if (exception instanceof Error && exception.stack) {
      const stackLines = exception.stack.split('\n');

      // Find the first line in stack trace that contains your project path
      const traceLine =
        stackLines.find((l) => l.includes('/src/')) || stackLines[1] || null;

      if (traceLine) {
        const match = traceLine.match(/(?:at\s.*\()?(.+):(\d+):(\d+)\)?/);

        if (match) {
          file = match[1];
          line = Number(match[2]);
        }
      }
    }

    // -------------------------------
    // 🔥 Log full error WITH file + line
    // -------------------------------
    this.logger.error(
      JSON.stringify({
        requestId,
        status,
        message,
        method,
        path,
        file,
        line,
        stack:
          process.env.NODE_ENV !== 'production' && exception instanceof Error
            ? exception.stack
            : undefined,
      }),
    );

    // -------------------------------
    // 🔥 Always safe for client
    // -------------------------------
    const payload: TServerResponse = {
      statusCode: status,
      status: 'error',
      title,
      message,
      requestId,

      // only show file+line in DEV mode
      ...(process.env.NODE_ENV !== 'production' && file && line
        ? { extraData: { file, line } }
        : {}),
    };

    return response.status(status).json(payload);
  }
}
