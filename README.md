# Testing ground for NTD24

This project is meant to be used in the 'Enhancing Quality with AI Assistant: From Code Examination to Error Analysis' workshop at Nordic Testing Days 2024.
Workshop is conducted by Karl Toomas Vana.\
For building the testing ground [duttiv/simple-client-public](https://github.com/duttiv/simple-client-public/tree/main) by Kadri-Liis Kusmin was taken as basis.\
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).\
Favicon from [Icons8](https://icons8.com)

## Getting started

### Prerequsites

[Node.js](https://nodejs.org/en/download) has been installed.\
One of the following browsers have been installed: **Chrome, Chromium, Edge or Firefox**

### Setting up the client app

After cloning the project run `npm install` to install all the dependencies.\
For running the project locally two configuration files should be added:\
`.env` to **root** folder\
`.cypress.env.json` to **/integrationTests** folder

The contents for the configuration files will be shared separately

Before starting the client app the server should be stared that is located at [simple-server-public](https://github.com/vanatoomas/simple-server-public/tree/workshop)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `open:local`

Opens the Cypress test runner where the tests can be started for the project running at [http://localhost:3000](http://localhost:3000).\
By default the runner uses **Chrome** browser. This can be changed at the **package.json** file.\
Browser options are chrome, chromium, edge, electron and firefox.

### `run:local`

Runs all the tests in **/integrationTests/cypress/e2e** in headless mode using **Chrome** and [http://localhost:3000](http://localhost:3000)

### `cypress:open`

Opens the Cypress test runner where the tests can be started for the project running at XXX url.\
By default the runner uses **Chrome** browser. This can be changed at the **package.json** file.\
Browser options are chrome, chromium, edge, electron and firefox.

### `cypress:run`

Runs all the tests in **/integrationTests/cypress/e2e** in headless mode using **Chrome** and XXX
