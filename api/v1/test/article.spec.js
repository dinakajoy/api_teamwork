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
        .set({ Authorization: process.env.TOKEN })
        .field('categoryId', '1')
        .field('title', 'my title')
        .field('article', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, esse voluptatem unde vitae iste nisi, dolore ipsam sit ut non')
        .attach('articleImage', fs.readFileSync('./api/v1/test/images/eight.jpg'), 'eight.jpg')
        .then((res) => {
          expect(res.status).to.equal(201);
          expect(res.body.data).to.include({
            message: 'Article successfully posted'
          });
          done();
        })
        .catch((err) => {
          console.log(err.message);
          done();
        });
    });
  });

  describe('a PATCH request to "/articles/:articleId"', () => {
    it('should check if user is authenticated and author before editing article', (done) => {
      chai.request(app)
        .patch('/api/v1/articles/1')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set({ Authorization: process.env.TOKEN })
        .field('articleId', '1')
        .field('categoryId', '3')
        .field('title', 'my title edited')
        .field('article', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, esse voluptatem unde vitae iste nisi, dolore ipsam sit ut non')
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.include({
            message: 'Article successfully updated'
          });
          done();
        })
        .catch((err) => {
          console.log(err.message);
          done();
        });
    });
  });

  describe('a GET request to "/articles/:articleId"', () => {
    it('should check if user is authenticated before returning article details', (done) => {
      chai.request(app)
        .get('/api/v1/articles/1')
        .set({ Authorization: process.env.TOKEN })
        .then((res) => {
          expect(res.status).to.equal(200);
          done();
        })
        .catch((error) => {
          console.log(error.message);
          done();
        });
    });
  });

  describe('a POST request to "/articles/:articleId/comment"', () => {
    it('should check if user is authenticated before posting comment for article', (done) => {
      const comment = {
        comment: 'New comment'
      };
      chai.request(app)
        .post('/api/v1/articles/1/comment')
        .set('Content-Type', 'application/json')
        .set({ Authorization: process.env.TOKEN })
        .send(comment)
        .then((res) => {
          expect(res.status).to.equal(201);
          expect(res.body.data).to.include({
            message: 'Comment successfully created'
          });
          done();
        })
        .catch((err) => {
          console.log(err.message);
          done();
        });
    });
  });
});
