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
const isMap = <T extends unknown>(values: unknown): values is T =>
  //
  values instanceof Object;

const useForm = <Input extends object, Output extends Input = Input>({
  schema,
  defaults = {},
}: Form<Input>) => {
  const [values, setValues] = useState<FormValues<Input>>({ ...defaults });
  const [errors, setErrors] = useState<FormErrors<Input>>({});

  const mapChange: MapChange<Input> = useCallback((...args: any[]) => {
    let value: Input[keyof Input];
    let name: keyof Input;

    if (isEvent(args[0])) {
      const event = args[0];
      name = event.target.name as keyof Input;
      value = event.target.value as Input[keyof Input];
    } else if (isMap<Input>(args[0])) {
      const values = args[0];
      [[name, value]] = Object.entries(values);
    } else {
      value = args[0];
      name = args[1];
    }

    return { [name]: value } as Input;
  }, []);

  const onChange: FormChange<Input> = useCallback(
    (...args: [any]) => {
      setValues((prevState) => ({
        ...prevState,
        ...mapChange(...args),
      }));

      if (!errors[name]) return;

      const errorsInput = validator.one<Partial<Input>>(
        {
          ...values,
          ...mapChange(...args),
        },
        name,
        schema,
      );

      setErrors((prevState) => ({
        ...prevState,
        [name]: errorsInput,
      }));
    },
    [errors, values, schema, mapChange],
  );

  const wrapChange: WrapFormChange<Input> = useCallback(
    (onChangeProp) => (...args: [any]) => {
      onChangeProp && onChangeProp(...args);
      onChange(...args);
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
