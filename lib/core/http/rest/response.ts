import type { WithWritable } from '../../../interfaces';
import { HttpStatusCode } from '../../constants';

export class HttpRestResponse<Data> {
  public readonly data!: Data;
  public readonly message?: string;
  public readonly response?: Response;
  public readonly statusCode?: HttpStatusCode;

  constructor(data: Data, statusCode = HttpStatusCode.OK, message?: string) {
    (this as WithWritable<this>).data = data;
    (this as WithWritable<this>).message = message;

    Object.defineProperty(this, 'statusCode', {
      value: statusCode,
      enumerable: false,
    });
  }
}
