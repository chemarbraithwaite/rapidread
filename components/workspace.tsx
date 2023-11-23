"use client";

import { useArticleStore } from "@/stores/useArticleStore";
import useStore from "@/stores/useStore";
import Thread from "./thread";
import ChatInput from "@/components/chat-input";
import { use, useEffect, useRef, useState } from "react";
import EmptyWorkspace from "@/components/empty-workspace";
import { useAsyncFn } from "react-use";
import { motion } from "framer-motion";

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
  const [scrollSnapToBottom, setScrollSnapToBottom] = useState(true);

  const [{ loading }, getSummary] = useAsyncFn(
    async (input: string) => {
      setError("");
      try {
        if (!input) return true;

        const isUrl = input.trim().startsWith("http");
        const requestPath = isUrl
          ? `/api?url=${encodeURIComponent(input)}`
          : "/api";
        let data = null;

        const res = await fetch(requestPath, {
          ...(!isUrl && {
            method: "POST",
            body: JSON.stringify({ text: input }),
            headers: {
              "Content-Type": "application/json",
            },
          }),
        });
        data = await res.json();

        if (res.status !== 200) {
          console.log(data);
          throw new Error(data?.error);
        }

        addArticle(data);
        return true;
      } catch (e: any) {
        console.error(e);
        setError(
          e?.error || e?.message || "Something went wrong :(. Please try again."
        );
        return false;
      }
    },
    [addArticle]
  );

  const workspaceIsEmpty =
    !thread || (thread.articles.length === 0 && !loading && !error);

  const scrollToBottom = (behavior: "smooth" | "instant" = "smooth") => {
    threadRef.current?.scrollTo({
      top: threadRef.current.scrollHeight,
      behavior: behavior,
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const { scrollHeight, scrollTop, clientHeight } = threadRef.current!;
      const isAtBottom = scrollHeight - scrollTop === clientHeight;
      setScrollSnapToBottom(isAtBottom);
    };
    setError("");
    scrollToBottom("instant");
    setTimeout(() => {
      setScrollSnapToBottom(true);
    }, 500);

    threadRef.current?.addEventListener("scroll", handleScroll);
    return () => threadRef.current?.removeEventListener("scroll", handleScroll);
  }, [threadId]);

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
          ...(!workspaceIsEmpty
            ? { height: "100%" }
            : {
                marginTop: "30vh",
                justifyContent: "center",
              }),
        }}
      >
        {!workspaceIsEmpty ? (
          <Thread id={thread.id} articles={thread.articles} />
        ) : (
          <EmptyWorkspace
            className="h-full w-5/6 flex overflow-hidden items-center justify-center flex-col
            typewriter"
          />
        )}
        {loading && (
          <motion.p
            animate={{ opacity: 0.5 }}
            initial={{ opacity: 1 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="flex justify-center text-xl font-semibold items-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%"
          >
            Working on your summary...
          </motion.p>
        )}
        {error && (
          <div className="w-full font-extralight flex justify-center text-red-500 items-center">
            {error}
          </div>
        )}
      </div>
      <ChatInput
        handleSubmit={getSummary}
        className="h-36 w-full p-7 max-w-4xl flex flex-col justify-center"
      />
    </section>
  );
};

export default Workspace;
