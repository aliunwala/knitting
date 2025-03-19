// import { InputAdornment, TextField } from "@mui/material";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import React from "react";
type LabeledInputProps = {
  type: string;
  value: any;
  onChange: Function;
  id: string;
  labelText?: string;
  unitOfMeasure?: string;
};

function LabeledInput({
  value,
  onChange,
  id,
  type,
  labelText,
  unitOfMeasure,
}: LabeledInputProps) {
  return (
    <>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="email">{labelText}</Label>
        <Input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={(e) => onChange(e)}
        />
      </div>
    </>
  );
}

export default LabeledInput;
