import { HttpStatusCode } from '../../core';
import { RuntimeErrorException } from './runtime-error.exception';

export class InternalServerErrorException extends RuntimeErrorException {
  public override readonly statusCode: number =
    HttpStatusCode.INTERNAL_SERVER_ERROR;
}
