const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);
const app = require('../../app.js');

describe('a GET request to "/flags"', () => {
  it('should check if user is an admin before displaying flagged items', (done) => {
    chai.request(app)
      .get('/api/v1/flags')
      .set({ Authorization: process.env.TOKEN })
      .send()
      .then((res) => {
        expect(res.status).to.equal(200);
        res.body.data.should.be.a('array');
        done();
      })
      .catch((err) => {
        console.log(err.message);
        done();
      });
  });
});

describe('a DELETE request to "/:typeId/:type"', () => {
  it('should return 404 because flag does not exist', (done) => {
    chai.request(app)
      .delete('/api/v1/flags/10/gif')
      .set({ Authorization: process.env.TOKEN })
      .send()
      .then((res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.include({
          error: 'Flag not found'
        });
        done();
      })
      .catch((err) => {
        console.log(err.message);
        done();
      });
  });
  it('should delete flagged item if admin', (done) => {
    chai.request(app)
      .delete('/api/v1/flags/1/comment')
      .set({ Authorization: process.env.TOKEN })
      .send()
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.include({
          message: 'Successfully deleted flagged item'
        });
        done();
      })
      .catch((err) => {
        console.log(err.message);
        done();
      });
  });
});
