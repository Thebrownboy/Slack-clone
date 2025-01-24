import { tWorkspace } from "@/types/common-types";
import { getAllWorkSpacesOfUserAction } from "@/utils/workspaces-actions";
import { useEffect, useState } from "react";

export default function useGetCurrentUserWorkSpaces(userId: string) {
  const [fetching, updateFetching] = useState(true);
  const [userWorkSpaces, updateUserWorkSpaces] = useState<tWorkspace[] | null>(
    null
  );

  useEffect(() => {
    const getAllWorkSpacesForUser = async () => {
      const allWorkSpaces = await getAllWorkSpacesOfUserAction(userId);
      updateUserWorkSpaces(allWorkSpaces);
      updateFetching(false);
    };
    if (userId) getAllWorkSpacesForUser();
  }, [userId]);

  return { userWorkSpaces, isFetching: fetching };
}
