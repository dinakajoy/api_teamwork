const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');

const expect = chai.expect;

chai.use(chaiHttp);
// const app = require('../../app.js');

describe('On Teamwork API', () => {
  describe('a POST request to "/gifs"', () => {
    it('should check if user is authenticated before adding gif', (done) => {
      chai.request('http://127.0.0.1:3000')
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
});
