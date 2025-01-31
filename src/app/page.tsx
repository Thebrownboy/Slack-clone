"use server";
import UserButton from "@/features/auth/components/userButton";
import Link from "next/link";

export default async function Home() {
  // you can initialize the store from a server componet because you can initialzie the store of zustand
  // outside a react client component
  // useCurrentUser.setState({
  //   userState: {
  //     loading: false,
  //     user: session?.user,
  //   },
  // });
  return (
    <div>
      <Link href={"/workspace/cm5tjkucy0007usi4bik199kw"}>
        {" "}
        go to workspace
      </Link>
      <UserButton />
    </div>
  );
}
