import { clone, pick } from "ramda";
import Validator, { ValidationError, ValidationSchema } from "fastest-validator";

const validator = new Validator();

const mapErrors = (errors: ValidationError[]) => {
  return errors.reduce((acc: Record<string, string[]>, { field, message }) => {
    if (!acc[field]) acc[field] = [];

    if (message) acc[field].push(message);

    return acc;
  }, {});
};

const all = <T>(values: T, schema: ValidationSchema<T>) => {
  const result = validator.validate(clone(values), schema);

  if (result === true) return;

  return mapErrors(result) as Partial<Record<keyof T, string[]>>;
};

const multiple = <T>(values: T, targets: (keyof T)[], schema: ValidationSchema<T>) => {
  const result = validator.validate(clone(values), {
    ...pick(targets, schema),
  });

  if (result === true) return;

  return mapErrors(result) as Partial<Record<keyof T, string[]>>;
};

export default { all, multiple };
