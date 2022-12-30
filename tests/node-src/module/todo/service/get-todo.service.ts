import {
  BaseRestControllerService, InternalServerErrorException,
  throwOnMongoBuilderQueryResultError
} from '../../../../../lib/node';
import { GetTodoRestRequest, TodoModel } from '../../../shared';

export class GetTodoService extends BaseRestControllerService<
  typeof GetTodoRestRequest
> {
  public async exec() {
    if (!this.req.params.id) {
      throw new InternalServerErrorException('Invalid request');
    }

    const res = await TodoModel()
      .createQueryBuilder()
      .filterObjectId(this.req.params.id)
      .findOne();
    throwOnMongoBuilderQueryResultError(res);

    if (!res.data._id) {
      throw new InternalServerErrorException('Record not found');
    }

    return res.data;
  }
}
