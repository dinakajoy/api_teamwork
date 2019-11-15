CREATE TABLE articles (
  "articleId" SERIAL PRIMARY KEY,
  "categoryId" SERIAL REFERENCES categories ("categoryId"),
  "title" VARCHAR(255) NOT NULL,
  "article" TEXT NOT NULL,
  "articleImage" VARCHAR(255),
  "createdOn" TIMESTAMP DEFAULT current_timestamp,
  "updatedOn" TIMESTAMP DEFAULT current_timestamp,
  "userId" SERIAL REFERENCES users ("userId")
);