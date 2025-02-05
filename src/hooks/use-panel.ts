import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function usePanel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [previousSize, updatePreviousSize] = useState(0);
  const [parentMessageId, updateParentMessageId] = useState<string | null>("");
  const [parentMessageIndex, updateParentMessageIndex] = useState<
    string | null
  >("");
  useEffect(() => {
    if (searchParams.size === previousSize) return;
    if (
      searchParams.get("parentMessageId") &&
      searchParams.get("parentMessageIndex")
    ) {
      // do something
      const parentId = searchParams.get("parentMessageId");
      const parentIndex = searchParams.get("parentMessageIndex");
      updateParentMessageId(parentId);
      updateParentMessageIndex(parentIndex);
      updatePreviousSize(2);
    } else {
      updateParentMessageId(null);
      updateParentMessageIndex(null);
      updatePreviousSize(0);
    }
  }, [searchParams, previousSize]);

  const onOpenMessage = (messageId: string, messageIndex: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("parentMessageId", messageId);
    params.set("parentMessageIndex", messageIndex);

    router.push(pathname + "?" + params.toString());
  };

  const onCloseMessage = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("parentMessageId");
    params.delete("parentMessageIndex");
    router.push(pathname + "?" + params.toString());
  };

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(pathname + "?" + params.toString());
  };
  return {
    parentMessageId,
    onCloseMessage,
    onOpenMessage,
    parentMessageIndex,
    updateParentMessageIndex,
    updateSearchParams,
  };
}

export default usePanel;
