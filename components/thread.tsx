import ArticleDisplay from "@/components/article";
import { motion } from "framer-motion";
import { Thread } from "@/stores/useArticleStore";
import RetryIcon from "./icons/retry";

type Props = {
  activeRequest?: {
    text: string;
    loading: boolean;
    error?: string;
  };
  didRetry?: boolean;
  getSummary: (input: string) => void;
};

const Thread = ({
  articles,
  id,
  activeRequest,
  getSummary,
  didRetry,
}: Thread & Props) => {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0.8 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="w-full flex flex-col justify-center mb-5"
      key={id}
    >
      {articles.map((article) => (
        <div className="flex flex-col items-center" key={article.id}>
          <ArticleDisplay key={article.id} article={article} />
        </div>
      ))}
      {activeRequest?.text && (
        <div className="flex flex-col items-center">
          <ArticleDisplay
            article={{
              id: "active-request",
              text: activeRequest.text,
              summary: "",
            }}
            error={Boolean(activeRequest.error)}
            altSummary={
              activeRequest.loading ? (
                <motion.p
                  animate={{ opacity: 0.5 }}
                  initial={{ opacity: 1 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="flex w-full justify-start text-base font-semibold items-start text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%"
                >
                  {didRetry
                    ? "Still working on it. This is taking longer than usual"
                    : "Working on your summary..."}
                </motion.p>
              ) : activeRequest.error ? (
                <div className="flex flex-col w-full font-semibold gap-1 items-start  justify-start">
                  <span className="text-slate-900 flex gap-2">
                    {activeRequest.error}
                  </span>
                  <RetryIcon
                    onClick={() => getSummary(activeRequest.text)}
                    className="cursor-pointer w-5 h-5 text-gray-600"
                  />
                </div>
              ) : undefined
            }
          />
        </div>
      )}
    </motion.div>
  );
};

export default Thread;
