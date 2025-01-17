import { auth } from "@/auth";
import UserButton from "@/features/auth/components/userButton";

export default async function Home() {
  const session = await auth();
  return (
    <div>
      {JSON.stringify(session)}
      <UserButton />
    </div>
  );
}
