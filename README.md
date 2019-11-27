# Teamwork API
[![Build Status](https://travis-ci.org/odinaka-joy/api_teamwork.svg?branch=develop)](https://travis-ci.org/odinaka-joy/api_teamwork)  [![Test Coverage](https://api.codeclimate.com/v1/badges/3ad294e357d57915c818/test_coverage)](https://codeclimate.com/github/odinaka-joy/api_teamwork/test_coverage)[![Maintainability](https://api.codeclimate.com/v1/badges/3ad294e357d57915c818/maintainability)](https://codeclimate.com/github/odinaka-joy/api_teamwork/maintainability)  [![Coverage Status](https://coveralls.io/repos/github/odinaka-joy/api_teamwork/badge.png?branch=develop)](https://coveralls.io/github/odinaka-joy/api_teamwork?branch=develop) ![GitHub](https://img.shields.io/github/license/odinaka-joy/api_teamwork?style=flat-square)

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
- POST `api/v1/categories` to create category to group articles
- PATCH `api/v1/categories/:categoryId` to edit category to group articles
- GET `api/v1/flags` to get all flagged articles, gifs and comments
- DELETE `api/v1/:typeId/:type` to delete flagged articles, gifs and comments where `:typeId` specifies the item (articles, gifs or comments)Id and `type` specifies article, gif or comment

**User Authorization**
- POST `api/v1/auth/signin` to login into account
- PATCH `api/v1/auth/change-password` to change account password
- PATCH `api/v1/auth/change-photo` to change account photo
- GET `api/v1/auth/users` to get all users
- GET `api/v1/auth/users/:userId` to get a specific user based on userId
- GET `api/v1/categories/` to get all categories
- GET `api/v1/categories/:categoryId/articles` to get all articles associated with a single category based on categoryId
- POST `api/v1/articles` to create article
- PATCH `api/v1/articles/:articleId` to edit article
- GET `api/v1/articles/:articleId` to get article with articleId
- DELETE `api/v1/articles/:articleId` to delete article with articleId
- POST `api/v1/articles/:articleId/comment` to comment on article with articleId
- POST `api/v1/articles/:articleId/flag` to flag article with articleId
- POST `api/v1/gifs` to create gif
- GET `api/v1/gifs/:gifId` to get gif with gifId
- DELETE `api/v1/gifs/:gifId` to delete gif with gifId
- POST `api/v1/gifs/:gifId/comment` to comment on gif with gifId
- POST `api/v1/gifs/:gifId/flag` to flag gif with gifId
- PATCH `api/v1/comments/:commentId` to edit comment
- DELETE `api/v1/comments/:commentId` to delete comment with commentId
- POST `api/v1/comments/:commentId/flag` to flag comment with commentId

## Running the tests
To run test:
run npm run test and npm run coverage to get coverage summary.

## Built With
Node/Express - The web framework used
posgreSQL - DataBase Management System

## Heroku Link
Access api via [link](https://api-teamwork-by-joy.herokuapp.com/api/v1)

## Swagger API Documentation
Access api documentation via [link](https://api-teamwork-by-joy.herokuapp.com/docs/v1)

## Api Frontend
Access api front end via [link](https://odinaka-joy.github.io/my-portfolio/)

## Contributing: 
To contribute, raise an issue and it will be reviewed

## Author
[Odinaka Joy](https://odinaka-joy.github.io/my-portfolio/)

## Versioning
This is the version one of this api

## License
This project is licensed under the MIT License - see the [MIT License](https://opensource.org/licenses/MIT) file for details

## Acknowledgments
Andela
OpenClassrooms
Facebook
DevCTrainingWithAndela Learners and mentors
