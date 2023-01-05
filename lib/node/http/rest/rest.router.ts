import {
  getConstructorName,
  HttpRequestMethod,
  HttpRestRequest,
  HttpRestRequestRepository,
  HttpRestRequestRepositoryMetadata,
  instanceOfDeep,
} from '../../../core';
import { FatalErrorException } from '../../exception';
import type { MZCore } from '../../interfaces';
import { MZRouter, MZRouterOptions } from '../router';
import { BaseRestController } from './rest.controller';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MZRestRouterOptions extends MZRouterOptions {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MZRestRequestHandle<
  T extends typeof HttpRestRequest<any, any, any, any, any>,
  Locals extends Record<string, any> = Record<string, any>,
> extends MZCore.RequestHandler<
    InstanceType<InstanceType<T>['Response']>,
    InstanceType<InstanceType<T>['Params']>,
    InstanceType<InstanceType<T>['Body']>,
    InstanceType<InstanceType<T>['Query']>,
    Locals,
    { rest: HttpRestRequestRepositoryMetadata<T> }
  > {}

export type MZRestRequestHandleParameters<
  T extends typeof HttpRestRequest<any, any, any, any, any>,
  Locals extends Record<string, any> = Record<string, any>,
> = Parameters<MZRestRequestHandle<T, Locals>>;

const httpRestRequestMethodMap: {
  [key in HttpRequestMethod]:
    | 'all'
    | 'get'
    | 'post'
    | 'put'
    | 'delete'
    | 'patch'
    | 'options'
    | 'head';
} = {
  [HttpRequestMethod.ALL]: 'all',
  [HttpRequestMethod.GET]: 'get',
  [HttpRequestMethod.POST]: 'post',
  [HttpRequestMethod.PUT]: 'put',
  [HttpRequestMethod.DELETE]: 'delete',
  [HttpRequestMethod.PATCH]: 'patch',
  [HttpRequestMethod.OPTIONS]: 'options',
  [HttpRequestMethod.HEAD]: 'head',
};

export class MZRestRouter extends MZRouter {
  constructor(public readonly options: MZRestRouterOptions = {}) {
    super(options);
  }

  public addRoute<
    T extends typeof HttpRestRequest<any, any, any, any, any>,
    Locals extends Record<string, any> = Record<string, any>,
    Controller extends typeof BaseRestController<any> = typeof BaseRestController,
  >(
    rest: T,
    ...handlers: Array<MZRestRequestHandle<T, Locals> | Controller>
  ): this {
    const metadata = HttpRestRequestRepository.get(rest);
    if (!metadata) {
      throw new FatalErrorException(
        `HttpRestRequestRepository not exist ${getConstructorName(rest)}`,
      );
    }

    // console.log(
    //   `router handle -> ${(
    //     httpRestRequestMethodMap[metadata!.method!].toUpperCase() + '      '
    //   ).slice(0, 6)} - ${metadata!.path}`
    // );

    (this.router as any)[httpRestRequestMethodMap[metadata!.method!]](
      metadata!.path,
      <MZRestRequestHandle<T, Locals>>function (req, _res, next) {
        req.restMetadata = metadata;
        next();
      },
      ...handlers.map((handle) => {
        if (!instanceOfDeep(handle, BaseRestController)) {
          return async (req: any, res: any, next: any) => {
            try {
              return await Promise.resolve((handle as any)(req, res, next));
            } catch (error) {
              next(error);
            }
          };
        }

        return async (req: any, res: any, next: any) => {
          try {
            await (
              new (handle as any)(req, res, next) as BaseRestController<any>
            ).handle();
          } catch (error) {
            next(error);
          }
        };
      }),
    );

    return this;
  }
}
