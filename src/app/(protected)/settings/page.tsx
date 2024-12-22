"use client";
import UserButton from "@/features/auth/components/userButton";
import { useSession } from "next-auth/react";
import React from "react";

export default function Settings() {
  const session = useSession();
  return (
    <div className="flex flex-col">
      <div>{JSON.stringify(session)}</div>
      <UserButton />
    </div>
  );
}
