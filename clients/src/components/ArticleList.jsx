import React from "react";

const ArticleList = ({ articles = [] }) => {
  console.log("Articles passed to ArticleList:", articles);

  if (articles.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        <p>No articles available.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <h3>Articles</h3>
      {articles.map((article) => (
        <div
          key={article.id}
          className="border rounded-md p-4 shadow-sm bg-white"
        >
          <h3 className="text-lg font-semibold">{article.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Created at: {new Date(article.date).toLocaleString()}
          </p>
          <a
            href={article.body}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline mt-2 block"
          >
            Read Article
          </a>
        </div>
      ))}
    </div>
  );
};

export default ArticleList;
