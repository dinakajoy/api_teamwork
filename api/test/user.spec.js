const chai = require('chai');
const chatHttp = require('chai-http');

// const should = require('chai/register-should');
const app = require('../app');

chai.use(chatHttp);
const { expect } = chai;

describe('Testing the create-account endpoints:', () => {
  it('It should create a user', (done) => {
    const user = {
      firstName: 'timi',
      lastName: 'adu',
      email: 'jjjj@gmail.com',
      password: 'Uju909',
      gender: 'male',
      jobRole: 'procurement',
      department: 'sales',
      address: '5 eleki street, port harcourt'
    };
    chai.request(app)
      .post('/api/v1/auth/create-account')
      .set('Accept', 'application/json')
      .send(user)
      .then((res) => {
        expect(res.status).to.equal(201);
        expect(res.body.data).to.include({
          message: 'User account successfully created'
        });
      })
      .catch((err) => {
        throw err;
      });
    done();
  });
});
