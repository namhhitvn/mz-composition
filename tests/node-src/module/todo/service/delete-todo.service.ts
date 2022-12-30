import {
  BaseRestControllerService, InternalServerErrorException,
  throwOnMongoBuilderQueryResultError
} from '../../../../../lib/node';
import { DeleteTodoRestRequest, TodoModel } from '../../../shared';

export class DeleteTodoService extends BaseRestControllerService<
  typeof DeleteTodoRestRequest
> {
  public async exec() {
    if (!this.req.params.id) {
      throw new InternalServerErrorException('Invalid request');
    }

    const res = await TodoModel()
      .createQueryBuilder()
      .filterObjectId(this.req.params.id)
      .softDelete();
    throwOnMongoBuilderQueryResultError(res);

    return res.data;
  }
}
