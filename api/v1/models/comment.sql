CREATE TABLE IF NOT EXISTS comments (
  "commentId" SERIAL PRIMARY KEY,
  "comment" VARCHAR(255) NOT NULL,
  "type" VARCHAR(255) NOT NULL,
  "typeId" INTEGER NOT NULL,
  "createdOn" TIMESTAMP DEFAULT current_timestamp,
  "userId" SERIAL REFERENCES users ("userId")
);