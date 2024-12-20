import { signInValidationSchema } from "@/lib/validation-schemas";
import { onLoginSubmit } from "@/utils/authentication";
import { useFormik } from "formik";
import { useState } from "react";
export default function useSignInFunc() {
  const [errorMsg, updateErrorMsg] = useState("");
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
    const response = await onLoginSubmit(email, password);
    if (!response.success) {
      updateErrorMsg(response.msg);
    }
  };
  const {
    isSubmitting,
    touched,
    errors,
    handleSubmit,
    values,
    handleChange,
    handleBlur,
  } = useFormik({
    initialValues,
    validationSchema: signInValidationSchema,
    onSubmit: onSignInFormSubmit,
  });
  return {
    isSubmitting,
    errorMsg,
    touched,
    errors,
    handleSubmit,
    values,
    handleChange,
    handleBlur,
  };
}
