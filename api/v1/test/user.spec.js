const chai = require('chai');
const chaiHttp = require('chai-http');
require('dotenv').config();
require('chai/register-should');
const fs = require('fs');

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
        password: 'Test@2019',
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
          expect(res).to.have.status(500);
        });
      done();
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

  describe('a GET request to "/auth/users"', () => {
    it('should dislay all users if request is from admin', (done) => {
      chai.request(app)
        .get('/api/v1/auth/users')
        .set('Accept', 'application/json')
        .set({ Authorization: process.env.TOKEN })
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

  describe('a GET request to "/auth/user/:userId"', () => {
    it('should dislay specific users details', (done) => {
      chai.request(app)
        .get('/api/v1/auth/users/1')
        .set('Accept', 'application/json')
        .set({ Authorization: process.env.TOKEN })
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

  describe('a PATCH request to "/auth/change-photo"', () => {
    it('should update user account after verifying account owner', (done) => {
      chai.request(app)
        .patch('/api/v1/auth/change-photo')
        .set('Accept', 'application/json')
        .set({ Authorization: process.env.TOKEN })
        .attach('picture', fs.readFileSync('./api/v1/test/images/eight.jpg'), 'eight.jpg')
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

  describe('a PATCH request to "/auth/change-password"', () => {
    it('should update user account after verifying account owner', (done) => {
      const userDetails = {
        email: 'admin@gmail.com',
        password: 'Admin@2019'
      };
      chai.request(app)
        .patch('/api/v1/auth/change-password')
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

  describe('a PATCH request to "/auth/users/:userId"', () => {
    it('should update user account after verifying requester is an admin', (done) => {
      const userDetails = {
        isAdmin: false,
        firstName: 'tester',
        lastName: 'tester',
        email: 'tester@gmail.com',
        password: 'Test@2019',
        gender: 'female',
        jobRole: 'procurement',
        department: 'sales',
        address: '5 eleki street, lagos state'
      };
      chai.request(app)
        .patch('/api/v1/auth/users/3')
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

  describe('a DELETE request to "/auth/users/:userId"', () => {
    it('should delete user account after verifying request is from admin', (done) => {
      chai.request(app)
        .delete('/api/v1/auth/users/2')
        .set({ Authorization: process.env.TOKEN })
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
});
