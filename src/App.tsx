import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import "./styles/global.css";

const createUserFormSchema = z.object({
  name: z
    .string()
    .nonempty("Name is required.")
    .transform((name) => {
      return name
        .split(" ")
        .map((name) => {
          return name[0].toLocaleUpperCase().concat(name.substring(1));
        })
        .join(" ");
    }),
  email: z
    .string()
    .nonempty("E-mail is required")
    .email("E-mail format incorrect.")
    .refine((email) => {
      return email.endsWith("@gmail.com.br");
    }, "E-mail required end with @gmail.com.br"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Min 8 characters required"),
  techs: z
    .array(
      z.object({
        title: z.string().nonempty("Title is required."),
        knowledge: z.coerce
          .number()
          .min(0, "Min rate is O")
          .max(10, "Max rate is 10"),
      })
    )
    .min(2, "Insert at least 2 teachnologies."),
});

type CreateUserFormData = z.infer<typeof createUserFormSchema>;

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "techs",
  });

  function createUser(data: CreateUserFormData) {
    console.log(data);
  }

  function addNewTech() {
    append({
      title: "",
      knowledge: 0,
    });
  }

  return (
    <main className="w-full h-screen flex items-center justify-center">
      <form
        className="w-full max-w-xs flex flex-col gap-4"
        onSubmit={handleSubmit(createUser)}
      >
        <div className="flex flex-col gap-1">
          <label>Name</label>
          <input
            type="text"
            className="w-full h-10 rounded px-3 shadow-sm border border-zinc-600"
            {...register("name")}
          />
          {errors.name && <span>{errors.name.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label>E-mail</label>
          <input
            type="email"
            className="w-full h-10 rounded px-3 shadow-sm border border-zinc-600"
            {...register("email")}
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label>Password</label>
          <input
            type="password"
            className="w-full h-10 rounded px-3 shadow-sm border border-zinc-600"
            {...register("password")}
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="flex items-center justify-between">
            Techs
            <button
              type="button"
              className="text-emerald-500 text-xs"
              onClick={addNewTech}
            >
              Add
            </button>
          </label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <div>
                <input
                  type="text"
                  className="w-full h-10 rounded px-3 shadow-sm border border-zinc-600"
                  {...register(`techs.${index}.title`)}
                />
                {errors.techs?.[index]?.title && (
                  <span>{errors.techs?.[index]?.title?.message}</span>
                )}
              </div>
              <div>
                <input
                  type="number"
                  className="w-full h-10 rounded px-3 shadow-sm border border-zinc-600"
                  {...register(`techs.${index}.knowledge`)}
                />
                {errors.techs?.[index]?.knowledge && (
                  <span>{errors.techs?.[index]?.knowledge?.message}</span>
                )}
              </div>
            </div>
          ))}
          {errors.techs && <span>{errors.techs.message}</span>}
        </div>

        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 rounded font-semibold text-white h-10"
        >
          Save
        </button>
      </form>
    </main>
  );
}

export default App;
