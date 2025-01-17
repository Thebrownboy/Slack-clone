import { useCurrentUser } from "@/state-store/store";
import { getUser } from "@/utils/authentication";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function useGetCurrentUserData() {
  const session = useSession();
  const { updateUser, user, loading, updateLoading } = useCurrentUser(
    (state) => state
  );

  useEffect(() => {
    updateLoading(true);
    const getCurrentUser = async () => {
      try {
        const user = await getUser(session.data?.user?.id);
        console.log("I am here inside get CurrentUserdata ", user);
        updateUser(user);
        updateLoading(false);
      } catch (err) {
        updateLoading(false);
        console.log(err);
      }
    };
    getCurrentUser();
  }, [session, updateLoading, updateUser]);

  return { user, loading };
}
