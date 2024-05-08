# RESTful API for a To-Do List Application

Build a restful API for a To-Do List Application

## Table of Contents

- [Description](#description)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Documentation](#documentation)
- [Author](#author)

## Description

Create a RESTful API for a simple To-Do List application. The API should allow users to perform basic CRUD (Create, Read, Update, Delete) operations on their to-do lists and tasks.

## Prerequisites

The following are required to Run the application in development

- [Node.js](https://nodejs.org)
- [MySQL](https://dev.mysql.com/)
- [npm](https://www.npmjs.com/)

## Getting Started

To run the application, ensure the [prerequisites](#prerequisites) are met then follow the following steps in sequence.

1. Clone the project `git clone https://github.com/EyoElijah/mtn-assessment.git`,
2. Navigate to the project root directory `cd mtn-assessment`
3. Execute the command `npm install` to install all project dependencies
4. Create a `.env` file by executing `cp .env.example .env` while in the project root directory
5. Update the `.env` file with the appropriate values for the environment variables. see the [.env.example](.env.sample) for detailed instruction

## Usage

To use the project, set up the [prerequisite](#prerequisites) and follow the [installation](#installation) guide, afterward, consult the commands below for instructions on where to go next

- execute `npm run start:dev` to run the application in development mode
- execute `npm run start:prod` to run the application optimized for the production environment
- execute `npm run test` run the applications unit test

## Documentation

The API documentation is available at [http://localhost:3000/docs](http://localhost:3000/docs)

Note: if you use a different port, ensure to replace the port in the url
`http://localhost:<port>/docs`

## Author

Eyo Elijah
