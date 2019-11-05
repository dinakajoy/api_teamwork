const should = require('chai').should();

const app = require('../app.js');

describe('Homepage Display for GET / route', () => {
  it('should return a string', async () => {
    app.get('/', (err, doc) => {
      should.not.exist(err);
      should.exist(doc);
      doc.should.be.an('object');
    });
  });
});
