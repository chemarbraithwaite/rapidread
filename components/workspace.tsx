"use client";

import { useArticleStore } from "@/stores/useArticleStore";
import useStore from "@/stores/useStore";
import Thread from "./thread";
import ChatInput from "@/components/chat-input";
import { useEffect, useRef, useState } from "react";
import EmptyWorkspace from "@/components/empty-workspace";
import { useAsyncFn } from "react-use";
import ArrowDownIcon from "@/components/icons/arrow-down";
import { GENERIC_ERROR_MESSAGE } from "@/constants";

const Workspace = () => {
  const threadId = useStore(useArticleStore, (state) => state.activeThreadId);
  const threads = useStore(useArticleStore, (state) => state.threads);
  const thread = threads?.find((thread) => thread.id === threadId);
  const addArticle = useArticleStore((state) => state.addArticle);
  const threadRef = useRef<HTMLDivElement>(null);
  const hasRehydrated = useStore(
    useArticleStore,
    (state) => state._hasHydrated
  );
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [scrollSnapToBottom, setScrollSnapToBottom] = useState(true);
  const [didRetry, setDidRetry] = useState(false);

  const [{ loading }, getSummary] = useAsyncFn(
    async (input: string) => {
      setError("");
      setInput(input);
      try {
        if (!input) return true;

        let data = null;
        let res: Response | null = null;

        res = await fetch("/api", {
          method: "POST",
          body: JSON.stringify({
            text: input,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.status === 504) {
          setDidRetry(true);

          // Retry automatically: Server cold start or timeout due to no-premium plan
          await new Promise((resolve) => setTimeout(resolve, 500)); // Use a delay to prevent spamming the server
          res = await fetch("/api", {
            method: "POST",
            body: JSON.stringify({
              text: input,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
        }

        data = await res.json();

        if (res.status !== 200) {
          throw new Error(data?.error);
        }

        addArticle(data);
        setInput("");
        return true;
      } catch (e: any) {
        console.error(e);
        setError(e?.error || e?.message || GENERIC_ERROR_MESSAGE);
        return false;
      } finally {
        setDidRetry(false);
      }
    },
    [addArticle]
  );

  const isThreadActive =
    (thread && thread.articles.length !== 0) || input !== "";

  const scrollToBottom = (behavior: "smooth" | "instant" = "smooth") => {
    threadRef.current?.scrollTo({
      top: threadRef.current.scrollHeight,
      behavior: behavior,
    });
    setTimeout(() => {
      setScrollSnapToBottom(true);
    }, 500);
  };

  useEffect(() => {
    let ref: HTMLDivElement | null = null;
    const handleScroll = () => {
      if (!ref) return;

      const { scrollHeight, scrollTop, clientHeight } = ref;
      const isAtBottom = scrollHeight - scrollTop - 20 < clientHeight;
      setScrollSnapToBottom(isAtBottom);
    };
    setError("");
    scrollToBottom("instant");
    setInput("");
    setTimeout(() => {
      setScrollSnapToBottom(true);
    }, 500);

    if (threadRef.current) {
      ref = threadRef.current;
      ref.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (ref) ref?.removeEventListener("scroll", handleScroll);
    };
  }, [threadId, hasRehydrated]);

  useEffect(() => {
    if (!scrollSnapToBottom) return;

    scrollToBottom();
  }, [loading, thread?.articles.length, scrollSnapToBottom]);

  if (!hasRehydrated) {
    return (
      <div className="w-full flex justify-center items-center  h-full typewriter">
        <h1 className="font-black text-4xl">RapidRead.......</h1>
      </div>
    );
  }

  return (
    <section className="w-full flex items-center flex-col">
      <div
        ref={threadRef}
        className="overflow-auto max-w-4xl  w-full flex flex-col items-center"
        style={{
          ...(isThreadActive
            ? { height: "100%" }
            : {
                marginTop: "30vh",
                justifyContent: "center",
              }),
        }}
      >
        {isThreadActive ? (
          <>
            <Thread
              id={thread?.id ?? "active-thread"}
              articles={thread?.articles ?? []}
              activeRequest={{
                text: input,
                loading,
                error,
              }}
              getSummary={getSummary}
              didRetry={didRetry}
            />
            {!scrollSnapToBottom && (
              <div
                className="flex justify-center absolute bottom-36 items-center 
              cursor-pointer w-8 h-8 opacity-50 rounded-full bg-black text-white shadow-md"
                onClick={() => scrollToBottom()}
              >
                <ArrowDownIcon className="w-6 h-6 font-bold" />
              </div>
            )}
          </>
        ) : (
          <EmptyWorkspace
            className="h-full w-5/6 flex overflow-hidden items-center justify-center flex-col
            typewriter"
          />
        )}
      </div>
      <ChatInput
        handleSubmit={getSummary}
        isLoading={loading}
        className="h-36 w-full p-7 max-w-4xl flex flex-col justify-center"
      />
    </section>
  );
};

export default Workspace;
