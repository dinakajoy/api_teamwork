const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);
const app = require('../../app');

describe('a POST request to "/categories"', () => {
  it('should ensure request is from an admin before creating category', (done) => {
    const category = {
      category: 'category one'
    };
    chai.request(app)
      .post('/api/v1/categories')
      .set('Accept', 'application/json')
      .set({ Authorization: process.env.TOKEN })
      .send(category)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.data).to.be.a('object');
        expect(res.body.data.message).to.equal('Category successfully added');
        expect(res.body.data.categoryId).to.equal(1);
        expect(res.body.data.category).to.equal(category.category);
        done();
      });
  });
  it('should ensure request is from an admin before creating category', (done) => {
    const category2 = {
      category: 'category two'
    };
    chai.request(app)
      .post('/api/v1/categories')
      .set('Accept', 'application/json')
      .set({ Authorization: process.env.TOKEN })
      .send(category2)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.data).to.be.a('object');
        expect(res.body.data.message).to.equal('Category successfully added');
        expect(res.body.data.categoryId).to.equal(2);
        expect(res.body.data.category).to.equal(category2.category);
        done();
      });
  });
});

describe('a GET request to "/categories"', () => {
  it('should display all categories', (done) => {
    chai.request(app)
      .get('/api/v1/categories')
      .set({ Authorization: process.env.TOKEN })
      .send()
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.be.a('array');
        done();
      });
  });
});

describe('a PATCH request to "/categories/:categoryId"', () => {
  it('should display 404 if wrong route', (done) => {
    const category = {
      category: 'New category edited'
    };
    chai.request(app)
      .patch('/api/v1/categories/90')
      .set('Accept', 'application/json')
      .set({ Authorization: process.env.TOKEN })
      .send(category)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error).to.equal('Not Found');
        done();
      });
  });
  it('should ensure request is from an admin before updating category', (done) => {
    const category = {
      category: 'New category edited'
    };
    chai.request(app)
      .patch('/api/v1/categories/1')
      .set('Accept', 'application/json')
      .set({ Authorization: process.env.TOKEN })
      .send(category)
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data.message).to.equal('Category updated successfully');
        expect(res.body.data.category).to.equal(category.category);
        done();
      })
      .catch((err) => {
        console.log(err.message);
        done();
      });
  });
});
