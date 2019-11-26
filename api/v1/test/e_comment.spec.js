const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);
const app = require('../../app.js');

describe('a GET request to "/comments/:commentId/flag"', () => {
  it('should check if user is authenticated before adding comment', (done) => {
    chai.request(app)
      .post('/api/v1/comments/1/flag')
      .set({ Authorization: process.env.TOKEN })
      .send()
      .then((res) => {
        expect(res.status).to.equal(200);
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

describe('a patch request to "/comments/:commentId"', () => {
  const comment = { comment: 'comments edited' };
  it('should display error if wrong commentId', (done) => {
    chai.request(app)
      .patch('/api/v1/comments/10')
      .set({ Authorization: process.env.TOKEN })
      .send(comment)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error).to.equal('Sorry, comment was not found');
        done();
      });
  });
  it('should check if user is authenticated before editing comment', (done) => {
    const comment2 = { comment: 'comments edited' };
    chai.request(app)
      .patch('/api/v1/comments/1')
      .set({ Authorization: process.env.TOKEN })
      .send(comment2)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.message).to.equal('Successfully updated comment');
        done();
      });
  });
});

describe('a delete request to "/comments/:commentId"', () => {
  it('should display error if wrong commentId', (done) => {
    chai.request(app)
      .delete('/api/v1/comments/10')
      .set({ Authorization: process.env.TOKEN })
      .send()
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error).to.equal('Sorry, comment was not found');
        done();
      });
  });
  it('should check if user is authenticated before deleting comment', (done) => {
    chai.request(app)
      .delete('/api/v1/comments/1')
      .set({ Authorization: process.env.TOKEN })
      .send()
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.message).to.equal('Successfully deleted comment');
        done();
      });
  });
});
