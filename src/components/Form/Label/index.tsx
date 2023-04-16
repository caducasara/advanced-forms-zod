import { LabelHTMLAttributes } from "react";

export const Label = (props: LabelHTMLAttributes<HTMLLabelElement>) => {
  return (
    <label
      className="text-sm text-zinc-600 flex items-center justify-between"
      {...props}
    />
  );
};
