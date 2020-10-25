// REF: https://github.com/Microsoft/TypeScript/issues/21826#issuecomment-479851685
declare interface ObjectConstructor {
  keys<T>(o: T): (keyof T)[];
  values<T>(o: T): (T[keyof T])[];
  entries<T>(o: T): [keyof T, T[keyof T]][];
}
