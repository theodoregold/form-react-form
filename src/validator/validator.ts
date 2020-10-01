import clone from "ramda/es/clone";
import Validator, {
  ValidationError,
  ValidationSchema,
} from "fastest-validator";

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

  const errors = mapErrors(result) as Partial<Record<keyof T, string[]>>;

  return errors;
};

const one = <T>(values: T, target: keyof T, schema: ValidationSchema<T>) => {
  const errors = validator.validate(clone(values), {
    [target]: {
      ...schema[target],
    },
  });

  if (errors === true) return;

  const errorsByField = mapErrors(errors) as Partial<Record<keyof T, string[]>>;
  const errorsInput = errorsByField[target];

  if (!errorsInput || !errorsInput.length) return;

  return errorsInput;
};

export default { all, one };
