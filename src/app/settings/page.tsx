"use client";
import { useSession } from "next-auth/react";

import React from "react";
import { signOut } from "next-auth/react";
export default function Settings() {
  const session = useSession();
  return (
    <div>
      {JSON.stringify(session)}
      <button onClick={() => signOut()}>sign out </button>
    </div>
  );
}
