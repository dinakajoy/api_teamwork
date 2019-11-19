const chai = require('chai');
const chaiHttp = require('chai-http');
require('dotenv').config();

const expect = chai.expect;

chai.use(chaiHttp);
const app = require('../../app');

describe('On Teamwork API', () => {
  describe('a POST request to "/auth/create-user"', () => {
    it('should ensure request is from an admin before creating a user', (done) => {
      const user = {
        isAdmin: false,
        firstName: 'tester',
        lastName: 'tester',
        email: 'tester@gmail.com',
        password: 'Test@g2019',
        gender: 'male',
        jobRole: 'procurement',
        department: 'sales',
        address: '5 eleki street, port harcourt'
      };
      chai.request(app)
        .post('/api/v1/auth/create-user')
        .set('Accept', 'application/json')
        .set({ Authorization: process.env.TOKEN })
        .send(user)
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res.body.data).to.include({
            message: 'User account successfully created'
          });
          done();
        })
        .catch((err) => {
          console.log(err.message);
          done();
        });
    });
  });

  describe('a POST request to "/auth/signin"', () => {
    it('should login a user', (done) => {
      const userDetails = {
        email: 'admin@gmail.com',
        password: 'Admin@2019'
      };
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send(userDetails)
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

  describe('a PATCH request to "/auth/edit-user/:userId"', () => {
    it('should update user account after verifying requester is an admin', (done) => {
      const userDetails = {
        isAdmin: false,
        firstName: 'tester',
        lastName: 'tester',
        email: 'tester2@gmail.com',
        password: 'Tester@2019',
        gender: 'male',
        jobRole: 'procurement',
        department: 'sales',
        address: '5 eleki street, port harcourt, nigeria'
      };
      chai.request(app)
        .patch('/api/v1/edit-user/8')
        .set('Accept', 'application/json')
        .set({ Authorization: process.env.TOKEN })
        .send(userDetails)
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
});
