"use client";
import { useState, useRef } from "react";
import PaperAirplaneIcon from "./icons/paper-airplane";
import { isMobile } from "react-device-detect";
import { CHARACTER_LIMIT } from "@/constants";

type Props = {
  handleSubmit: (input: string) => Promise<boolean>;
  className?: string;
  isLoading?: boolean;
};

const ChatInput = ({ handleSubmit, isLoading, ...props }: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const onSubmit = () => {
    if (!input.trim()) return;
    handleSubmit(input.trim());
    setInput("");
    if (!isMobile) {
      //Only focus on desktop
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }
  };

  return (
    <div {...props}>
      <div
        className="flex h-full items-center border-[#d5dde5]
         border border-solid rounded-lg p-3"
        style={{
          boxShadow: "rgba(0, 0, 0, 0.08) 1px 1px 5px 0px",
          borderColor: isFocused ? "#05a0f5" : "#d5dde5",
          borderWidth: isFocused ? "2px" : "1px",
        }}
      >
        <textarea
          ref={inputRef}
          className="h-full outline-none
           w-full resize-none peer placeholder:self-center disabled:bg-transparent"
          value={input}
          disabled={isLoading}
          rows={3}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setInput(e.target.value.slice(0, CHARACTER_LIMIT))}
          placeholder={
            isLoading
              ? "RapidRead is generating your summary"
              : "Enter text, a link or a statement. Eg. 'Tell me about Bjork'"
          }
          onKeyDown={(e) => {
            if (isLoading) {
              e.preventDefault();
              return;
            }

            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
        />
        <PaperAirplaneIcon
          onClick={isLoading ? undefined : onSubmit}
          className="h-6 w-6 text-[#d5dde5] peer-focus:text-[#05a0f5] mr-3"
        />
      </div>
    </div>
  );
};

export default ChatInput;
