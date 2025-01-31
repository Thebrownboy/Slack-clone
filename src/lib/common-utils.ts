import {
  tFulldataMessage,
  tmember,
  tMessagePlaceholder,
  tUser,
} from "@/types/common-types";

const createNativeMessage = ({
  message,
  member,
  user,
  URL,
}: {
  member: tmember;
  message: tMessagePlaceholder;
  URL: string | undefined;
  user: tUser;
}) => {
  return {
    ...message,
    URL,
    member,
    user,
    reactions: [],
    threadCount: 0,
    threadImage: undefined,
    threadTimestamp: 0,
  } as tFulldataMessage;
};

export default createNativeMessage;
