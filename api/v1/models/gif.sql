CREATE TABLE gifs (
  "gifId" SERIAL PRIMARY KEY,
  "title" VARCHAR(255),
  "imageUrl" VARCHAR(255) NOT NULL,
  "public_id" VARCHAR(255) NOT NULL,
  "claps" INTEGER DEFAULT 0,
  "flaggedInvalid" INTEGER DEFAULT 0,
  "createdOn" TIMESTAMP DEFAULT current_timestamp,
  "updatedOn" TIMESTAMP DEFAULT current_timestamp,
  "userId" SERIAL REFERENCES users ("userId")
);