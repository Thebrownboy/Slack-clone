"use server";

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
    <div className=" bg-[#481349] w-full h-full">
      <h1 className="text-6xl text-white">👋 Welcome back </h1>
    </div>
  );
}
