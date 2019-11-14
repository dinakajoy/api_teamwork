CREATE TABLE articles (
  "articleId" SERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "article" TEXT NOT NULL,
  "articleImage" VARCHAR(255),
  "claps" INTEGER DEFAULT 0,
  "flaggedInvalid" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP DEFAULT current_timestamp,
  "updated_at" TIMESTAMP DEFAULT current_timestamp,
  "userId" SERIAL REFERENCES users ("userId")
);