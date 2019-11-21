const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);
const app = require('../../app.js');

describe('a GET request to "/flags"', () => {
  it('should check if user is authenticated before adding gif', (done) => {
    chai.request(app)
      .get('/api/v1/flags')
      .set({ Authorization: process.env.TOKEN })
      .send()
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

describe('a GET request to "/flags/:flagId"', () => {
  it('should return 404 because flag does not exist', (done) => {
    chai.request(app)
      .get('/api/v1/flags/1')
      .set({ Authorization: process.env.TOKEN })
      .send()
      .then((res) => {
        expect(res.status).to.equal(404);
        done();
      })
      .catch((err) => {
        console.log(err.message);
        done();
      });
  });
});

describe('a DELETE request to "/flags/:flagId"', () => {
  it('should return 404 because no flag exist', (done) => {
    chai.request(app)
      .delete('/api/v1/flags/1')
      .set({ Authorization: process.env.TOKEN })
      .send()
      .then((res) => {
        expect(res.status).to.equal(404);
        done();
      })
      .catch((err) => {
        console.log(err.message);
        done();
      });
  });
});
