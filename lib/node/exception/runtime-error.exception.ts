import { HttpStatusCode } from '../../core';

export class RuntimeErrorException extends Error {
  public readonly statusCode: number = HttpStatusCode.INTERNAL_SERVER_ERROR;

  constructor(message = '', stack?: string | string[]) {
    super(message);
    this.name = this.constructor.name;
    if (stack)
      this.stack =
        this.stack + '\n' + (Array.isArray(stack) ? stack.join('\n') : stack);
  }

  public what() {
    return this.message;
  }
}
