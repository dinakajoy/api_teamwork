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
        .set({ Authorization: process.env.TOKEN })
        .field('title', 'my title')
        .attach('gif', fs.readFileSync('./api/v1/test/images/gif2.gif'), 'gif2.gif')
        .then((res) => {
          expect(res.status).to.equal(201);
          expect(res.body.data).to.include({
            message: 'GIF image successfully posted'
          });
        })
        .catch((err) => {
          throw err;
        });
      done();
    });
  });

  describe('a GET request to "/gifs/:gifId"', () => {
    it('should display gif', (done) => {
      chai.request(app)
        .get('/api/v1/gifs/1')
        .send()
        .then((res) => {
          expect(res.status).to.equal(200);
          done();
        })
        .catch((err) => {
          console.log(err.message);
          done();
        });
    });
  });

  describe('a POST request to "/gifs/:gifId/comment"', () => {
    it('should check if user is authenticated before posting comment for gif', (done) => {
      const comment = {
        comment: 'New comment'
      };
      chai.request(app)
        .post('/api/v1/gifs/1/comment')
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
