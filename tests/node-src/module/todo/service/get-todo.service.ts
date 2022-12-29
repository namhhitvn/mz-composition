import { GetByIdRestRequestParams } from '../../../../../lib/core';
import { TodoModel } from '../../../shared/models/todo.model';
import {
  InternalServerErrorException,
  throwOnMongoBuilderQueryResultError,
} from '../../../../../lib/node';

export class GetTodoService {
  public async handle(params: GetByIdRestRequestParams) {
    if (!params.id) {
      throw new InternalServerErrorException('Invalid request');
    }

    const res = await TodoModel()
      .createQueryBuilder()
      .filterObjectId(params.id)
      .findOne();
    throwOnMongoBuilderQueryResultError(res);

    if (!res.data._id) {
      throw new InternalServerErrorException('Record not found');
    }

    return res.data;
  }
}
