# Teamwork API
[![Build Status](https://travis-ci.org/odinaka-joy/api_teamwork.svg?branch=develop)](https://travis-ci.org/odinaka-joy/api_teamwork)  [![Test Coverage](https://api.codeclimate.com/v1/badges/3ad294e357d57915c818/test_coverage)](https://codeclimate.com/github/odinaka-joy/api_teamwork/test_coverage)[![Maintainability](https://api.codeclimate.com/v1/badges/3ad294e357d57915c818/maintainability)](https://codeclimate.com/github/odinaka-joy/api_teamwork/maintainability)  [![Coverage Status](https://coveralls.io/repos/github/odinaka-joy/api_teamwork/badge.svg?branch=develop)](https://coveralls.io/github/odinaka-joy/api_teamwork?branch=develop) ![GitHub](https://img.shields.io/github/license/odinaka-joy/api_teamwork?style=flat-square)

## Description
Teamwork is an internal social network for employees of an organization. The goal of this application is to facilitate more interaction between colleagues and promote team bonding.

## Installation
Clone the repository and cd into the project directory
Run npm install to install all project dependencies
Create .env file and add your database details
Run npm run dev-server to start local server which will run on localhost:3000

## Usage
### API Endpoints
**Admin Authorization**
- POST `api/v1/auth/create-user` to create employees account
- PATCH `api/v1/auth/users/:userId` to edit employees account
- DELETE `api/v1/auth/users/:userId` to delete employees account
- POST `api/v1/auth/categories` to create category to group articles

**User Authorization**
- POST `api/v1/auth/signin` to login into account
- PATCH `api/v1/auth/change-password` to change account password
- PATCH `api/v1/auth/change-photo` to change account photo
- GET `api/v1/auth/users` to get all users
- GET `api/v1/auth/users/:userId` to get a specific user based on userId
- GET `api/v1/auth/categories/:categoryId` to a single category based on categoryId
- GET `api/v1/auth/categories/` to get all categories
- GET `api/v1/auth/categories/:categoryId/articles` to get all articles associated with a single category based on categoryId

## Running the tests
To run test:
run npm run test and npm run coverage to get coverage summary.

## Heroku Link
Access api via [link](https://odinaka-joy.github.io/my-portfolio/)

## Swagger API Documentation
Access api documentation via [link](https://odinaka-joy.github.io/my-portfolio/)

## Appi Frontend
Access api front end via [link](https://odinaka-joy.github.io/my-portfolio/)

## Contributing: 
To contribute, raise an issue and it will be reviewed

## Author
[Odinaka Joy](https://odinaka-joy.github.io/my-portfolio/)

## License
This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/odinaka-joy/api_teamwork/blob/develop/LICENSE) file for details
