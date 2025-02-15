import dynamic from "next/dynamic";
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });
// import Editor from "@/components/editor";
import { useRef, useState } from "react";
import type Quill from "quill";
import useCreateMessage from "@/features/messages/hooks/useCreateMessage";
import {
  triggerMessageEvent,
  uploadImageAction,
} from "@/utils/messages-actions";
import createNativeMessage from "@/lib/common-utils";
import { useCurrentMember } from "@/state-store/member-store";
import { useCurrentUser } from "@/state-store/user-store";
// quills does not working correclty with the server-side rendering
// even if the component is a client componet , but next will render it once on the server
// so we should have some work-around

interface ChantInputProps {
  placeholder: string;
  conversationId?: string;
}

export default function ChatInput({
  placeholder,
  conversationId,
}: ChantInputProps) {
  // we will control the editor component by outer refs , not by passing new props

  const editorRef = useRef<Quill | null>(null);
  const [editorKey, updateEditorKey] = useState(0);
  const { handleSubmit: createMessage, loading } = useCreateMessage();
  const {
    currentMemberState: { member },
  } = useCurrentMember();
  const {
    userState: { user },
  } = useCurrentUser();
  // forcing the editor to re-render trick
  const handleSubmit = async ({
    body,
    images,
  }: {
    body: string;
    images?: File[] | null;
  }) => {
    editorRef?.current?.enable(false);
    const uploadedImage = await uploadImageAction(images?.[0] || null);
    let imageId = undefined;
    if (uploadedImage) {
      imageId = uploadedImage.id;
    }
    const { message } = await createMessage(
      body,
      imageId,
      undefined,
      conversationId
    );
    updateEditorKey((prev) => prev + 1);
    editorRef?.current?.enable(true);
    if (message && member && user) {
      const messageObject = createNativeMessage({
        message,
        member,
        user,
        URL: uploadedImage?.URL,
      });
      // addNewMessage(messageObject);

      triggerMessageEvent(messageObject);
    }
  };
  return (
    <div className=" px-5 w-full">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSumbit={handleSubmit}
        disabled={loading}
        innerRef={editorRef}
        variant="create"
      />
    </div>
  );
}
