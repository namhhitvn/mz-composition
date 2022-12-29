import { HttpStatusCode } from '../../core';
import { RuntimeErrorException } from './runtime-error.exception';

export class FatalErrorException extends RuntimeErrorException {
  public override readonly statusCode: number = HttpStatusCode.NOT_IMPLEMENTED;
}
