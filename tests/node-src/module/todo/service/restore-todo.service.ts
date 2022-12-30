import {
  BaseRestControllerService, InternalServerErrorException,
  throwOnMongoBuilderQueryResultError
} from '../../../../../lib/node';
import { RestoreTodoRestRequest, TodoModel } from '../../../shared';

export class RestoreTodoService extends BaseRestControllerService<
  typeof RestoreTodoRestRequest
> {
  public async exec() {
    if (!this.req.params.id) {
      throw new InternalServerErrorException('Invalid request');
    }

    const res = await TodoModel()
      .createQueryBuilder()
      .filterObjectId(this.req.params.id)
      .restore();
    throwOnMongoBuilderQueryResultError(res);

    return res.data;
  }
}
