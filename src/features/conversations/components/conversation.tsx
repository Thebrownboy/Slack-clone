import useGetMessages from "@/features/messages/hooks/useGetMessages";
import { useCurrentMember } from "@/state-store/store";
import useGetConversationMessage from "../hooks/useGetConversationMessages";
import ChannelHeader from "@/app/(protected)/workspace/[workspaceId]/channel/[channelId]/_components/channelHeader";
import ConversationHeader from "./conversationHeader";
import useGetFullCurrentMember from "../hooks/useGetFullCurrentMember";
import useGetMemberId from "@/hooks/useGetMemberId";

interface ConversationProps {
  conversationId: string;
}

export function Conversation({ conversationId }: ConversationProps) {
  const { memberId } = useGetMemberId();
  const { fullMember } = useGetFullCurrentMember(memberId);
  const { conversationMessages } = useGetConversationMessage(conversationId);
  return (
    <div className=" flex flex-col h-full ">
      <ConversationHeader
        memberImage={fullMember?.image}
        memberName={fullMember?.name}
        onClick={() => {}}
      />
    </div>
  );
}
