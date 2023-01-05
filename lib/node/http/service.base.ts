import { PromiseAble } from '../../interfaces';
import { MZCore } from '../interfaces';
import { HttpRestResponse } from '../../core/http/rest/response';
import { RestRequestResponseOK } from '../../core';
import { BaseController } from './controller.base';

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
  public controller!: BaseController<Params, Response>;
  public req!: Params[0];

  constructor(reqOrController: Params[0] | BaseController<Params, Response>) {
    this.req = (reqOrController as any)['req'] || reqOrController;

    if ((reqOrController as any)['req']) {
      this.controller = reqOrController as any;
    }
  }

  public abstract exec(
    ...args: any[]
  ): PromiseAble<
    Response extends RestRequestResponseOK ? any : Response['data'] | Response
  >;
}
