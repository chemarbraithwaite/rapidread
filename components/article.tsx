import { Article } from "@/interfaces";
import Image from "next/image";
import ClipboardIcon from "@/components/icons/clipboard";
import { useState } from "react";
import CheckIcon from "./icons/check";

type Props = {
  article: Article;
};

const ArticleDisplay = ({ article }: Props) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isCopiedTimeout, setIsCopiedTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const hasClipboardAPI = navigator.clipboard !== undefined;

  const handleCopy = async () => {
    try {
      navigator.permissions
        .query({ name: "clipboard-write" as PermissionName })
        .then((result) => {
          if (result.state === "granted" || result.state === "prompt") {
            navigator.clipboard.writeText(article.summary).then(() => {
              setIsCopied(true);
              if (isCopiedTimeout) clearTimeout(isCopiedTimeout);
              setIsCopiedTimeout(
                setTimeout(() => {
                  setIsCopied(false);
                }, 2000)
              );
            });
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div key={article.id} className="w-5/6 flex flex-col py-8 gap-4">
      <div className="w-full flex gap-4 overflow-hidden">
        <span className="w-[30px] min-w-[30px] h-[30px] flex-2 rounded-full text-white bg-[#05a0f5] flex items-center justify-center">
          R
        </span>
        <div className="flex flex-1 flex-col font-semibold items-start break-all">
          {"url" in article ? article.url : article.text}
        </div>
      </div>
      <div key={article.id} className="w-full flex gap-4">
        <Image
          width={30}
          height={30}
          src={"/images/logo-black.png"}
          alt="logo"
          className="max-h-[30px] max-w-[30px]"
        />

        <div className="p-4 bg-[#edf2f7] rounded-xl flex flex-col">
          <p>{article?.summary}</p>
          {hasClipboardAPI && (
            <div className="flex items-end justify-end ">
              {isCopied ? (
                <CheckIcon className="h-6 w-6 mt-2 text-green-400" />
              ) : (
                <ClipboardIcon
                  onClick={handleCopy}
                  className="h-6 w-6 mt-2 text-gray-400 cursor-pointer"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleDisplay;