import {
  BaseRestControllerService,
  InternalServerErrorException,
  throwOnMongoBuilderQueryResultError,
} from '../../../../../lib/node';
import { TodoModel, UpdateTodoRestRequest } from '../../../shared';

export class UpdateTodoService extends BaseRestControllerService<
  typeof UpdateTodoRestRequest
> {
  public async exec() {
    if (!this.req.params.id) {
      throw new InternalServerErrorException('Invalid request');
    }

    const res = await TodoModel()
      .createQueryBuilder()
      .filterObjectId(this.req.params.id)
      .values(this.req.body)
      .update();
    throwOnMongoBuilderQueryResultError(res);

    return res.data;
  }
}
