interface IArticle {
  id: string;
  summary: string;
}

export interface LinkArticle extends IArticle {
  url: string;
}

export interface UserArticle extends IArticle {
  text: string;
}

export type Article = LinkArticle | UserArticle;
