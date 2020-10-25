import { ChangeEvent, FormEvent } from "react";
import { ValidationSchema } from "fastest-validator";

export interface Form<T> {
  defaults?: Partial<T>;
  schema: ValidationSchema<T>;
}

export type FormValues<T> = Partial<T>;
export type FormErrors<T> = Partial<Record<keyof T, string[]>>;

type MapChangeEvent<T> = (event: ChangeEvent) => Partial<T>;
type MapChangeMap<T> = (map: Partial<T>) => Partial<T>;
type MapChangeValue<T> = (value: T[keyof T], name: keyof T) => Partial<T>;
export type MapChange<T> = MapChangeEvent<T> & MapChangeMap<T> & MapChangeValue<T>;

type FormChangeEvent = (event: ChangeEvent) => void;
type FormChangeMap<T> = (map: Partial<T>) => void;
type FormChangeValue<T> = (value: T[keyof T], name: keyof T) => void;
export type FormChange<T> = FormChangeEvent & FormChangeMap<T> & FormChangeValue<T>;
export type FormSubmit = (event: FormEvent<HTMLFormElement>) => void;

export type WrapArgFormChange<T> = FormChange<T>;
export type WrapArgFormSubmit<O> = (values: O) => void;

export type WrapFormChange<T> = (onChange: WrapArgFormChange<T>) => FormChange<T>;
export type WrapFormSubmit<T, O = T> = (onSubmit: WrapArgFormSubmit<O>) => FormSubmit;
