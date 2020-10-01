import { useCallback, useState } from "react";

import validator from "../validator";

import { Form, FormChange, FormErrors, FormValues, WrapFormChange, WrapFormSubmit } from "./useForm.types";

const useForm = <Input extends object, Output extends Input = Input>({ schema, defaults = {} }: Form<Input>) => {
  const [values, setValues] = useState<FormValues<Input>>({ ...defaults });
  const [errors, setErrors] = useState<FormErrors<Input>>({});

  const onChange: FormChange<Input> = useCallback(
    (value, name) => {
      setValues((prevState) => ({
        ...prevState,
        [name]: value,
      }));

      if (!errors[name]) return;

      const errorsInput = validator.one<Partial<Input>>(
        {
          ...values,
          [name]: value,
        },
        name,
        schema,
      );

      setErrors((prevState) => ({
        ...prevState,
        [name]: errorsInput,
      }));
    },
    [errors, values, schema],
  );

  const wrapChange: WrapFormChange<Input> = useCallback(
    (onChangeProp) => (value, name, event) => {
      onChange(value, name, event);
      onChangeProp(value, name, event);
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
