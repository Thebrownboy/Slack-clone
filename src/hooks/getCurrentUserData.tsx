import { tUser } from "@/types/common-types";
import { getUser } from "@/utils/authentication";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function useGetCurrentUserData() {
  const session = useSession();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<tUser | null>(null);
  useEffect(() => {
    setLoading(true);
    const getCurrentUser = async () => {
      try {
        const user = await getUser(session.data?.user?.id);
        setUser(user);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };
    getCurrentUser();
  }, [session]);

  return { user, loading };
}
