import { useCurrentUser } from "@/state-store/user-store";

function useGetUserId() {
  const {
    userState: { user },
  } = useCurrentUser();

  return { userId: user?.id };
}

export default useGetUserId;
