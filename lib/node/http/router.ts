import * as express from 'express';
import type { MZCore } from '../interfaces';

export interface MZRouterOptions extends express.RouterOptions {
  enable?: boolean;
  path?: string;
}

export abstract class MZRouter {
  public readonly router!: express.Router;

  constructor(public readonly options: MZRouterOptions = {}) {
    this.router = express.Router(options);
  }

  public assignRouter(app: express.Express) {
    if (this.options.enable === false) {
      return;
    }

    if (this.options.path) {
      app.use(this.options.path, this.router);
    } else {
      app.use(this.router);
    }
  }

  public addRouter(router: express.Router | MZRouter): this {
    this.router.use('router' in router ? (router as MZRouter).router : router);
    return this;
  }

  public addRoute(
    _config: any,
    ..._handlers: Array<MZCore.RequestHandler<any, any, any, any, any>>
  ): this {
    return this;
  }
}
