import { Article } from "@/interfaces";
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
const { v4: uuid4 } = require("uuid");

type GetSummaryResponse = Article | { error: string };

const handler: NextApiHandler<Promise<GetSummaryResponse>> = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "POST" && req.method !== "GET")
    return res.status(400).json({ error: "Invalid request" });
  if (!process.env.API_KEY)
    return res.status(500).json({ error: "Server error" });

  try {
    let response: Response;
    let data: any;
    const { text } = req?.body;
    const { url } = req?.query;

    if (req.method === "POST") {
      if (!text) return res.status(400).json({ error: "No text provided" });

      response = await fetch(
        "https://article-extractor-and-summarizer.p.rapidapi.com/summarize-text",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key": process.env.API_KEY,
            "X-RapidAPI-Host":
              "article-extractor-and-summarizer.p.rapidapi.com",
          },
          body: JSON.stringify({
            text: text,
            lang: "en",
          }),
        }
      );
    } else {
      if (!url) return res.status(400).json({ error: "No url provided" });

      response = await fetch(
        `https://article-extractor-and-summarizer.p.rapidapi.com/summarize?url=${url}`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": process.env.API_KEY,
            "X-RapidAPI-Host":
              "article-extractor-and-summarizer.p.rapidapi.com",
          },
        }
      );
    }

    //Check if you can still get data from a 400 response

    data = await response.json();

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: data?.error || data?.message || "Invalid request" });
    }

    const article = {
      id: uuid4(),
      summary: data.summary,
      url,
      text,
    };

    return res.status(200).json(article);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export default handler;
