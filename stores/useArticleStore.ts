import { Article } from "@/interfaces";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
const { v4: uuidv4 } = require("uuid");

export type Thread = {
  id: string;
  articles: Article[];
};

type ArticleStore = {
  threads: Thread[];
  activeThreadId?: string;
  _hasHydrated: boolean;
  addThread: () => void;
  addArticle: (article: Article) => void;
  setActiveThread: (id: string) => void;
  deleteThread: (id: string) => void;
  setHasHydrated: () => void;
};

export const useArticleStore = create(
  devtools(
    persist<ArticleStore>(
      (set) => ({
        threads: [],
        _hasHydrated: false,
        addArticle: (article) =>
          set((state) => {
            const thread = state.threads.find(
              (thread) => thread.id === state.activeThreadId
            );

            if (!thread) {
              const threadId = uuidv4();

              return {
                ...state,
                activeThreadId: threadId,
                threads: [
                  ...state.threads,
                  { id: threadId, articles: [article] },
                ],
              };
            }

            return {
              ...state,
              activeThreadId: thread.id,
              threads: state.threads.map((thread) => {
                if (thread.id === state.activeThreadId) {
                  return {
                    ...thread,
                    articles: [...thread.articles, article],
                  };
                }
                return thread;
              }),
            };
          }),
        addThread: () =>
          set((state) => {
            const threadId = uuidv4();

            return {
              ...state,
              threads: [{ id: threadId, articles: [] }, ...state.threads],
              activeThreadId: threadId,
            };
          }),
        setActiveThread: (id) => set({ activeThreadId: id }),
        deleteThread: (id) =>
          set((state) => ({
            threads: state.threads.filter((thread) => thread.id !== id),
          })),
        setHasHydrated: () => set({ _hasHydrated: true }),
      }),

      {
        name: "article-store",
        version: 0,
        onRehydrateStorage: () => (state) => state?.setHasHydrated?.(),
      }
    ),
    {
      name: "Article Store",
    }
  )
);
