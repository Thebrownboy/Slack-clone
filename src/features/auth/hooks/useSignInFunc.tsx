import { signInValidationSchema } from "@/lib/validation-schemas";
import { useFormik } from "formik";
export default function useSignInFunc() {
  const initialValues = {
    email: "",
    password: "",
  };
  const onSignInFormSubmit = async ({
    password,
    email,
  }: {
    password: string;
    email: string;
  }) => {
    console.log(email, password);
  };
  const { touched, errors, handleSubmit, values, handleChange, handleBlur } =
    useFormik({
      initialValues,
      validationSchema: signInValidationSchema,
      onSubmit: onSignInFormSubmit,
    });
  return { touched, errors, handleSubmit, values, handleChange, handleBlur };
}
