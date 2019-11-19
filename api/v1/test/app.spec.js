const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);
const app = require('../../app.js');

describe('On Teamwork Api', () => {
  describe('a GET request to "/" route', () => {
    it('should return a json object', async () => {
      chai.request(app).get('/', (err, res, next) => {
        should.not.exist(err);
        should.exist(res);
        expect(res.status).to.equal(200);
        expect(res.messages).to.have.property('YAY! Congratulations! Your Are Connected To Teamwork Api. But, You Must Be Authorized To Continue!!!');
        next();
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
