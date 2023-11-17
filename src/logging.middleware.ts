// logging.middleware.ts

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { environments } from './environments/environments';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (environments.isDev) {
      const logger = new Logger('Request', true);
      logger.log(environments.isDev);
      logger.log(`Detected request ${req.baseUrl} with method ${req.method}`);
    }
    next();
  }
}
