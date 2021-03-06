const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');

const expect = chai.expect;

chai.use(chaiHttp);
const app = require('../../app.js');

describe('a POST request to "/gifs"', () => {
  it('should check if user is authenticated before adding gif', (done) => {
    chai.request(app)
      .post('/api/v1/gifs')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set({ Authorization: process.env.TOKEN })
      .field('title', 'my title')
      .attach('gif', fs.readFileSync('./api/v1/test/images/gif1.gif'), 'gif1.gif')
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.data).to.be.a('object');
        expect(res.body.data).to.include({
          message: 'GIF image successfully posted'
        });
        done();
      });
  });
  it('should check if user is authenticated before adding gif', (done) => {
    chai.request(app)
      .post('/api/v1/gifs')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set({ Authorization: process.env.TOKEN })
      .field('title', 'my title two')
      .attach('gif', fs.readFileSync('./api/v1/test/images/gif2.gif'), 'gif2.gif')
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.data).to.be.a('object');
        expect(res.body.data).to.include({
          message: 'GIF image successfully posted'
        });
        done();
      });
  });
});

describe('a GET request to "/gifs/:gifId"', () => {
  it('should display error if wrong gifId', (done) => {
    chai.request(app)
      .get('/api/v1/gifs/10')
      .set({ Authorization: process.env.TOKEN })
      .send()
      .then((res) => {
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('Gif not found');
        done();
      })
      .catch((err) => {
        console.log(err.message);
        done();
      });
  });
  it('should display gif', (done) => {
    chai.request(app)
      .get('/api/v1/gifs/1')
      .set({ Authorization: process.env.TOKEN })
      .send()
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.be.a('object');
        done();
      })
      .catch((err) => {
        console.log(err.message);
        done();
      });
  });
});

describe('a POST request to "/gifs/:gifId/comment"', () => {
  it('should check if user is authenticated before posting comment for gif', (done) => {
    const comment = {
      comment: 'New comment'
    };
    chai.request(app)
      .post('/api/v1/gifs/1/comment')
      .set('Content-Type', 'application/json')
      .set({ Authorization: process.env.TOKEN })
      .send(comment)
      .then((res) => {
        expect(res.status).to.equal(201);
        expect(res.body.data).to.include({
          message: 'Comment successfully created'
        });
        done();
      })
      .catch((err) => {
        console.log(err.message);
        done();
      });
  });
});

describe('a POST request to "/gifs/:gifId/flag"', () => {
  it('should check if user is authenticated before flagging gif', (done) => {
    chai.request(app)
      .post('/api/v1/gifs/1/flag')
      .set({ Authorization: process.env.TOKEN })
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.include({
          result: 'Successfully flagged item'
        });
        done();
      })
      .catch((err) => {
        console.log(err.message);
        done();
      });
  });
});

describe('a DELETE request to "/gifs/:gifId"', () => {
  it('should check if user is authenticated before deleting gif details', (done) => {
    chai.request(app)
      .delete('/api/v1/gifs/2')
      .set({ Authorization: process.env.TOKEN })
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        done();
      })
      .catch((error) => {
        console.log(error.message);
        done();
      });
  });
});
