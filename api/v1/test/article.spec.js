const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');

const expect = chai.expect;

chai.use(chaiHttp);
const app = require('../../app.js');

describe('On Teamwork API', () => {
  describe('a POST request to "/articles"', () => {
    it('should check if user is authenticated before adding article', (done) => {
      chai.request(app)
        .post('/api/v1/articles')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set({ Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTU3MzU2ODA5NSwiZXhwIjoxNTczNjU0NDk1fQ.0iGYd7Rh7wPiG24Kwtq_clG_82iIvOPlYIVgZJUZNKc' })
        .field('categoryId', '3')
        .field('title', 'my title')
        .field('article', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, esse voluptatem unde vitae iste nisi, dolore ipsam sit ut non')
        .attach('articleImage', fs.readFileSync('./api/v1/test/images/eight.jpg'), 'eight.jpg')
        .then((res) => {
          expect(res.status).to.equal(201);
          expect(res.body.data).to.include({
            message: 'Article successfully posted'
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
      done();
    });
  });

  describe('a PATCH request to "/articles/:articleId"', () => {
    it('should check if user is authenticated and author before editing article', (done) => {
      chai.request(app)
        .patch('/api/v1/articles')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set({ Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTU3MzU2ODA5NSwiZXhwIjoxNTczNjU0NDk1fQ.0iGYd7Rh7wPiG24Kwtq_clG_82iIvOPlYIVgZJUZNKc' })
        .field('articleId', '1')
        .field('categoryId', '3')
        .field('title', 'my title edited')
        .field('article', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, esse voluptatem unde vitae iste nisi, dolore ipsam sit ut non')
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.include({
            message: 'Article successfully updated'
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
      done();
    });
  });

  describe('a DELETE request to "/articles/:articleId"', () => {
    it('should check if user is authenticated and author before deleting article', (done) => {
      chai.request(app)
        .delete('/api/v1/articles')
        .set('Content-Type', 'application/json')
        .set({ Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTU3MzU2ODA5NSwiZXhwIjoxNTczNjU0NDk1fQ.0iGYd7Rh7wPiG24Kwtq_clG_82iIvOPlYIVgZJUZNKc' })
        .field('articleId', '1')
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.include({
            message: 'Article successfully deleted'
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
      done();
    });
  });

  describe('a POST request to "/articles/:articleId/comment"', () => {
    it('should check if user is authenticated before posting comment for article', (done) => {
      chai.request(app)
        .delete('/api/v1/articles/1/comment')
        .set('Content-Type', 'application/json')
        .set({ Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTU3MzU2ODA5NSwiZXhwIjoxNTczNjU0NDk1fQ.0iGYd7Rh7wPiG24Kwtq_clG_82iIvOPlYIVgZJUZNKc' })
        .then((res) => {
          expect(res.status).to.equal(201);
          expect(res.body.data).to.include({
            message: 'Comment successfully created'
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
      done();
    });
  });
});
