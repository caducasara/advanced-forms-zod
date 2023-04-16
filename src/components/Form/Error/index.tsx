import { useFormContext } from "react-hook-form";

interface ErrorPrps {
  field: string;
}

function getError(obj: Record<any, any>, path: string) {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce(
        (res, key) => (res !== null && res !== undefined ? res[key] : res),
        obj
      );

  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);

  return result;
}

export const Error = (props: ErrorPrps) => {
  const {
    formState: { errors },
  } = useFormContext();

  const fieldError = getError(errors, props.field);

  if (!fieldError) {
    return null;
  }

  return <span className="text-red-600">{fieldError.message?.toString()}</span>;
};
