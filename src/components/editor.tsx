import Quill, { type QuillOptions, type Delta, type Op } from "quill";
import "quill/dist/quill.snow.css";
import {
  memo,
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Button } from "./ui/button";
import { PiTextAa } from "react-icons/pi";
import { ImageIcon, Smile, XIcon } from "lucide-react";
import { MdSend } from "react-icons/md";
import { Hint } from "./ui/hint";
import { cn } from "@/lib/utils";
import EmojiPopOver from "./emojiPopOver";
import Image from "next/image";

type EditorValue = {
  images: File[] | null;
  body: string;
};
interface EditorProps {
  variant?: "create" | "update";
  onSumbit: ({ body, images }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defautValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: RefObject<Quill | null>;
}

const Editor = ({
  variant = "create",
  onSumbit,
  defautValue = [],
  disabled = false,
  innerRef,
  onCancel,
  placeholder = "Write something...",
}: EditorProps) => {
  // it will not be a controlled component , but we will be use for other things
  // remember that refs does not rerneder , so we have to save the state to control the look and feel
  const [text, setText] = useState("");
  const [images, setImages] = useState<File[] | null>(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // you can use submit ref in useEffect without putting it in the dep array
  const submitRef = useRef(onSumbit);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defautValue);
  const disabledRef = useRef(disabled);
  // another state in ref to avoid causing error
  const imageElementRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    submitRef.current = onSumbit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defautValue;
    disabledRef.current = disabled;
  }, []);
  useEffect(() => {
    // not able to initalize
    if (!containerRef.current) return;
    const container = containerRef.current;

    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                const text = quill.getText();
                const addedImage = imageElementRef.current?.files?.[0] || null;
                const imagesAdded = addedImage ? [addedImage] : null;
                const isEmpty =
                  !addedImage &&
                  text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

                if (isEmpty) return;
                const body = JSON.stringify(quill.getContents());

                submitRef.current?.({ body, images: imagesAdded });
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
              },
            },
          },
        },
      },
    };
    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();
    if (innerRef) {
      // attaching the quill ref to inner ref to controll it from outside
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);

    setText(quill.getText());

    //listener

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    // you have to do proper cleaning
    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = "";
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);
  const toggleToolbar = () => {
    setIsToolbarVisible(!isToolbarVisible);

    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");
    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEmojiSelect = (emoji: any) => {
    const quill = quillRef.current;
    quill?.insertText(quill?.getSelection()?.index || 0, emoji.native);
  };

  // cuz quill may have empty HTML tags or \n new line  , they are not content
  const isEmpty =
    !images && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;
  // this will not renered
  // quillRef.current.getText().trim().length===0

  return (
    <div className="flex flex-col ">
      {/* phantom input  */}
      <input
        type="file"
        accept="image/*"
        ref={imageElementRef}
        onChange={(event) =>
          setImages([...(images || []), event.target.files![0]])
        }
        className="hidden"
      />
      <div
        className={cn(
          "flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm trasnition bg-white",
          disabled && "opacity-50"
        )}
      >
        <div ref={containerRef} className=" h-full ql-custom" />
        <div className=" flex gap-2 flex-wrap">
          {images?.map((item, index) => {
            {
              return (
                <div
                  key={index}
                  className=" relative size-[62px] items-center flex justify-center group/image"
                >
                  <Hint label="Remove Image">
                    <button
                      className=" hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center  justify-center"
                      onClick={() => {
                        setImages([
                          ...images.slice(0, index),
                          ...images.slice(index + 1),
                        ]);
                        imageElementRef.current!.value = "";
                      }}
                    >
                      <XIcon className="size-3.5" />
                    </button>
                  </Hint>
                  <Image
                    src={URL.createObjectURL(item)}
                    fill
                    className="rounded-xl overflow-hidden border object-cover "
                    alt={"Uploaded"}
                  />
                </div>
              );
            }
          })}
        </div>
        <div className="flex px-2 pb-2 z-[5]">
          <Hint
            label={isToolbarVisible ? "Hide formatting" : "Show formatting"}
          >
            <Button
              disabled={disabled}
              size={"iconSm"}
              variant={"ghost"}
              onClick={toggleToolbar}
            >
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <EmojiPopOver onEmojiSelect={onEmojiSelect}>
            <Button disabled={disabled} size={"iconSm"} variant={"ghost"}>
              <Smile className="size-4" />
            </Button>
          </EmojiPopOver>
          {variant === "create" && (
            <Hint label="Image">
              <Button
                disabled={disabled}
                size={"iconSm"}
                variant={"ghost"}
                onClick={() => {
                  imageElementRef.current?.click();
                }}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}
          {variant === "update" && (
            <div className=" ml-auto flex items-center gap-x-2">
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={onCancel}
                disabled={disabled}
              >
                Cancel
              </Button>
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => {
                  onSumbit({
                    images: images,
                    body: JSON.stringify(quillRef.current?.getContents()),
                  });
                }}
                disabled={disabled || isEmpty}
                className=" bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
              >
                Save
              </Button>
            </div>
          )}
          {variant === "create" && (
            <Button
              className={cn(
                "ml-auto",
                isEmpty
                  ? " bg-white hover:white text-muted-foreground"
                  : " bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
              )}
              size={"iconSm"}
              // the disabled here is not disabledRef cuz it will not cause re-render
              disabled={disabled || isEmpty}
              onClick={() => {
                onSumbit({
                  images: images,
                  body: JSON.stringify(quillRef.current?.getContents()),
                });
              }}
            >
              <MdSend />
            </Button>
          )}
        </div>
      </div>
      {variant === "create" && (
        <div
          className={cn(
            "p-2 text-[10px] text-muted-foreground flex justify-end opacity-0",
            !isEmpty && "opacity-100"
          )}
        >
          <p>
            <strong>Shift + return </strong> to add new line
          </p>
        </div>
      )}
    </div>
  );
};

export default memo(Editor);
