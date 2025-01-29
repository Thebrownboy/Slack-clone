import { MessageSquareTextIcon, Pencil, SmileIcon, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Hint } from "./ui/hint";
import EmojiPopOver from "./emojiPopOver";

interface ToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  hideThreadButton: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleReaction: (emoji: any) => void;
}

export default function Toolbar({
  handleDelete,
  handleEdit,
  handleReaction,
  handleThread,
  hideThreadButton,
  isAuthor,
  isPending,
}: ToolbarProps) {
  return (
    <div className=" absolute top-0 right-5">
      <div className=" group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
        <EmojiPopOver
          hint="Add reaction"
          onEmojiSelect={(emoji) => handleReaction(emoji.native)}
        >
          <Button variant={"ghost"} size={"iconSm"} disabled={isPending}>
            <SmileIcon className="size-4" />
          </Button>
        </EmojiPopOver>

        {!hideThreadButton && (
          <Hint label="Reply on thread">
            <Button
              variant={"ghost"}
              onClick={handleThread}
              size={"iconSm"}
              disabled={isPending}
            >
              <MessageSquareTextIcon className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <>
            <Hint label="Edit Message">
              <Button
                variant={"ghost"}
                size={"iconSm"}
                disabled={isPending}
                onClick={handleEdit}
              >
                <Pencil className="size-4" />
              </Button>
            </Hint>
            <Hint label="Delete Message">
              <Button
                variant={"ghost"}
                onClick={handleDelete}
                size={"iconSm"}
                disabled={isPending}
              >
                <Trash className="size-4" />
              </Button>
            </Hint>
          </>
        )}
      </div>
    </div>
  );
}
