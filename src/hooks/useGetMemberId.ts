import { useParams } from "next/navigation";

export default function useGetMemberId() {
  const { memberId } = useParams();
  return { memberId };
}
