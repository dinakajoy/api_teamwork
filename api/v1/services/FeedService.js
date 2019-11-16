const pool = require('../config/dbConfig');

class FeedService {
  static async getFeed() {
    const getFeed = `
              SELECT a."articleId" AS id, a.title, a."articleImage" AS "articleImage/url", c.category AS "category/public_id", a."createdOn", concat("firstName", ' ', "lastName") AS author FROM articles a INNER JOIN users u ON a."userId" = u."userId" INNER JOIN categories c ON a."categoryId" = c."categoryId"
              UNION
              SELECT g."gifId" AS id, g.title, g."imageUrl" AS "articleImage/url", g.public_id AS "category/public_id", g."createdOn", concat("firstName", ' ', "lastName") AS author FROM gifs g INNER JOIN users u ON g."userId" = u."userId" 
              ORDER BY "createdOn" DESC`;
    const { rows } = await pool.query(getFeed);
    return rows;
  }
}
module.exports = FeedService;
