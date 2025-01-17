import { useCurrentUser } from "@/state-store/store";
import { getUser } from "@/utils/authentication";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function useGetCurrentUserData() {
  const session = useSession();
  const { updateState, userState } = useCurrentUser((state) => state);
  console.log("I will render ");
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const user = await getUser(session.data?.user?.id);
        updateState({ loading: false, user });
      } catch (err) {
        updateState({ ...userState, loading: false });
        console.log(err);
      }
    };
    if (!userState.user) getCurrentUser();
  }, [session, updateState, userState, userState.user, userState.loading]);

  return { user: userState.user, loading: userState.loading };
}
