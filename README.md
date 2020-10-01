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
  username: string;
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
        name="username"
        placeholder="Username"
        value={values.username}
        errors={errors.username}
        onChange={onChange}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={values.password}
        errors={errors.password}
        onChange={onChange}
      />
      <button>Login</button>
    </form>
  );
};
```
