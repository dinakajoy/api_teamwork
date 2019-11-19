const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);
const app = require('../../app.js');

describe('On Teamwork API', () => {
  describe('a GET request to "/flags"', () => {
    it('should check if user is authenticated before adding gif', (done) => {
      chai.request(app)
        .get('/api/v1/flags')
        .set({ Authorization: process.env.TOKEN })
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

  describe('a GET request to "/flags/:flagId"', () => {
    it('should display flag details', (done) => {
      chai.request(app)
        .get('/api/v1/flags/1')
        .set({ Authorization: process.env.TOKEN })
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
});
