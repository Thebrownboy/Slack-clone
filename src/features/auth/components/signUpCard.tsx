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

function SignUpCard({}) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Sign up to continue</CardTitle>
        <CardDescription>
          {" "}
          Use you email or another service to continue{" "}
        </CardDescription>
      </CardHeader>

      <CardContent className="  space-y-5 px-0 pb-0">
        <form className="space-y-2.5">
          <Input
            disabled={false}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            required
            placeholder="Email"
            type="email"
          />

          <Input
            disabled={false}
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            required
            placeholder="password"
            type="password"
          />

          <Input
            disabled={false}
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
            }}
            required
            placeholder="confirm password"
            type="password"
          />

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
