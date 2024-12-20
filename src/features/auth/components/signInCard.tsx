"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-separator";
import React from "react";
import Socials from "./Socials";
import Link from "next/link";
import useSignInFunc from "../hooks/useSignInFunc";

function SignInCard({}) {
  const [passwordShown, setPasswordShown] = React.useState(false);
  const { touched, handleSubmit, values, handleBlur, handleChange, errors } =
    useSignInFunc();
  console.log(errors);
  return (
    <Card className="w-full h-full p-8 max-w-[342px]">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          {" "}
          Use you email or another service to continue{" "}
        </CardDescription>
      </CardHeader>

      <CardContent className="  space-y-5 px-0 pb-0">
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div className="space-y-2">
            <Input
              disabled={false}
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="Email"
              type="email"
              name="email"
            />
            <p className="text-red-600 text-[10px]">
              {touched.email && errors.email}
            </p>
          </div>
          <div className="relative">
            {!passwordShown && (
              <FaEye
                className=" absolute top-3 right-2"
                onClick={() => {
                  setPasswordShown(!passwordShown);
                }}
              />
            )}
            {passwordShown && (
              <FaEyeSlash
                className=" absolute top-3 right-2"
                onClick={() => {
                  setPasswordShown(!passwordShown);
                }}
              />
            )}
            <Input
              disabled={false}
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              name="password"
              required
              placeholder="password"
              type={passwordShown ? "text" : "password"}
              className="pb-2"
            />
            <p className="text-red-600 text-[10px]">
              {touched.password && errors.password}
            </p>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={false}>
            {" "}
            continue{" "}
          </Button>
        </form>
        <Separator />
        <Socials />
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href={"/auth/signup"}>
            <span
              className="text-sky-700 hover:underline cursor-pointer"
              onClick={() => {}}
            >
              Sign Up
            </span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default SignInCard;
