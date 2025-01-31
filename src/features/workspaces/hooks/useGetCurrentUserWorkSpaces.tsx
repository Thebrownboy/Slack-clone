import useGetUserId from "@/hooks/useGetUserId";
import { tWorkspace } from "@/types/common-types";
import { getAllWorkSpacesOfUserAction } from "@/utils/workspaces-actions";
import { useEffect, useState } from "react";

export default function useGetCurrentUserWorkSpaces() {
  const { userId } = useGetUserId();
  const [fetching, updateFetching] = useState(true);
  const [userWorkSpaces, updateUserWorkSpaces] = useState<tWorkspace[] | null>(
    null
  );

  useEffect(() => {
    const getAllWorkSpacesForUser = async () => {
      // user id will not be null , cuz I will not call this function if it does not exist
      const allWorkSpaces = await getAllWorkSpacesOfUserAction(
        userId as string
      );
      updateUserWorkSpaces(allWorkSpaces);
      updateFetching(false);
    };
    if (userId) getAllWorkSpacesForUser();
  }, [userId]);

  return { userWorkSpaces, isFetching: fetching };
}
