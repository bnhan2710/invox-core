import { CallHandler, Injectable, Logger } from '@nestjs/common';
import { ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class TcpLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const now = Date.now();
    const handler = context.getHandler();
    const handlerName = handler.name;
    const args = context.getArgs();

    const param = args[0]; // first argument is payload of tcp
    const processId = param.processId;
    Logger.log('param', param);

    Logger.log(
      `TCP » Start process '${processId}' at '${now}' » handler: '${handlerName}' » param: ${JSON.stringify(param)}`,
    );

    return next
      .handle()
      .pipe(
        tap(() =>
          Logger.log(
            `TCP » End process '${processId}' at '${Date.now()}' » handler: '${handlerName}' » duration: ${
              Date.now() - now
            }ms`,
          ),
        ),
      );
  }
}
