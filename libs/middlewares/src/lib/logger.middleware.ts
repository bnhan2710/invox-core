import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getProcesssId } from '@common/utils/string.util';
import { MetadataKeys } from '@common/constants/common.constant';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const prosessId = getProcesssId();
    (req as any)[MetadataKeys.PROCESS_ID] = prosessId;
    const startTime = Date.now();
    const { method, originalUrl, body } = req;

    const now = Date.now();
    (req as any)[MetadataKeys.START_TIME] = now;

    Logger.log(
      `HTTP >> Start process '${prosessId}' >> path: '${originalUrl}' >> method: '${method}' >> BODY: ${JSON.stringify(
        body,
      )} at ${now}`,
    );
    const originalSend = res.send.bind(res);

    res.send = (body?: any): Response => {
      const durationMs = Date.now() - startTime;
      Logger.log(
        `HTTP << End process '${prosessId}' >> path: '${originalUrl}' >> method: '${method}' at ${Date.now()}  >> STATUS: ${
          res.statusCode
        } >> Response Time: ${durationMs}ms`,
      );
      return originalSend(body);
    };

    next();
  }
}
