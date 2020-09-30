import { useState } from 'react';

import validatorHelper from '../validator';

import {
  Form,
  FormChange,
  FormErrors,
  FormValues,
  WrapFormChange,
  WrapFormSubmit,
} from './useForm.types';

const useForm = <Input extends object, Output extends Input = Input>({
  schema,
  defaults = {},
}: Form<Input>) => {
  const [values, setValues] = useState<FormValues<Input>>({ ...defaults });
  const [errors, setErrors] = useState<FormErrors<Input>>({});

  const onChange: FormChange<Input> = (value, name) => {
    setValues({
      ...values,
      [name]: value,
    });

    if (!errors[name]) return;

    const errorsInput = validatorHelper.one<Partial<Input>>(
      {
        ...values,
        [name]: value,
      },
      name,
      schema
    );

    setErrors(prevState => ({
      ...prevState,
      [name]: errorsInput,
    }));
  };

  const wrapChange: WrapFormChange<Input> = onChangeProp => (
    value,
    name,
    event
  ) => {
    onChange(value, name, event);
    onChangeProp(value, name, event);
  };

  const wrapSubmit: WrapFormSubmit<Input, Output> = onSubmitProp => event => {
    event.preventDefault();

    const errorsForm = validatorHelper.all<Partial<Input>>(values, schema);

    console.log(errorsForm, 'errorsForm');

    if (errorsForm) {
      setErrors(errorsForm);

      return;
    }

    if (!errorsForm) onSubmitProp(values as Output);
  };

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
