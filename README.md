[![size](https://img.shields.io/bundlephobia/minzip/form-react-form)](https://bundlephobia.com/result?p=form-react-form)
[![npm version](https://img.shields.io/npm/v/form-react-form.svg)](https://www.npmjs.com/package/form-react-form)
[![npm downloads](https://img.shields.io/npm/dt/form-react-form.svg)](https://www.npmjs.com/package/form-react-form)
[![license](https://img.shields.io/npm/l/form-react-form)](https://github.com/form-react-form/form-react-form/blob/master/LICENSE)

## Install

```
npm install form-react-form
```

or

```
yarn add form-react-form
```

## Usage

```tsx
import React, { FC } from "react";
import { useForm } from "form-react-form";

import schema from "./schema";

export interface FormInput {
  email: string;
  password: string;
}

const Form: FC = () => {
  const { values, errors, onChange, wrapSubmit } = useForm<FormInput>({
    schema,
    defaults: {
      email: "",
      password: "",
    },
  });

  const onSubmit = wrapSubmit(async (values) => {});

  return (
    <form onSubmit={onSubmit}>
      <input name="email" placeholder="Email" value={values.email} onChange={onChange} />
      {errors.email && <span>{errors.email[0]}</span>}

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={values.password}
        onChange={onChange}
      />
      {errors.password && <span>{errors.password[0]}</span>}

      <button>Login</button>
    </form>
  );
};
```

Using [fastest-validator](https://github.com/icebob/fastest-validator) under the hood for schema validation.

```tsx
export default {
  email: {
    type: "string",
    email: true,
    empty: false,
    min: 2,
    max: 255,
  },
  password: {
    type: "string",
    empty: false,
    min: 8,
    max: 64,
  },
};
```

### API

```tsx
const { values, errors, setValues, setErrors, onChange, wrapChange, wrapSubmit } = useForm(options);
```

#### Return

| Name         | Input/Output                                                                        | Description                                                                                                   |
| ------------ | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `values`     | { [name]: value }                                                                   | Object containing values of each input by name.                                                               |
| `errors`     | { [name]: string[] }                                                                | Object containing errors of each input by name.                                                               |
| `onChange`   | `(event) => void` <br/> `(value, name) => void` <br/> `({ [name]: value }) => void` | Function that handles input changes.                                                                          |
| `wrapChange` | `(onChange) => void`                                                                | Wrapper function to have custom control over input change before value gets passed to `useForm` for handling. |
| `wrapSubmit` | `((values) => void) => void`                                                        | Wrapper function to have custom control over input change before value gets passed to `useForm` for handling. |
| `setValues`  | `({ [name]: value }) => void`                                                       | Function to update values.                                                                                    |
| `setErrors`  | `({ [name]: string[] }) => void`                                                    | Function to update errors. Commonly used in `wrapSubmit` to set errors sent from server.                      |

#### Options

- `defaults?`: Object containing input defualt values. When not provided, initial value for each input will be `undefined` sometimes making [inputs uncontrolled](https://github.com/icebob/fastest-validator). To avoid that, it is recomended to set `defaults`, `defaultValue` on html inputs or set default `value` paramater on custom components.
- `schema`: Valid schema for [fastest-validator](https://github.com/icebob/fastest-validator).

## Typescript

When using forms with different input and output values you should also provide `FormOutput` types because `fastest-validator` can't convert them using schema.

```tsx
// ...

export interface FormInput {
  age: string;
}

export interface FormOutput {
  age: number;
}

const Form: FC = () => {
  const { values, onChange, wrapSubmit } = useForm<FormInput, FormOutput>({
    schema,
    defaults: {
      age: "",
    },
  });

  const onSubmit = wrapSubmit(async (values) => {});

  return (
    <form onSubmit={onSubmit}>
      <input name="age" placeholder="Age" value={values.age} onChange={onChange} />

      <button>Set</button>
    </form>
  );
};
```
