const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);
const app = require('../../app.js');

describe('a GET request to "/feed"', () => {
  it('should check if user is authenticated before displaying feed', (done) => {
    chai.request(app)
      .get('/api/v1/feed')
      .set({ Authorization: process.env.TOKEN })
      .then((res) => {
        expect(res.status).to.equal(200);
        should.exist(res.body.data);
        res.body.data.should.be.a('array');
        done();
      })
      .catch((err) => {
        console.log(err.message);
        done();
      });
  });
});
