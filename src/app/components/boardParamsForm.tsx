"use client";
// import Test1 from "../components/test1";

import { object, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Zod form validation schema
export const formSchemaBoardParams = z.object({
  stichesPerInch: z.coerce.number().min(1).max(25),
  rowsPerInch: z.coerce.number().min(1).max(25),
  projectWidth: z.coerce.number().min(1).max(25),
  projectHeight: z.coerce.number().min(1).max(25),
});

// List of all unique IDs for the form
const inputNames = [
  "stichesPerInch",
  "rowsPerInch",
  "projectWidth",
  "projectHeight",
] as const;

//Defines rows for the inputs
const inputNamesStructure = [
  ["stichesPerInch", "rowsPerInch"],
  ["projectWidth", "projectHeight"],
] as const;

// Default values to fill the form with

// Used for additional labels/descriptors that the form could use (after/before input)
const inputAdornment = {
  stichesPerInch: {
    FormDescription: undefined,
    FormLabel: "Sitches Per inch (left-right):",
  },
  rowsPerInch: {
    FormDescription: undefined,
    FormLabel: "Rows Per inch (up-down)",
  },
  projectWidth: {
    FormDescription: undefined,
    FormLabel: "Project Width (left-right):",
  },
  projectHeight: {
    FormDescription: undefined,
    FormLabel: "Project Height (up-down):",
  },
};

// Need for passing an onSubmit function to the form
interface BoardParamsFormProps {
  onSubmit: (values: z.infer<typeof formSchemaBoardParams>) => void;
  defaultValues: z.infer<typeof formSchemaBoardParams>;
}

// This function is somewhat reusable now
export default function BoardParamsForm({
  onSubmit,
  defaultValues,
}: BoardParamsFormProps) {
  const form = useForm<z.infer<typeof formSchemaBoardParams>>({
    resolver: zodResolver(formSchemaBoardParams),
    defaultValues: defaultValues,
  });

  const showFormDesc = (value: keyof typeof inputAdornment) =>
    inputAdornment[value as keyof typeof inputAdornment].FormDescription !==
    null;
  const formDescValue = (value: keyof typeof inputAdornment) =>
    inputAdornment[value as keyof typeof inputAdornment].FormDescription;
  const showFormLabel = (value: keyof typeof inputAdornment) =>
    inputAdornment[value as keyof typeof inputAdornment].FormLabel !== null;
  const formLabelValue = (value: keyof typeof inputAdornment) =>
    inputAdornment[value as keyof typeof inputAdornment].FormLabel;

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {inputNamesStructure.map((row, rowIndex) => {
            return (
              <div
                className="flex gap-2 m-0 items-baseline mb-3"
                key={rowIndex + "_" + "formRow"}
              >
                {row.map((value, index) => {
                  return (
                    <div
                      key={index + "_" + "formInput"}
                      className="max-w-[203px]"
                    >
                      <FormField
                        control={form.control}
                        name={value}
                        render={({ field }) => (
                          <FormItem>
                            {showFormLabel(value) && (
                              <FormLabel>{formLabelValue(value)}</FormLabel>
                            )}
                            <FormControl>
                              <Input placeholder={value} {...field} />
                            </FormControl>
                            {showFormDesc(value) && (
                              <FormDescription>
                                {formDescValue(value)}
                              </FormDescription>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
