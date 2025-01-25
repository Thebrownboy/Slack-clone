import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });
// import Editor from "@/components/editor";
import { useRef } from "react";
import type Quill from "quill";
// quills does not working correclty with the server-side rendering
// even if the component is a client componet , but next will render it once on the server
// so we should have some work-around

interface ChantInputProps {
  placeholder: string;
}
export default function ChatInput({ placeholder }: ChantInputProps) {
  // we will control the editor component by outer refs , not by passing new props

  const editorRef = useRef<Quill | null>(null);

  return (
    <div className=" px-5 w-full">
      <Editor
        placeholder={placeholder}
        onSumbit={() => {}}
        disabled={false}
        innerRef={editorRef}
        variant="create"
      />
    </div>
  );
}
