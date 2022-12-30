import { HttpRestRequest } from '../../../core';
import { BaseController } from '../controller.base';
import { MZRestRequestHandleParameters } from './rest.router';

export abstract class BaseRestController<
  T extends typeof HttpRestRequest<any, any, any, any, any>,
  Locals extends Record<string, any> = Record<string, any>,
  Params extends MZRestRequestHandleParameters<
    T,
    Locals
  > = MZRestRequestHandleParameters<T, Locals>,
  Response = InstanceType<InstanceType<T>['Response']>,
> extends BaseController<Params, Response> {}
