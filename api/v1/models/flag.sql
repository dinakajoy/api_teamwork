CREATE TABLE flags (
  "flagId" SERIAL PRIMARY KEY,
  "userId" SERIAL REFERENCES users ("userId"),
  "type" VARCHAR(255) NOT NULL,
  "typeId" INTEGER NOT NULL,
  "createdOn" TIMESTAMP DEFAULT current_timestamp
);