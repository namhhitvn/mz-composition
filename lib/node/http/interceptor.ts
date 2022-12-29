import type { MZCore } from '../interfaces';
import * as express from 'express';

export abstract class MZInterceptor {
  public abstract handle: MZCore.RequestHandler;

  public apply(app: express.Express): void {
    app.use(this.handle as express.RequestHandler);
  }
}
