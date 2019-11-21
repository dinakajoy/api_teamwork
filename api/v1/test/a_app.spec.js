const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);
const app = require('../../app.js');

describe('On Teamwork Api', () => {
  before(() => {
    app.set('Access-Control-Allow-Origin', '*');
    app.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    app.set('Access-Control-Allow-Headers', 'Origin, Content, Accept, Content-Type, Authorization, Content-Length, X-Requested-With');
  });
  describe('a GET request to "/" route', () => {
    it('should return a json object', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });

  describe('Wrong route', () => {
    it('should return a json object for GET request', async () => {
      chai.request(app)
        .get('*', (err, res, next) => {
          should.not.exist(err);
          should.exist(res);
          expect(res.status).to.equal(200);
          expect(res.messages).to.have.property('Welcome To Teamwork Api. Please Ensure You Entered A Correct Url!!!');
          next();
        });
    });
    it('should return a json object for POST request', async () => {
      chai.request(app)
        .post('*', (err, res, next) => {
          should.not.exist(err);
          should.exist(res);
          expect(res.status).to.equal(200);
          expect(res.messages).to.have.property('Welcome To Teamwork Api. Please Ensure You Entered A Correct Url!!!');
          next();
        });
    });
    it('should return a json object for PATCH request', async () => {
      chai.request(app)
        .patch('*', (err, res, next) => {
          should.not.exist(err);
          should.exist(res);
          expect(res.status).to.equal(200);
          expect(res.messages).to.have.property('Welcome To Teamwork Api. Please Ensure You Entered A Correct Url!!!');
          next();
        });
    });
    it('should return a json object for PUT request', async () => {
      chai.request(app)
        .put('*', (err, res, next) => {
          should.not.exist(err);
          should.exist(res);
          expect(res.status).to.equal(200);
          expect(res.messages).to.have.property('Welcome To Teamwork Api. Please Ensure You Entered A Correct Url!!!');
          next();
        });
    });
    it('should return a json object for DELETE request', async () => {
      chai.request(app)
        .delete('*', (err, res, next) => {
          should.not.exist(err);
          should.exist(res);
          expect(res.status).to.equal(200);
          expect(res.messages).to.have.property('Welcome To Teamwork Api. Please Ensure You Entered A Correct Url!!!');
          next();
        });
    });
  });
});
