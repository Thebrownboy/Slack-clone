"use server";

export default async function WorkSpace({
  params,
}: {
  params: { workspaceId: string };
}) {
  // it's recommened to await params
  const { workspaceId } = await params;
  return <div>id:{workspaceId}</div>;
}
