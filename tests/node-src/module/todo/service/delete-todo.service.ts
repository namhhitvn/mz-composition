import { TodoModel } from '../../../shared/models/todo.model';
import {
  InternalServerErrorException,
  throwOnMongoBuilderQueryResultError,
} from '../../../../../lib/node';
import { GetByIdRestRequestParams } from '../../../../../lib/core';

export class DeleteTodoService {
  public async handle(params: GetByIdRestRequestParams) {
    if (!params.id) {
      throw new InternalServerErrorException('Invalid request');
    }

    const res = await TodoModel()
      .createQueryBuilder()
      .filterObjectId(params.id)
      .softDelete();
    throwOnMongoBuilderQueryResultError(res);

    return res.data;
  }
}
