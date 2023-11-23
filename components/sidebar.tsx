"use client";
import { useLayoutStore } from "@/stores/useLayoutStore";
import { AnimatePresence, motion } from "framer-motion";
import MenuItem from "@/components/menu-item";
import CloseIcon from "@/components/icons/close";
import useStore from "@/stores/useStore";
import { useArticleStore } from "@/stores/useArticleStore";
import AddIcon from "@/components/icons/add";

const Sidebar = () => {
  const isOpen = useLayoutStore((state) => state.isMenuOpen);
  const toggleMenu = useLayoutStore((state) => state.toggleMenu);
  const threads = useStore(useArticleStore, (state) => state.threads);
  const addThread = useArticleStore((state) => state.addThread);
  const isSmallScreen = useLayoutStore((state) => state.isSmallScreen);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isOpen && (
        <motion.aside
          {...{
            initial: { x: "-100%" },
            animate: { x: 0 },
            exit: { x: "-100%" },
            transition: { duration: 0.3 },
          }}
          className="bg-blue-50 absolute top-0 w-full h-[100vh] md:relative md:w-80 md:h-full md:shadow-md md:rounded-md 
          z-[1] md:z-0
          "
        >
          <div className="flex flex-col items-center">
            <div className="flex w-full justify-center items-center md:pl-8 md:items-start md:justify-start h-14 gap-4 p-2 ">
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 1.02 }}
                onClick={() => toggleMenu()}
                className="cursor-pointer absolute left-2 h-7 w-7 text-gray-600 md:hidden"
              >
                <CloseIcon />
              </motion.div>

              <h1 className="font-semibold text-lg"> Threads </h1>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 1.02 }}
              onClick={() => addThread()}
              className="flex gap-4 cursor-pointer p-3 mb-4 text-blue-400 rounded-2xl border-blue-200 bg-blue-100 w-5/6 border"
            >
              <AddIcon /> <span> New Thread </span>
            </motion.div>
            <div
              className="p-7 w-full overflow-auto"
              style={{
                height: isSmallScreen
                  ? "calc(100vh - 122px)"
                  : "calc(100vh - 178px)",
              }}
            >
              <ul className="flex flex-col gap-6">
                <AnimatePresence>
                  {threads?.map((article, delay) => {
                    return (
                      <MenuItem
                        key={article.id}
                        {...{
                          initial: { opacity: 0, x: -50 },
                          exit: {
                            opacity: 0.5,
                            x: -500,
                            transition: { duration: 0.3 },
                          },
                          animate: { opacity: 1, x: 0 },
                          transition: {
                            delay: 0.02 + delay / 10,
                          },
                        }}
                        thread={article}
                      />
                    );
                  })}
                </AnimatePresence>
              </ul>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
