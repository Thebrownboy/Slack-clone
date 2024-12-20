"use server";
// you should use "server" mode  because it's a function it's not a component
// so it will not be a server side by default because you used it in  a client component
// so server only will raise an error , but using "server" mode will make it server side
import "server-only";
import { addNewUser, findUserByEmail } from "./database";

export async function onRegisterSubmit(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (user) {
    return {
      success: false,
      msg: "User already exists",
    };
  }
  const { success } = await addNewUser(email, password);
  if (success) {
    return {
      success: true,
      msg: "User created successfully",
    };
  }
  return {
    success: false,
    msg: "User creation failed",
  };

  // TODO: add email verification after adding the user
}
