"user client";

import { Article } from "@/interfaces";
import { HTMLMotionProps, motion } from "framer-motion";
import ChevronLeftIcon from "@/components/icons/chevron-left";
import { Thread, useArticleStore } from "@/stores/useArticleStore";
import { useLayoutStore } from "@/stores/useLayoutStore";
import TrashIcon from "@/components/icons/trash";

interface Props extends HTMLMotionProps<"div"> {
  thread: Thread;
}

const MenuItem = ({ thread, ...props }: Props) => {
  const setActiveThread = useArticleStore((state) => state.setActiveThread);
  const deleteThread = useArticleStore((state) => state.deleteThread);
  const closeMenu = useLayoutStore((state) => state.toggleMenu);
  const isSmallScreen = useLayoutStore((state) => state.isSmallScreen);

  const firstArticle = thread.articles?.[0];

  const title = firstArticle
    ? "text" in firstArticle
      ? firstArticle.text
      : firstArticle.url
    : "New Thread";

  const handleClick = () => {
    setActiveThread(thread.id);
    if (isSmallScreen) closeMenu(false);
  };

  return (
    <motion.div
      {...props}
      className="flex gap-4 text-[#05a0f5] justify-center items-center"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 1.05 }}
        className="cursor-pointer"
        onClick={() => deleteThread(thread.id)}
      >
        <TrashIcon className="h-7 w-7" />
      </motion.div>

      <motion.li
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 1.05 }}
        onClick={handleClick}
        className="h-11 w-full flex cursor-pointer select-none bg-blue-100 rounded-md p-4 pt-3 overflow-hidden"
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-ellipsis font-bold whitespace-nowrap overflow-hidden">
            {title}
          </span>

          <ChevronLeftIcon className={"w-5 h-5 text-[#05a0f5] min-w-[20px]"} />
        </div>
      </motion.li>
    </motion.div>
  );
};

export default MenuItem;
