const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
// const should = chai.should();

chai.use(chaiHttp);
const app = require('../../app.js');

describe('On Teamwork Api', () => {
  describe('a GET request to "/api" route', () => {
    it('should check api version and return a json object on error', async () => {
      chai.request(app).get('/api', (err, res, next) => {
        if (res.status === '505') {
          expect(res.status).to.equal(505);
          expect(res.message).to.be.a('string');
        } else {
          next();
        }
      });
    });
  });
});
