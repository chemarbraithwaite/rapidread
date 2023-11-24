"use client";
import { useState, useRef } from "react";
import PaperAirplaneIcon from "./icons/paper-airplane";
import { isMobile } from "react-device-detect";
import { CHARACTER_LIMIT } from "@/constants";

type Props = {
  handleSubmit: (input: string) => Promise<boolean>;
  className?: string;
};

const ChatInput = ({ handleSubmit, ...props }: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const onSubmit = () => {
    if (!input.trim()) return;
    setIsLoading(true);
    handleSubmit(input.trim())
      .then((success) => {
        if (success) setInput("");
      })
      .finally(() => {
        setIsLoading(false);
        if (!isMobile) {
          //Only focus on desktop
          setTimeout(() => {
            inputRef.current?.focus();
          }, 500);
        }
      });
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
              : "Enter the text your want to summarize or a link to a webpage"
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
