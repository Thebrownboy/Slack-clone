import { cn } from "@/lib/utils";
import { useCurrentMember } from "@/state-store/store";
import { Hint } from "./ui/hint";
import EmojiPopOver from "./emojiPopOver";
import { MdOutlineAddReaction } from "react-icons/md";

interface ReactionsProps {
  data: {
    value: string;
    count: number;
    membersIds: string[];
  }[];
  onChange: (value: string) => void;
}

export default function Reactions({ data, onChange }: ReactionsProps) {
  console.log("This is the length", data.length);
  const {
    currentMemberState: { member, loading },
  } = useCurrentMember();
  if (data.length === 0 || loading || !member) {
    return <></>;
  }
  return (
    <div className=" flex items-center gap-1 mt-1 mb-1 ">
      {data.map((reaction, index) => {
        return (
          <Hint
            key={index}
            label={`${reaction.count} ${
              reaction.count === 1 ? "person" : "people"
            } reacted with ${reaction.value}`}
          >
            <button
              onClick={() => onChange(reaction.value)}
              className={cn(
                "h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex items-center gap-x-1 ",
                reaction.membersIds.includes(member.userId) &&
                  "bg-blue-100/70 border-blue-500 text-white"
              )}
            >
              {reaction.value}{" "}
              <span
                className={cn(
                  "text-xs font-semibold text-muted-foreground ",
                  reaction.membersIds.includes(member.userId) && "text-blue-500"
                )}
              >
                {reaction.count}{" "}
              </span>
            </button>
          </Hint>
        );
      })}
      <EmojiPopOver
        hint="Add reaction "
        onEmojiSelect={(emoji) => {
          onChange(emoji.native);
        }}
      >
        <button className="h-7 px-3 rounded-full bg-slate-200/70 border border-transparent hover:border-slate-500 text-slate-800 flex items-center gap-x-1 ">
          <MdOutlineAddReaction className="size-4" />
        </button>
      </EmojiPopOver>
    </div>
  );
}
