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
import { SignInFlow } from "../types";
import Socials from "./Socials";

function SignInCard({ setState }: { setState: (state: SignInFlow) => void }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
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

          <Button type="submit" className="w-full" size="lg" disabled={false}>
            {" "}
            continue{" "}
          </Button>
        </form>
        <Separator />
        <Socials />
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setState("signUp")}
          >
            Sign Up
          </span>
        </p>
      </CardContent>
    </Card>
  );
}

export default SignInCard;
