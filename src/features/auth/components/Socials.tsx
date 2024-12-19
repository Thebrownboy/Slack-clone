"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
function Socials() {
  return (
    <div className="flex flex-col gap-y-2">
      <Button
        disabled={false}
        onClick={() => {
          signIn("google");
        }}
        variant={"outline"}
        size={"lg"}
        className="w-full relative"
      >
        <FcGoogle className="size-5 absolute top-2.5 left-2.5" />
        Continue with Google
      </Button>

      <Button
        disabled={false}
        onClick={() => {
          signIn("github");
        }}
        variant={"outline"}
        size={"lg"}
        className="w-full relative"
      >
        <FaGithub className="size-5 absolute top-2.5 left-2.5" />
        Continue with Githhub
      </Button>
    </div>
  );
}

export default Socials;
