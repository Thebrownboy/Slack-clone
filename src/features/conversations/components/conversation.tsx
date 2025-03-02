import useGetConversationMessage from "../hooks/useGetConversationMessages";
import ConversationHeader from "./conversationHeader";
import useGetFullCurrentMember from "../hooks/useGetFullCurrentMember";
import useGetMemberId from "@/hooks/useGetMemberId";
import ChatInput from "@/app/(protected)/workspace/[workspaceId]/channel/[channelId]/_components/chatInput";
import MessagesList from "@/components/messagesList";
import usePusher from "@/features/channels/hooks/usePusher";
import { useCurrentMemberProfile } from "@/state-store/member-profile.store";

interface ConversationProps {
  conversationId: string;
}

export function Conversation({ conversationId }: ConversationProps) {
  const { memberId } = useGetMemberId();
  const { fullMember } = useGetFullCurrentMember(memberId as string);
  usePusher();
  const { updateCurrentMemberProfileId } = useCurrentMemberProfile();

  const { getMoreMessages, getMore, noMore, currentConversationMessages } =
    useGetConversationMessage(conversationId);
  if (!fullMember) return <div></div>;

  return (
    <div className=" flex flex-col h-full ">
      <ConversationHeader
        memberImage={fullMember?.image}
        memberName={fullMember?.name}
        onClick={() => {
          updateCurrentMemberProfileId(memberId as string);
        }}
      />
      <MessagesList
        conversationId={conversationId}
        data={currentConversationMessages?.messages || undefined}
        variant="conversation"
        memberImage={fullMember.image || undefined}
        memberName={fullMember.name || undefined}
        canLoadMore={!noMore}
        loadMore={getMoreMessages}
        isLoadingMore={getMore}
      />

      <ChatInput
        conversationId={conversationId}
        placeholder={`Message ${fullMember?.name}`}
      />
    </div>
  );
}
