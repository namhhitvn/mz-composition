import { MongoBaseModelAudit } from '../../../../lib/core';

export class Todo extends MongoBaseModelAudit {
  public title!: string;
  public active!: boolean;
}
