import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
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
import { SignInFlow } from "../types";

function SignUpCard({ setState }: { setState: (state: SignInFlow) => void }) {
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
        <div className="flex flex-col gap-y-2">
          <Button
            disabled={false}
            onClick={() => {}}
            variant={"outline"}
            size={"lg"}
            className="w-full relative"
          >
            <FcGoogle className="size-5 absolute top-2.5 left-2.5" />
            Continue with Google
          </Button>

          <Button
            disabled={false}
            onClick={() => {}}
            variant={"outline"}
            size={"lg"}
            className="w-full relative"
          >
            <FaGithub className="size-5 absolute top-2.5 left-2.5" />
            Continue with Githhub
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setState("signIn")}
          >
            Sign In
          </span>
        </p>
      </CardContent>
    </Card>
  );
}

export default SignUpCard;
