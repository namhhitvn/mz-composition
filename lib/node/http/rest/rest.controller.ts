import { MZRestRequestHandleParameters } from './router-rest';
import { BaseController } from '../controller.base';
import { HttpRestRequest } from '../../../core';

export abstract class RestController<
  T extends typeof HttpRestRequest<any, any, any, any, any>,
  Locals extends Record<string, any> = Record<string, any>,
  Params extends MZRestRequestHandleParameters<
    T,
    Locals
  > = MZRestRequestHandleParameters<T, Locals>,
  Response = InstanceType<InstanceType<T>['Response']>,
> extends BaseController<Params, Response> {}
