const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');

const expect = chai.expect;

chai.use(chaiHttp);
const app = require('../../app.js');

describe('On Teamwork API', () => {
  describe('a POST request to "/gifs"', () => {
    it('should check if user is authenticated before adding gif', (done) => {
      chai.request(app)
        .post('/api/v1/gifs')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set({ Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTU3MzU2ODA5NSwiZXhwIjoxNTczNjU0NDk1fQ.0iGYd7Rh7wPiG24Kwtq_clG_82iIvOPlYIVgZJUZNKc' })
        .field('title', 'my title')
        .attach('gif', fs.readFileSync('./api/v1/test/images/gif1.gif'), 'gif1.gif')
        .then((res) => {
          expect(res.status).to.equal(201);
          expect(res.body.data).to.include({
            message: 'GIF image successfully posted'
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
      done();
    });
  });

  describe('a GET request to "/gifs/:gifId"', () => {
    it('should check if user is authenticated before displaying gif', (done) => {
      chai.request(app)
        .post('/api/v1/gifs/1')
        .set({ Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTU3MzU2ODA5NSwiZXhwIjoxNTczNjU0NDk1fQ.0iGYd7Rh7wPiG24Kwtq_clG_82iIvOPlYIVgZJUZNKc' })
        .field('title', 'my title')
        .then((res) => {
          expect(res.status).to.equal(200);
          res.body.data.should.have.property('gifId');
          res.body.data.should.have.property('title');
          res.body.data.should.have.property('imageUrl');
          res.body.data.should.have.property('public_id');
          res.body.data.should.have.property('createdOn');
          res.body.data.should.have.property('author');
          res.body.data.should.have.property('comment');
        })
        .catch((err) => {
          console.log(err.message);
        });
      done();
    });
  });

  describe('a DELETE request to "/gifs/:gifId"', () => {
    it('should check if user is authenticated and owner of gif before deleting gif', (done) => {
      chai.request(app)
        .post('/api/v1/gifs/1')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set({ Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTU3MzU2ODA5NSwiZXhwIjoxNTczNjU0NDk1fQ.0iGYd7Rh7wPiG24Kwtq_clG_82iIvOPlYIVgZJUZNKc' })
        .field('title', 'my title')
        .attach('gif', fs.readFileSync('./api/v1/test/images/gif1.gif'), 'gif1.gif')
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.include({
            message: 'gif post successfully deleted'
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
      done();
    });
  });

  describe('a POST request to "/gifs/:gifId/comment"', () => {
    it('should check if user is authenticated before posting comment for gif', (done) => {
      chai.request(app)
        .delete('/api/v1/gifs/5/comment')
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
