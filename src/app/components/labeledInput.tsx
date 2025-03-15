import React from "react";
type LabeledInputProps = {
  type: string;
  value: any;
  onChange: Function;
  id: string;
  labelText: string;
};

function LabeledInput({
  value,
  onChange,
  id,
  type,
  labelText,
}: LabeledInputProps) {
  return (
    <>
      <label className="text-lg font-medium " htmlFor={id}>
        {labelText}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e)}
        className="outline-solid outline outline-blue-500"
      ></input>
    </>
  );
}

export default LabeledInput;
