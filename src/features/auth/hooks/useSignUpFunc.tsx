import { signUpValidationSchema } from "@/lib/validation-schemas";
import { onRegisterSubmit } from "@/utils/authentication";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function useSignUpFunc() {
  const [successMsg, setSucessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const onSubmit = async ({
    email,
    password,
    name,
  }: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const response = await onRegisterSubmit(email, password, name);
    if (!response.success) {
      setErrorMsg(response.msg);
      setSucessMsg("");
      return;
    } else {
      setErrorMsg("");
      setSucessMsg(response.msg);
      router.push("/signin");
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
