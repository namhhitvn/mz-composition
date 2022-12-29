export type ObjectLiteral = {
  [key: keyof any]: any;
};

export type WithLeast<T, K extends keyof T> = Omit<Partial<T>, K> & Pick<T, K>;

export type WithRequired<T, K extends keyof T> = Omit<Partial<T>, K> &
  Required<Pick<T, K>>;

export type WithOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type WithWritable<T> = { -readonly [K in keyof T]: T[K] } & {
  [key: string]: any;
};

export interface Constructor<T = any> {
  new (...args: any[]): T;
  prototype: T;
}

export type PromiseAble<T> = T | Promise<T>;
