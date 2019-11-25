const chai = require('chai');
const chaiHttp = require('chai-http');
require('dotenv').config();
require('chai/register-should');
const fs = require('fs');

const expect = chai.expect;

chai.use(chaiHttp);
const app = require('../../app');

describe('a POST request to "/auth/create-admin"', () => {
  it('should create admin', (done) => {
    const admin = {
      isAdmin: true,
      firstName: 'administrative',
      lastName: 'manager',
      email: 'admin@gmail.com',
      password: 'Admin@2019',
      gender: 'male',
      jobRole: 'manager',
      department: 'administrative',
      address: '2 igba street, lagos state'
    };
    chai.request(app)
      .post('/api/v1/auth/create-admin')
      .set('Accept', 'application/json')
      .send(admin)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.data.message).to.equal('User account successfully created');
        expect(res.body.data.isAdmin).to.equal(admin.isAdmin);
        expect(res.body.data.firstName).to.equal(admin.firstName);
        expect(res.body.data.lastName).to.equal(admin.lastName);
        expect(res.body.data.email).to.equal(admin.email);
        expect(res.body.data.gender).to.equal(admin.gender);
        expect(res.body.data.jobRole).to.equal(admin.jobRole);
        expect(res.body.data.department).to.equal(admin.department);
        expect(res.body.data.address).to.equal(admin.address);
        done();
      });
  });

  it('should return error if token is not provided', (done) => {
    const user = {
      isAdmin: false,
      firstName: 'tester',
      lastName: 'tester',
      email: 'tester@gmail.com',
      password: 'Test@2019',
      gender: 'male',
      jobRole: 'manager',
      department: 'administrative',
      address: '4 ogboni street, rivers state'
    };
    chai.request(app)
      .post('/api/v1/auth/create-user')
      .set('Accept', 'application/json')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('Token is not provided');
        done();
      });
  });

  it('should create an employee', (done) => {
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
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.data.message).to.equal('User account successfully created');
        expect(res.body.data.isAdmin).to.equal(user.isAdmin);
        expect(res.body.data.firstName).to.equal(user.firstName);
        expect(res.body.data.lastName).to.equal(user.lastName);
        expect(res.body.data.email).to.equal(user.email);
        expect(res.body.data.gender).to.equal(user.gender);
        expect(res.body.data.jobRole).to.equal(user.jobRole);
        expect(res.body.data.department).to.equal(user.department);
        expect(res.body.data.address).to.equal(user.address);
        done();
      });
  });
});

describe('a POST request to "/auth/signin"', () => {
  it('should throw error if wrong email', (done) => {
    const userDetails = {
      email: 'wrongEmail@gmail.com',
      password: 'Admin@2019'
    };
    chai.request(app)
      .post('/api/v1/auth/signin')
      .set('Accept', 'application/json')
      .send(userDetails)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error).to.equal('User not found');
        done();
      });
  });

  it('should throw error if wrong password', (done) => {
    const userDetails = {
      email: 'admin@gmail.com',
      password: 'wrongPassword'
    };
    chai.request(app)
      .post('/api/v1/auth/signin')
      .set('Accept', 'application/json')
      .send(userDetails)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.error).to.equal('Invalid credentials');
        done();
      });
  });

  it('should login a user if correct email and password', (done) => {
    const userDetails = {
      email: 'admin@gmail.com',
      password: 'Admin@2019'
    };
    chai.request(app)
      .post('/api/v1/auth/signin')
      .set('Accept', 'application/json')
      .send(userDetails)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.a('object');
        done();
      });
  });
});

describe('a GET request to "/auth/users"', () => {
  it('should dislay all users if request is from authenticated', (done) => {
    chai.request(app)
      .get('/api/v1/auth/users')
      .set('Accept', 'application/json')
      .set({ Authorization: process.env.TOKEN })
      .send()
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.a('array');
        done();
      });
  });
});

describe('a GET request to "/auth/user/:userId"', () => {
  it('should dislay error if userId is not found', (done) => {
    chai.request(app)
      .get('/api/v1/auth/users/100')
      .set('Accept', 'application/json')
      .set({ Authorization: process.env.TOKEN })
      .send()
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error).to.equal('User not found');
        done();
      });
  });
  it('should dislay specific users details', (done) => {
    chai.request(app)
      .get('/api/v1/auth/users/1')
      .set('Accept', 'application/json')
      .set({ Authorization: process.env.TOKEN })
      .send()
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.a('object');
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
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe('a PATCH request to "/auth/change-password"', () => {
  it('should throw error if wrong email', (done) => {
    const userDetails = {
      email: 'wrong@gmail.com',
      password: 'Admin@2019'
    };
    chai.request(app)
      .patch('/api/v1/auth/change-password')
      .set('Accept', 'application/json')
      .set({ Authorization: process.env.TOKEN })
      .send(userDetails)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error).to.equal('User not found');
        done();
      });
  });
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
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.a('object');
        done();
      });
  });
});

describe('a PATCH request to "/auth/users/:userId"', () => {
  it('should display error if userId is not available', (done) => {
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
      .patch('/api/v1/auth/users/20')
      .set('Accept', 'application/json')
      .set({ Authorization: process.env.TOKEN })
      .send(userDetails)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error).to.equal('Not found');
        done();
      });
  });
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
      .patch('/api/v1/auth/users/2')
      .set('Accept', 'application/json')
      .set({ Authorization: process.env.TOKEN })
      .send(userDetails)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.a('object');
        done();
      })
      .catch((err) => {
        console.log(err.message);
        done();
      });
  });
});

describe('a DELETE request to "/auth/users/:userId"', () => {
  it('should display error if userId is not available', (done) => {
    chai.request(app)
      .delete('/api/v1/auth/users/20')
      .set('Accept', 'application/json')
      .set({ Authorization: process.env.TOKEN })
      .send()
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error).to.equal('User with id not found');
        done();
      });
  });
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
