"use client";
import { useSession } from "next-auth/react";
import UserButton from "@/features/auth/components/userButton";
export default function Home() {
  const session = useSession();
  return (
    <div>
      {JSON.stringify(session)}
      <UserButton />
    </div>
  );
}
