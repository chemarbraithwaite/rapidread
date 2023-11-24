import { GENERIC_ERROR_MESSAGE } from "@/constants";
import { Article } from "@/interfaces";
import { extract } from "@extractus/article-extractor";
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
const { v4: uuid4 } = require("uuid");

type GetSummaryResponse = Article | { error: string };

const getTextFromUrl = async (url: string) => {
  const article = await extract(url.trim());

  if (!article || !article.content) {
    throw new Error(
      "Unable to retrieve content from the given URL. Consider using an alternative URL."
    );
  }

  const text = article.content.replace(/<[^>]+>/g, "");
  return text;
};

const handler: NextApiHandler<Promise<GetSummaryResponse>> = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "POST")
    return res.status(400).json({ error: "Invalid request" });
  if (!process.env.API_KEY)
    return res.status(500).json({ error: "Server error" });

  try {
    let response: Response;
    let data: any;
    let input: string;
    const { text } = req?.body;

    if (!text) return res.status(400).json({ error: "No input provided" });
    input = text;

    const isUrl = text.trim().startsWith("http");

    if (isUrl) {
      input = await getTextFromUrl(text);
    }

    response = await fetch(
      "https://chatgpt-best-price.p.rapidapi.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": process.env.API_KEY,
          "X-RapidAPI-Host": "chatgpt-best-price.p.rapidapi.com",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are an assistant that can take an article and summarize it.",
            },
            {
              role: "user",
              content: `Can you summarize this: ${input}`,
            },
          ],
        }),
      }
    );

    data = await response.json();

    if (!response.ok) {
      console.log(response.status, data);
      return res.status(response.status).json({
        error: data?.error || data?.message || GENERIC_ERROR_MESSAGE,
      });
    }

    let article: Article;

    try {
      article = {
        id: uuid4(),
        summary: data.choices?.[0]?.message?.content,
        url: isUrl ? text : undefined,
        text: isUrl ? undefined : text,
      };
    } catch (error) {
      console.log(error, data);
      throw new Error(GENERIC_ERROR_MESSAGE);
    }

    return res.status(200).json(article);
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ error: error?.message || "Server error" });
  }
};

export default handler;
