const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');

const expect = chai.expect;

chai.use(chaiHttp);
const app = require('../../app.js');

describe('On Teamwork API', () => {
  describe('a POST request to "/articles"', () => {
    it('should check if user is authenticated before adding article with image', (done) => {
      chai.request(app)
        .post('/api/v1/articles')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set({ Authorization: process.env.TOKEN })
        .field('categoryId', '1')
        .field('title', 'A title')
        .field('article', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, esse voluptatem unde vitae iste nisi, dolore ipsam sit ut non')
        .attach('articleImage', fs.readFileSync('./api/v1/test/images/eight.jpg'), 'eight.jpg')
        .then((res) => {
          expect(res).to.have.status(201);
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
    it('should check if user is authenticated before adding article without image', (done) => {
      const articleDetails = {
        categoryId: 1,
        title: 'title title',
        article: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, esse voluptatem unde vitae iste nisi, dolore ipsam sit ut non'
      };
      chai.request(app)
        .post('/api/v1/articles')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set({ Authorization: process.env.TOKEN })
        .send(articleDetails)
        .then((res) => {
          expect(res).to.have.status(201);
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
    it('should check if user is authenticated and author before editing article with image', (done) => {
      chai.request(app)
        .patch('/api/v1/articles/12')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set({ Authorization: process.env.TOKEN })
        .field('categoryId', 1)
        .field('title', 'A title edited')
        .field('article', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, esse voluptatem unde vitae iste nisi, dolore ipsam sit ut non')
        .attach('articleImage', fs.readFileSync('./api/v1/test/images/eight.jpg'), 'eight.jpg')
        .then((res) => {
          expect(res).to.have.status(200);
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

    it('should check if user is authenticated and author before editing article without image', (done) => {
      const articleDetails = {
        categoryId: 1,
        title: 'my title edited',
        article: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, esse voluptatem unde vitae iste nisi, dolore ipsam sit ut non'
      };
      chai.request(app)
        .patch('/api/v1/articles/13')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set({ Authorization: process.env.TOKEN })
        .send(articleDetails)
        .then((res) => {
          expect(res).to.have.status(200);
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
        .get('/api/v1/articles/7')
        .set({ Authorization: process.env.TOKEN })
        .then((res) => {
          expect(res).to.have.status(200);
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
        .post('/api/v1/articles/6/comment')
        .set('Content-Type', 'application/json')
        .set({ Authorization: process.env.TOKEN })
        .send(comment)
        .then((res) => {
          expect(res).to.have.status(201);
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

  describe('a POST request to "/articles/:articleId/flag"', () => {
    it('should check if user is authenticated before flagging article', (done) => {
      chai.request(app)
        .post('/api/v1/articles/7/flag')
        .set({ Authorization: process.env.TOKEN })
        .send()
        .then((res) => {
          expect(res).to.have.status(200);
          done();
        })
        .catch((err) => {
          console.log(err.message);
          done();
        });
    });
  });

  describe('a DELETE request to "/articles/:articleId"', () => {
    it('should check if user is authenticated before deleting article details', (done) => {
      chai.request(app)
        .delete('/api/v1/articles/8')
        .set({ Authorization: process.env.TOKEN })
        .send()
        .then((res) => {
          expect(res).to.have.status(400);
          done();
        })
        .catch((error) => {
          console.log(error.message);
          done();
        });
    });
  });
});
