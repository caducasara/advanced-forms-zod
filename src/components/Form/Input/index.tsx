import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

export const Input = (props: InputProps) => {
  const { register } = useFormContext();

  return (
    <input
      id={props.name}
      {...props}
      className="w-full h-10 rounded px-3 shadow-sm border border-zinc-600"
      {...register(props.name)}
    />
  );
};
