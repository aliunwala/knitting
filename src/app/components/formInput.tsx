import React from "react";
import {
  useController,
  UseControllerProps,
  FieldValues,
  Control,
  Path,
} from "react-hook-form";
import { TextField, TextFieldProps } from "@mui/material";

// Type for the component props
interface FormInputProps<T extends FieldValues>
  extends Omit<UseControllerProps<T>, "control"> {
  control: Control<T>;
  label: string;
  // name: keyof T & string;
  name: Path<T>;
  rules?: UseControllerProps<T>["rules"];
  defaultValue?: any;
  textFieldProps?: Omit<
    TextFieldProps,
    "name" | "value" | "onChange" | "onBlur" | "error" | "helperText"
  >;
}

/**
 * A custom input component that combines Material UI styling with react-hook-form control
 */
const FormInput = <T extends FieldValues>({
  name,
  control,
  rules = {},
  label,
  defaultValue = "",
  textFieldProps = {},
}: FormInputProps<T>): React.ReactElement => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    defaultValue,
  });

  return (
    <TextField
      {...field}
      label={label}
      error={!!error}
      helperText={error ? error.message : null}
      // fullWidth
      // variant="outlined"
      // margin="normal"

      {...textFieldProps}
    />
  );
};

export default FormInput;
