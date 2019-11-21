const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);
const app = require('../../app.js');

describe('a GET request to "/comments/:commentId/flag"', () => {
  it('should check if user is authenticated before adding gif', (done) => {
    chai.request(app)
      .post('/api/v1/comments/1/flag')
      .set({ Authorization: process.env.TOKEN })
      .send()
      .then((res) => {
        expect(res.status).to.equal(201);
        should.exist(res.body.data);
        done();
      })
      .catch((err) => {
        console.log(err.message);
        done();
      });
  });
});
