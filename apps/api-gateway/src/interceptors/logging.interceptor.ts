import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable, throwError } from 'rxjs';
  import { tap, catchError } from 'rxjs/operators';
  
  @Injectable()
  export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);
  
    intercept(
      context: ExecutionContext,
      next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
      const request = context.switchToHttp().getRequest();
      const userAgent = request.get('user-agent') || '';
      const { ip, method, path: url, body, headers, query, params } = request;
  
      this.logger.log(
        `Request:\n\n---Method: 
        ${method}\n
         ---URL: ${url}\n
          ---User Agent: ${userAgent}\n
           ---IP: ${ip}\n
            ${context.getClass().name}\n
         ---Body: ${JSON.stringify(body, null, 2)}\n
         ---Headers: ${JSON.stringify(headers, null, 2)}\n
        --- Query: ${JSON.stringify(query, null, 2)} \n
        --- Params: ${JSON.stringify(params, null, 2)}\n
        \n\n\n`,
      );
  
      const now = Date.now();
      return next.handle().pipe(
        tap((_) => {
          const response = context.switchToHttp().getResponse();
  
          const { statusCode } = response;
  
          this.logger.log(
            `\nResponse:\n\nMethod: ${method}\n URL: ${url}\n Status: ${statusCode}\n User Agent: ${userAgent}\n IP: ${ip}\n Lasted ${
              Date.now() - now
            }ms\n\n`,
          );
        }),
        catchError((err) => {
          this.logger.error(err);
          return throwError(() => err);
        }),
      );
    }
  }
  