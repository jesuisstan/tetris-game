# Project Documentation: Tetris Game Fullstack App

## Objective

The primary goal of this project was to develop a full-stack tetris multiplayer game

## Implementation

The project was implemented using functional components and popular hooks in ReactJS with JavaScript and [Create React App](https://facebook.github.io/create-react-app/docs/getting-started), leveraging the Material UI library for its components and styling, in addition to custom CSS modules. The App was developed to be responsive, following a multi-platform approach. The following steps were taken to complete the project:

1.  **Backend + MongoDB implementation**: Backend was built with Node.js (express). Database (MongoDB) was attached to backend to store all user accounts data. Authentication (sign up and sign in) with user's email and password (encrypted) is also implemented.

2.  **Frontend**: Front part of the application was build with React library for Javascript, using React Router and Redux to store the application states.

3.  **Material UI, Custom Styling with CSS Modules & Custom Fonts**: Material UI components were utilized to achieve a consistent and visually appealing design. Components such as TextField, Drawer, LoadingButton and others were used to create responsive and user-friendly web-app and related elements. The Google font was applied to the project to improve attractiveness of the App.

4.  **Socket**: The communication between the server and the clients is bi-directional, Socket.io is used for the implementation.

5.  **Version Control**: The code was hosted on GitHub and made publicly accessible. The repository can be found at https://github.com/jesuisstan/tetris-game.

6.  **Testing**: Increase the reliability of the delivered versions, Jest is used as a tool for unit testing. Covered at least 70% of the statements, functions, lines and at least 50% of the branches.

7.  **Deployment**: Not yet

## Results

Deployed version of the App allows user to:

- authenticate with email and password (create new account or login to existing one). To test the App a user can click the button "Test" on authentication page;

- ...

## Demonstration

## How to use

##### 1. Install general dependencies (JS, package manager, etc):

- install Node version manager (nvm):

```sh
sudo apt install curl
```

```sh
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
```

```sh
source ~/.profile
```

restart terminal

- install NodeJS:

```sh
nvm install node
```

- install Node package manager (npm):

```sh
npm install -g npm@latest
```

##### 2. Adjust .env file if you need other HOST, PORT, MONGO variables.

##### 3. Run the App:

a) with Docker:

- run docker compose project:

```sh
docker compose up
```

OR

b) with NPM:

- install all the application dependencies according to 'package.json' files from the root, /frontend & /backend dirs:

```sh
npm run install:all
```

- Start Tetris App:

in development mode:

```sh
npm run dev
```

in production mode:

```sh
npm start
```

##### 4. Open the App link in browser ([http://localhost:4040](http://localhost:4040) by default).

##### 5. Additional commands:

- to list all Docker container:

```sh
docker ps -a
```

- to list all Docker images:

```sh
docker images
```

- to stop all running containers:

```sh
docker stop $(docker ps -q)
```

- to remove all stopped containers:

```sh
docker rm $(docker ps -a -q)
```

- to delete all Docker images

```sh
docker rmi $(docker images -q)
```
