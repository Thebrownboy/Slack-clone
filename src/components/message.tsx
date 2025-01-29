import React from "react";
import dynamic from "next/dynamic";

const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });
interface messageProps {
  id: string;
  memberId: string;
  authorImage?: string | null;
  authorName: string | undefined | null;
  reactions: {
    value: string;
    count: number;
    membersIds: string[];
  }[];
  body: string;
  image?: string;
  updatedAt: Date | number;
  createAt: Date | number;
  threadCount: number;
  threadImage: string | null | undefined;
  threadTimestamp: number | Date;
  setEditing: boolean;
  setEditingId: (id: string | null) => void;
  isCompact: boolean;
  hideThreadButton: boolean;
  isAuthor: boolean;
}
function Message({
  id,
  isAuthor,
  memberId,
  authorName = "Meber",
  body,
  createAt,
  isCompact,
  hideThreadButton,
  reactions,
  setEditing,
  setEditingId,
  threadCount,
  threadImage,
  threadTimestamp,
  updatedAt,
  authorImage,
  image,
}: messageProps) {
  return (
    <div>
      <Renderer value={body} />
    </div>
  );
}

export default Message;
