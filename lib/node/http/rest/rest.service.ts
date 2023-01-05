import { MZRestRequestHandleParameters } from './rest.router';
import { HttpRestRequest } from '../../../core';
import { BaseControllerService } from '../service.base';
import { HttpRestResponse } from '../../../core/http/rest/response';
import { BaseRestController } from './rest.controller';

export abstract class BaseRestControllerService<
  T extends typeof HttpRestRequest<any, any, any, any, any>,
  Locals extends Record<string, any> = Record<string, any>,
  Params extends MZRestRequestHandleParameters<
    T,
    Locals
  > = MZRestRequestHandleParameters<T, Locals>,
  Response extends HttpRestResponse<any> = InstanceType<
    InstanceType<T>['Response']
  >,
> extends BaseControllerService<Params, Response> {
  public controller!: BaseRestController<T, Locals, Params, Response>;
}
