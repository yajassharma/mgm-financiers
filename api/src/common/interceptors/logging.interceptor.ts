// src/common/interceptors/logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const httpCtx = context.switchToHttp();
    const request = httpCtx.getRequest<any>();
    const response = httpCtx.getResponse<any>();

    const { method, url } = request;
    const userId = request.user?.id ?? 'anonymous';
    const requestId = request.requestId ?? 'N/A';

    return next.handle().pipe(
      tap(() => {
        const statusCode = response.statusCode;

        // single JSON line = easy for log collectors
        this.logger.log(
          JSON.stringify({
            requestId,
            method,
            url,
            statusCode,
            durationMs: Date.now() - now,
            userId,
          }),
        );
      }),
    );
  }
}
