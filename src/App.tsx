import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "./components/Form";
import { client } from "./lib/supabase";
import "./styles/global.css";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const createUserFormSchema = z.object({
  avatar: z
    .instanceof(FileList)
    .refine((files) => !!files.item(0), "Profile pisture is required.")
    .transform((files) => files.item(0)!)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Invalid image format."
    )
    .refine((file) => file.size <= MAX_FILE_SIZE, "Max file size is 5MB"),
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
  const createUserForm = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = createUserForm;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "techs",
  });

  async function createUser(data: CreateUserFormData) {
    await client.storage
      .from("forms-advanced")
      .upload(data.avatar?.name, data.avatar);

    console.log(data);
  }

  function addNewTech() {
    append({
      title: "",
      knowledge: 0,
    });
  }

  const userPassword = watch("password");
  const isPassWordStrong = new RegExp(
    "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
  ).test(userPassword);

  return (
    <main className="w-full h-screen flex items-center justify-center">
      <FormProvider {...createUserForm}>
        <form
          className="w-full max-w-xs flex flex-col gap-4"
          onSubmit={handleSubmit(createUser)}
        >
          <Form.Field>
            <Form.Label htmlFor="avatar">Avatar</Form.Label>
            <Form.Input name="avatar" type="file" accept="image/*" />
            <Form.Error field="avatar" />
          </Form.Field>

          <Form.Field>
            <Form.Label>Name</Form.Label>
            <Form.Input name="name" type="text" />
            <Form.Error field="name" />
          </Form.Field>

          <Form.Field>
            <Form.Label>E-mail</Form.Label>
            <Form.Input name="email" type="email" />
            <Form.Error field="email" />
          </Form.Field>

          <Form.Field>
            <Form.Label>
              Password
              {!isPassWordStrong && userPassword.length > 0 ? (
                <span className="text-xs text-red-500">
                  Not's a strong password
                </span>
              ) : (
                isPassWordStrong &&
                userPassword.length > 0 && (
                  <span className="text-xs text-emerald-600">
                    Strong password
                  </span>
                )
              )}
            </Form.Label>
            <Form.Input name="password" type="password" />
            <Form.Error field="password" />
          </Form.Field>

          <Form.Field>
            <Form.Label>
              Techs
              <button
                type="button"
                className="text-emerald-500 text-xs"
                onClick={addNewTech}
              >
                Add
              </button>
            </Form.Label>

            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <div>
                  <Form.Input name={`techs.${index}.title`} type="text" />
                  <Form.Error field={`techs.${index}.title`} />
                </div>
                <div>
                  <Form.Input name={`techs.${index}.knowledge`} type="number" />
                  <Form.Error field={`techs.${index}.knowledge`} />
                </div>
              </div>
            ))}
          </Form.Field>

          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 rounded font-semibold text-white h-10 disabled:bg-emerald-950"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Save"}
          </button>
        </form>
      </FormProvider>
    </main>
  );
}

export default App;
