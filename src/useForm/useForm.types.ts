import { ChangeEvent, FormEvent } from "react";
import { ValidationSchema } from "fastest-validator";

export interface Form<T> {
  defaults?: Partial<T>;
  schema: ValidationSchema<T>;
}

export type FormValues<T> = Partial<T>;
export type FormErrors<T> = Partial<Record<keyof T, string[]>>;

export type FormChange<T> = (
  value: T[keyof T],
  name: keyof T,
  event?: ChangeEvent,
) => void;
type FormSubmit = (event: FormEvent<HTMLFormElement>) => void;

export type WrapFormChange<T> = (onChange: FormChange<T>) => FormChange<T>;
export type WrapFormSubmit<T, O = T> = (
  onSubmit: (values: O) => void,
) => FormSubmit;
