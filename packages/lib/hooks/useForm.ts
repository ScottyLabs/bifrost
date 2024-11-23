import type { UseFormProps } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as useReactHookForm } from "react-hook-form";

export function useForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
    schema: TSchema;
  },
) {
  const form = useReactHookForm<TSchema["_input"]>({
    ...props,
    resolver: zodResolver(props.schema, undefined),
    mode: "onChange",
  });

  return form;
}

export default useForm;
