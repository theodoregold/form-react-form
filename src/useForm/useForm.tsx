import { ChangeEvent, useCallback, useState } from "react";

import validator from "../validator";

import {
  Form,
  MapChange,
  FormChange,
  FormErrors,
  FormValues,
  WrapFormChange,
  WrapFormSubmit,
} from "./useForm.types";

const isEvent = (event: unknown): event is ChangeEvent =>
  event instanceof Object && "nativeEvent" in event;
const isMap = <T extends object>(values: unknown): values is T =>
  //
  values instanceof Object;

const useForm = <Input extends object, Output extends Input = Input>({
  schema,
  defaults = {},
}: Form<Input>) => {
  const [values, setValues] = useState<FormValues<Input>>({ ...defaults });
  const [errors, setErrors] = useState<FormErrors<Input>>({});

  const mapChange: MapChange<Input> = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...args: any[]) => {
      let value: Input[keyof Input] | undefined;
      let name: keyof Input;

      if (isEvent(args[0])) {
        const event = args[0];
        name = event.target.name as keyof Input;
        value = event.target.value as Input[keyof Input] | undefined;
      } else if (isMap<Partial<Input>>(args[0])) {
        return args[0];
      } else {
        value = args[0];
        name = args[1];
      }

      return { [name]: value } as Partial<Input>;
    },
    [],
  );

  const onChange: FormChange<Input> = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...args: any) => {
      const changes = mapChange.apply(undefined, args);

      setValues((prevState) => ({
        ...prevState,
        ...changes,
      }));

      const names = Object.keys(changes);

      if (!names.some((name) => errors[name])) return;

      const errorsForm = validator.multiple<Partial<Input>>(
        {
          ...values,
          ...changes,
        },
        names,
        schema,
      );

      setErrors((prevState) => {
        const errorsNext = names.reduce(
          (acc, name) => {
            delete acc[name];
            return acc;
          },
          { ...prevState },
        );

        return {
          ...errorsNext,
          ...errorsForm,
        };
      });
    },
    [errors, values, schema, mapChange],
  );

  const wrapChange: WrapFormChange<Input> = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (onChangeProp) => (...args: any) => {
      onChangeProp && onChangeProp.apply(undefined, args);
      onChange.apply(undefined, args);
    },
    [onChange],
  );

  const wrapSubmit: WrapFormSubmit<Input, Output> = useCallback(
    (onSubmitProp) => (event) => {
      event.preventDefault();

      const errorsForm = validator.all<Partial<Input>>(values, schema);

      if (errorsForm) {
        setErrors(errorsForm);

        return;
      }

      if (!errorsForm) onSubmitProp(values as Output);
    },
    [schema, values],
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
