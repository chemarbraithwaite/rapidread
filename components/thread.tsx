import ArticleDisplay from "@/components/article";
import { motion } from "framer-motion";
import { Thread } from "@/stores/useArticleStore";

const Thread = ({ articles, id }: Thread) => {
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
          <hr className="w-5/6" />
          <ArticleDisplay key={article.id} article={article} />
        </div>
      ))}
    </motion.div>
  );
};

export default Thread;
