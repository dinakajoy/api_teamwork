const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);
const app = require('../../app');

describe('On Teamwork API', () => {
  describe('a POST request to "/categories"', () => {
    it('should ensure request is from an admin before creating category', (done) => {
      const category = 'Category One';
      chai.request(app)
        .post('/api/v1/categories')
        .set('Accept', 'application/json')
        .set({ Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTU3Mzc2MTkzNCwiZXhwIjoxNTczODQ4MzM0fQ.zgnqPudS-6snjPH_O1pnCns-SFtGYyM55bpOHDBQkHU' })
        .send(category)
        .then((res) => {
          expect(res.status).to.equal(201);
          expect(res.body.data).to.include({
            message: 'Category successfully added'
          });
          expect(res.body.errors.length).to.be.equal(0);
        })
        .catch((err) => {
          console.log(err.message);
        });
      done();
    });
  });

  describe('a GET request to "/categories"', () => {
    it('should display all categories', (done) => {
      chai.request(app)
        .post('/api/v1/categories')
        .set('Accept', 'application/json')
        .send()
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.data).to.include({
            categoryId: 1,
            category: 'Category One'
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
      done();
    });
  });
});
