const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);
const app = require('../../app');

describe('On Teamwork API', () => {
  describe('a POST request to "/categories"', () => {
    it('should ensure request is from an admin before creating category', (done) => {
      const category = {
        category: 'New category'
      };
      chai.request(app)
        .post('/api/v1/categories')
        .set('Accept', 'application/json')
        .set({ Authorization: process.env.TOKEN })
        .send(category)
        .then((res) => {
          expect(res.status).to.equal(201);
          expect(res.body.data).to.include({
            message: 'Category successfully added'
          });
          done();
        })
        .catch((err) => {
          console.log(err.message);
          done();
        });
    });
  });

  describe('a GET request to "/categories"', () => {
    it('should display all categories', (done) => {
      chai.request(app)
        .get('/api/v1/categories')
        .send()
        .then((res) => {
          expect(res).to.have.status(200);
          done();
        })
        .catch((err) => {
          console.log(err.message);
          done();
        });
    });
  });

  describe('a GET request to "/categories/:categoriesId/articles"', () => {
    it('should display all articles related a specific category', (done) => {
      chai.request(app)
        .get('/api/v1/categories/1/articles')
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

  describe('a PUT request to "/categories/:categoryId"', () => {
    it('should ensure request is from an admin before updating category', (done) => {
      const category = {
        category: 'New category edited'
      };
      chai.request(app)
        .put('/api/v1/categories/1')
        .set('Accept', 'application/json')
        .set({ Authorization: process.env.TOKEN })
        .send(category)
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
