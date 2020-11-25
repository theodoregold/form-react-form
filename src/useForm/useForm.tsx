import { useCallback, useState } from "react";

import validator from "../validator";

import {
  Form,
  State,
  ValidateForm,
  MapChange,
  CustomEvent,
  FormChange,
  WrapFormChange,
  WrapFormSubmit,
} from "./useForm.types";

const isName = <T,>(name: unknown): name is keyof T => typeof name === "string";
const isValue = <T,>(value: unknown): value is T[keyof T] => !value || !!value;
const isEvent = <T,>(event: unknown): event is CustomEvent<T> =>
  event instanceof Object && "nativeEvent" in event;
const isObject = <T,>(values: unknown): values is T => values instanceof Object;

const validateForm = <Input,>({ names, values, errors, changes, schema }: ValidateForm<Input>) => {
  const errorsForm = validator.multiple<Partial<Input>>(
    {
      ...values,
      ...changes,
    },
    names,
    schema,
  );

  const errorsClear = names.reduce(
    (acc, name) => {
      delete acc[name];
      return acc;
    },
    { ...errors },
  );

  return {
    ...errorsClear,
    ...errorsForm,
  };
};

const useForm = <Input extends object, Output extends Input = Input>({
  schema,
  defaults = {},
}: Form<Input>) => {
  const [{ values, errors }, setState] = useState<State<Input>>({
    values: { ...defaults },
    errors: {},
  });

  const setValues = useCallback((values: State<Input>["values"]) => {
    setState((prevState) => ({ ...prevState, values }));
  }, []);

  const setErrors = useCallback((errors: State<Input>["errors"]) => {
    setState((prevState) => ({ ...prevState, errors }));
  }, []);

  const mapChange: MapChange<Input> = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...[arg1, arg2]: any[]) => {
      const changes: Partial<Input> = {};

      if (isEvent<Input>(arg1)) {
        changes[arg1.target.name] = arg1.target.value;
      } else if (isValue<Input>(arg1) && isName<Input>(arg2)) {
        changes[arg2] = arg1;
      } else if (isObject<Input>(arg1)) {
        Object.assign(changes, arg1);
      } else {
        throw Error("Invalid change value");
      }

      return changes;
    },
    [],
  );

  const onChange: FormChange<Input> = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...[arg1, arg2]: any[]) => {
      const changes = mapChange(arg1, arg2);

      setState(({ values, errors }) => {
        const names = Object.keys(changes);
        const valuesNext = {
          ...values,
          ...changes,
        };

        if (!names.some((name) => errors[name])) {
          return {
            errors,
            values: valuesNext,
          };
        }

        return {
          errors: validateForm<Input>({ names, values, errors, changes, schema }),
          values: valuesNext,
        };
      });
    },
    [schema, mapChange],
  );

  const wrapChange: WrapFormChange<Input> = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (onChangeProp) => (...[arg1, arg2]: any[]) => {
      onChangeProp && onChangeProp(arg1, arg2);
      onChange(arg1, arg2);
    },
    [onChange],
  );

  const wrapSubmit: WrapFormSubmit<Input, Output> = useCallback(
    (onSubmitProp) => (event) => {
      event.preventDefault();

      setState(({ values, errors }) => {
        const errorsForm = validator.all<Partial<Input>>(values, schema);

        if (!errorsForm) onSubmitProp(values as Output);

        return {
          errors: errorsForm || errors,
          values,
        };
      });
    },
    [schema],
  );

  return {
    onChange,
    wrapChange,
    wrapSubmit,
    setErrors,
    setValues,
    errors,
    values,
  };
};

export default useForm;
