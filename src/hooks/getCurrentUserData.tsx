import { useCurrentUser } from "@/state-store/store";
import { getUser } from "@/utils/authentication";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function useGetCurrentUserData() {
  const session = useSession();
  console.log(session);
  const { updateUser, user, loading, updateLoading } = useCurrentUser(
    (state) => state
  );

  useEffect(() => {
    const getCurrentUser = async () => {
      updateLoading(true);
      try {
        const user = await getUser(session.data?.user?.id);
        updateUser(user);
        updateLoading(false);
      } catch (err) {
        updateLoading(false);
        console.log(err);
      }
    };
    if (!user) getCurrentUser();
  }, [session, updateLoading, updateUser, user]);

  return { user, loading };
}
