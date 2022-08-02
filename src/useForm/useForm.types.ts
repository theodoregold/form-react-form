import { ChangeEvent, FormEvent } from "react";
import { ValidationSchema } from "fastest-validator";

export interface Form<T> {
  defaults?: Partial<T>;
  schema: Partial<ValidationSchema<T>>;
}

export interface State<Input> {
  values: FormValues<Input>;
  errors: FormErrors<Input>;
}

export interface ValidateForm<T> {
  names: (keyof T)[];
  values: FormValues<T>;
  errors: FormErrors<T>;
  changes: FormValues<T>;
  schema: Partial<ValidationSchema<T>>;
}

export type SetValuesCallback<S> = (prevState: S) => S;
export type SetValues<S> = (value: S | SetValuesCallback<S>) => void;

export type SetErrorsCallback<S> = (prevState: S) => S;
export type SetErrors<S> = (value: S | SetValuesCallback<S>) => void;

export type FormValues<T> = Partial<T>;
export type FormErrors<T> = Partial<Record<keyof T, string[]>>;

export type CustomEvent<T> = ChangeEvent<{ name: keyof T; value: T[keyof T] }>;

export interface MapChange<T> {
  (event: ChangeEvent): Partial<T>;
  (map: Partial<T>): Partial<T>;
  (value: T[keyof T], name: keyof T): Partial<T>;
}

export interface FormChange<T> {
  (event: ChangeEvent): void;
  (map: Partial<T>): void;
  (value: T[keyof T], name: keyof T): void;
}
export type FormSubmit = (event?: FormEvent<HTMLFormElement>) => void;

export type WrapFormChange<T> = (onChange: FormChange<T>) => FormChange<T>;
export type WrapFormSubmit<T, O = T> = (onSubmit: (values: O) => void) => FormSubmit;
