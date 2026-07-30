import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TServerResponse } from '../types/server-response.type';

@Injectable()
export class TransformResponseInterceptor<DATA = unknown, EXTRA_DATA = unknown>
  implements NestInterceptor
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<TServerResponse> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<any>();
    const requestId = request.requestId;

    return next.handle().pipe(
      map(
        (
          data: DATA | TServerResponse<DATA, EXTRA_DATA>,
        ): TServerResponse<DATA, EXTRA_DATA> => {
          if (
            data &&
            typeof data === 'object' &&
            'statusCode' in data &&
            'status' in data
          ) {
            return { ...data, requestId };
          }
          return {
            statusCode: 200,
            status: 'success',
            title: 'OK',
            message: 'Request successful',
            ...(typeof data === 'object' ? { ...data, requestId } : { data }),
          };
        },
      ),
    );
  }
}
