import { MZRestRequestHandle, MZRestRouter } from './rest.router';
import { MZInterceptor } from '../interceptor';
import type { MZCore } from '../../interfaces';
import * as express from 'express';
import { AppEnvironment } from '../../core/app-environment';
import {
  FatalErrorException,
  InternalServerErrorException,
  RuntimeErrorException,
} from '../../exception';
import { HttpRestResponse, HttpStatusCode } from '../../../core';
import { isNumber } from 'lodash';

export class MZRestResponseInterceptor extends MZInterceptor {
  public handle: MZRestRequestHandle<any, any> = (req, res, next) => {
    this.overrideSendFunction(req, res, 'json');
    this.overrideSendFunction(req, res, 'jsonp');

    next();
  };

  public override apply(app: express.Express): void {
    if (
      AppEnvironment.instance.bootstrapOptions?.useRouters?.some(
        (msRouter) => msRouter instanceof MZRestRouter,
      )
    ) {
      app.use(this.handle as express.RequestHandler);

      app.once('bootstrap:listening', () => {
        (app.use as any)(
          (
            error: Error | HttpRestResponse<any>,
            req: MZCore.Request<any, any, any, any, any, any>,
            res: MZCore.Response<any, any>,
            next: express.NextFunction,
          ) => {
            if (!req.restMetadata) {
              return next();
            }

            if (error instanceof HttpRestResponse) {
              return res.status(error.statusCode!).end();
            }

            if (!(error instanceof RuntimeErrorException)) {
              error = new InternalServerErrorException(
                'Something went wrong',
                error.stack,
              );
            }

            const debugError = error as RuntimeErrorException;
            const response = new HttpRestResponse(
              undefined,
              debugError.statusCode,
              debugError.message,
            );

            if (AppEnvironment.instance.RES_ERROR_DETAIL) {
              (response as any).__error__ = {
                ...debugError,
                stack: debugError.stack || undefined,
              };
            }

            if (debugError.statusCode) {
              res.status(debugError.statusCode);
            }

            res.json(response).end();
          },
        );
      });
    }
  }

  private overrideSendFunction<Res extends MZCore.Response<any, any>>(
    req: MZCore.Request<any, any, any, any, any, any>,
    res: Res,
    methodKey: keyof Res,
  ) {
    const original = res[methodKey] as express.Send;
    (res as any)[methodKey] = function (resBody?: any) {
      if (!req.restMetadata) {
        return original.call(this, resBody);
      }

      if (!(resBody instanceof HttpRestResponse)) {
        throw new FatalErrorException('Response is invalid');
      }

      const statusCode = res.statusCode;
      const result = original.call(this, resBody);

      if (
        (isNumber((resBody as any)['statusCode']) &&
          (resBody as any)['statusCode'] !== res.statusCode) ||
        statusCode !== res.statusCode
      ) {
        res.status(
          (resBody as any)['statusCode'] || statusCode || HttpStatusCode.OK,
        );
      }

      return result;
    };
  }
}
