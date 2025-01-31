import { useParams } from "next/navigation";

export default function useGetChannelId() {
  const { channelId } = useParams();

  return { channelId };
}
