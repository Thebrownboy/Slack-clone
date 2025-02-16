"use server";

import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { tWorkspaceMembers } from "@/types/common-types";
import { getWorkspaceMembersAction } from "@/utils/members-actions";
import { getAllWorkSpacesOfUserAction } from "@/utils/workspaces-actions";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  const workspaces = await getAllWorkSpacesOfUserAction(
    session?.user?.id || ""
  );
  if (workspaces?.length === 0) {
    redirect("/create-workspace");
  }

  const members: tWorkspaceMembers[][] | null = [];
  if (workspaces) {
    for (let i = 0; i < workspaces?.length; i++) {
      const response = await getWorkspaceMembersAction(
        workspaces[i].id,
        session?.user?.id || ""
      );
      if (response) {
        members[i] = response;
        workspaces[i] = { ...workspaces[i] };
      }
    }
  }
  return (
    <div className=" bg-[#481349] w-full min-h-full p-10">
      <h1 className="text-6xl text-white">👋 Welcome back </h1>
      <div className=" rounded-xl border-4 border-[#6D4876] mt-10">
        <div className="rounded-t-xl header p-5 bg-[#ECDEEC]">
          <p className=" text-3xl">Workspaces for {session?.user?.email}</p>
        </div>
        {workspaces?.map((workspace, index) => {
          return (
            <div
              key={index}
              className=" bg-white justify-between px-5 flex items-center py-3 border-b-2 "
            >
              <div className=" flex items-center">
                <div className=" text-6xl p-3">
                  {workspace.name[0].toUpperCase()}
                </div>
                <div className=" flex flex-col">
                  <p className=" text-xl">{workspace.name}</p>
                  <div className=" flex  items-center gap-2">
                    <div className=" flex ">
                      {members[index].slice(0, 5).map((item, index) => {
                        const avatarFallback = item.user.name
                          ? item.user.name.charAt(0).toUpperCase()
                          : "M";

                        return (
                          <Avatar
                            key={index}
                            className="size-5 rounded-md mr-1"
                          >
                            <AvatarImage
                              className="rounded-md"
                              src={item.user.image || undefined}
                            />
                            <AvatarFallback className=" rounded-md bg-sky-500 text-white ">
                              {avatarFallback}
                            </AvatarFallback>
                          </Avatar>
                        );
                      })}
                    </div>
                    <p>{members[index] ? members[index].length : 0} members</p>
                  </div>
                </div>
              </div>
              <Link
                href={`/workspace/${workspace.id}`}
                className=" bg-[#481A54] text-white text-xl p-3 rounded-lg"
              >
                <p>Go to workspace </p>
              </Link>
            </div>
          );
        })}
      </div>
      <div className="my-10 flex bg-white p-8 items-center rounded-xl justify-between ">
        <p className=" text-xl">Want to create your own team? </p>
        <Link href={"/create-workspace"}>
          <button className=" font-bold hover:scale-105 transition-all uppercase border-2 rounded-xl p-5 text-[#481A54] border-[#481A54]">
            creaet a new workspace
          </button>
        </Link>
      </div>
    </div>
  );
}
