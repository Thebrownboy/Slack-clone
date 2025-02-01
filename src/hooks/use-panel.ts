import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function usePanel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [parentMessageId, updateParentMessageId] = useState<string | null>("");
  useEffect(() => {
    if (searchParams.get("parentMessageId")) {
      // do something
      const id = searchParams.get("parentMessageId");
      updateParentMessageId(id);
    } else {
      updateParentMessageId(null);
    }
  }, [searchParams]);

  const onOpenMessage = (messageId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("parentMessageId", messageId);

    router.push(pathname + "?" + params.toString());
  };

  const onCloseMessage = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("parentMessageId");
    router.push(pathname + "?" + params.toString());
  };

  return {
    parentMessageId,
    onCloseMessage,
    onOpenMessage,
  };
}

export default usePanel;
