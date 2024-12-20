"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-separator";
import React from "react";
import Socials from "./Socials";
import Link from "next/link";
import useSignUpFunc from "../hooks/useSignUpFunc";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function SignUpCard({}) {
  const [passwordShown, setPasswordShown] = React.useState(false);

  const { errors, values, handleBlur, handleChange, handleSubmit, touched } =
    useSignUpFunc();
  return (
    <Card className="w-full h-full p-8 max-w-[342px]">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Sign up to continue</CardTitle>
        <CardDescription>
          {" "}
          Use you email or another service to continue{" "}
        </CardDescription>
      </CardHeader>

      <CardContent className="  space-y-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={handleSubmit}>
          <div>
            <Input
              disabled={false}
              value={values.email}
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="Email"
              type="email"
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
            <div className=" space-y-2">
              <Input
                disabled={false}
                value={values.password}
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                required
                placeholder="password"
                type={passwordShown ? "text" : "password"}
              />
              <p className="text-red-600 text-[10px]">
                {touched.password && errors.password}
              </p>
            </div>
          </div>
          <div className=" space-y-2">
            <Input
              disabled={false}
              value={values.confirmPassword}
              name="confirmPassword"
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="confirm password"
              type={passwordShown ? "text" : "password"}
            />
            <p className="text-red-600 text-[10px]">
              {touched.confirmPassword && errors.confirmPassword}
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
          Already have an account?{" "}
          <Link href={"/auth/signin"}>
            <span
              className="text-sky-700 hover:underline cursor-pointer"
              onClick={() => {}}
            >
              Sign In
            </span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default SignUpCard;
