import { useCurrentUser } from "@/state-store/store";
import { tWorkspace } from "@/types/common-types";
import { getAllWorkSpacesOfUserAction } from "@/utils/workspaces-actions";
import { useEffect, useState } from "react";

export default function useGetCurrentUserWorkSpaces() {
  const {
    userState: { user },
  } = useCurrentUser();
  const [fetching, updateFetching] = useState(true);
  const [userWorkSpaces, updateUserWorkSpaces] = useState<tWorkspace[] | null>(
    null
  );

  useEffect(() => {
    const getAllWorkSpacesForUser = async () => {
      // user id will not be null , cuz I will not call this function if it does not exist
      const allWorkSpaces = await getAllWorkSpacesOfUserAction(
        user?.id as string
      );
      updateUserWorkSpaces(allWorkSpaces);
      updateFetching(false);
    };
    if (user && user.id) getAllWorkSpacesForUser();
  }, [user]);

  return { userWorkSpaces, isFetching: fetching };
}
