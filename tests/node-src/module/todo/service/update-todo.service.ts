import { TodoModel } from '../../../shared/models/todo.model';
import {
  InternalServerErrorException,
  throwOnMongoBuilderQueryResultError,
} from '../../../../../lib/node';
import { GetByIdRestRequestParams } from '../../../../../lib/core';
import { UpdateTodoRestRequestBody } from '../../../shared/rest/todo';

export class UpdateTodoService {
  public async handle(
    params: GetByIdRestRequestParams,
    body: UpdateTodoRestRequestBody,
  ) {
    if (!params.id) {
      throw new InternalServerErrorException('Invalid request');
    }

    const res = await TodoModel()
      .createQueryBuilder()
      .filterObjectId(params.id)
      .values(body)
      .update();
    throwOnMongoBuilderQueryResultError(res);

    return res.data;
  }
}
