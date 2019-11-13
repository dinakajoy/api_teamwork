CREATE TABLE gifs (
  "gifId" SERIAL PRIMARY KEY,
  "title" VARCHAR(255),
  "imageUrl" VARCHAR(255) NOT NULL,
  "public_id" VARCHAR(255) NOT NULL,
  "claps" INTEGER DEFAULT 0,
  "flaggedInvalid" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP DEFAULT current_timestamp,
  "updated_at" TIMESTAMP DEFAULT current_timestamp,
  "userId" SERIAL REFERENCES users ("userId")
);