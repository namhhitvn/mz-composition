import { PromiseAble } from '../../interfaces';
import { MZCore } from '../interfaces';
import { HttpRestResponse } from '../../core/http/rest/response';
import { RestRequestResponseOK } from '../../core';

export abstract class BaseControllerService<
  Params extends MZCore.RequestHandlerParameters<
    any,
    any,
    any,
    any,
    any,
    any
  > = MZCore.RequestHandlerParameters<any, any, any, any, any, any>,
  Response extends HttpRestResponse<any> = HttpRestResponse<any>,
> {
  constructor(protected req: Params[0]) {}

  public abstract exec(...args: any[]): PromiseAble<Response extends RestRequestResponseOK ? any : Response['data'] | Response>;
}
