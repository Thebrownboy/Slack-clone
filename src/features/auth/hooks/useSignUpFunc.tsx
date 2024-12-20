import { signUpValidationSchema } from "@/lib/validation-schemas";
import { onRegisterSubmit } from "@/utils/authentication";
import { useFormik } from "formik";
import { useState } from "react";

export default function useSignUpFunc() {
  const [successMsg, setSucessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };
  const onSubmit = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const response = await onRegisterSubmit(email, password);
    if (!response.success) {
      setErrorMsg(response.msg);
      setSucessMsg("");
      return;
    } else {
      setErrorMsg("");
      setSucessMsg(response.msg);
      return;
    }
  };
  const {
    isSubmitting,
    values,
    errors,
    touched,
    handleSubmit,
    handleBlur,
    handleChange,
  } = useFormik({
    initialValues,
    onSubmit,
    validationSchema: signUpValidationSchema,
  });
  return {
    successMsg,
    errorMsg,
    values,
    errors,
    touched,
    handleSubmit,
    handleBlur,
    handleChange,
    isSubmitting,
  };
}
