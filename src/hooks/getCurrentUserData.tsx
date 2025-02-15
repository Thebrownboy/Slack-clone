import { useCurrentUser } from "@/state-store/user-store";
import { getUser } from "@/utils/authentication";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function useGetCurrentUserData() {
  const session = useSession();

  const { updateState, userState } = useCurrentUser();
  useEffect(() => {
    const getCurrentUser = async () => {
      // whether the user is null or actual user , you will update the state with these values
      const user = await getUser(session.data?.user?.id);
      updateState({
        loading: false,
        user,
      });
    };
    if (!userState.user) getCurrentUser();
    else {
      if (userState.loading)
        updateState({ loading: false, user: userState.user });
    }
  }, [session, updateState, userState]);

  return { user: userState.user, loading: userState.loading };
}
