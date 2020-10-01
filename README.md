## Install

```
npm install form-react-form
```

or

```
yarn add form-react-form
```

## Example

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
  });

  const onSubmit = wrapSubmit(async (values) => {});

  return (
    <form onSubmit={onSubmit}>
      <input
        name="email"
        placeholder="Email"
        value={values.email}
        onChange={onChange}
      />
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
