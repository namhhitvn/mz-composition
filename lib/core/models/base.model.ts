export class BaseModel<T extends number | string = number> {
  public id!: T;
}

export class BaseModelAudit<
  T extends number | string = number,
> extends BaseModel<T> {
  public created_at: Date | null = null;
  public updated_at: Date | null = null;
  public deleted_at: Date | null = null;
}

export class MongoBaseModel {
  public _id!: string;
}

export class MongoBaseModelAudit extends MongoBaseModel {
  public createdAt: Date | null = null;
  public updatedAt: Date | null = null;
  public deletedAt: Date | null = null;
}
