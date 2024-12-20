import { signUpValidationSchema } from "@/lib/validation-schemas";
import { useFormik } from "formik";

export default function useSignUpFunc() {
  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };
  const onSubmit = ({
    email,
    password,
    confirmPassword,
  }: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    console.log(email, password, confirmPassword);
  };
  const { values, errors, touched, handleSubmit, handleBlur, handleChange } =
    useFormik({
      initialValues,
      onSubmit,
      validationSchema: signUpValidationSchema,
    });
  return { values, errors, touched, handleSubmit, handleBlur, handleChange };
}
