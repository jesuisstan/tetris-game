# Project Documentation: Tetris Game Fullstack App

The source code with explanatory comments is available on GitHub [repository](https://github.com/jesuisstan/tetris-game).

## Objective

The primary goal of this project was to develop a full-stack tetris multiplayer game

## Implementation

The project was implemented using functional components and popular hooks in ReactJS with TypeScript and [Create React App](https://facebook.github.io/create-react-app/docs/getting-started), leveraging the Material UI library for its components and styling, in addition to custom CSS modules. The App was developed to be responsive, following a multi-platform approach. The following steps were taken to complete the project:

1.  **Backend + MongoDB implementation**: Backend was built with NestJS. Database (MongoDB) was attached to backend to store all user accounts data. Authentication (sign up and sign in) with user's email and password (encrypted) is also implemented.

2. **Material UI, Custom Styling with CSS Modules & Custom Fonts**: Material UI components were utilized to achieve a consistent and visually appealing design. Components such as TextField, Drawer, FloatingButton, LoadingButton and others were used to create responsive and user-friendly web-app and related elements. The Montserrat font was applied to the project to improve attractiveness of the App.

4. **Deployment**: 

5. **Version Control**: The code was hosted on GitHub and made publicly accessible. The repository can be found at https://github.com/jesuisstan/tetris-game.

## Results

Deployed version of the App allows user to:

- authenticate with email and password (create new account or login to existing one). To test the App a user can click the button "Test" on authentication page;

- ...

## Demonstration



## Future Improvements

While the project has been successfully implemented and deployed, there are potential areas for improvement:

....

By addressing these areas for improvement, the project can be further optimized and polished, providing an even better user experience.

## How to use
##### 1. Adjust .env file if you need other HOST, PORT, MONGO or YELP variables.
##### 2. Adjust "proxy" line in frontend/package.json file so that it points to your Server (to avoid CORS errors)
For example:
- "proxy": "http://backend:4444" (if you use docker compose to run the App)
- "proxy": "http://localhost:4444" (if you use npm)

##### 3. Run the App:
a) with Docker:
- run docker compose project:
```sh
docker compose up
```

OR

b) with NPM:
- install all the dependencies according to 'package.json' file from the root dir:
```sh
npm install
```

- Start Info Map Fullstack App:
```sh
npm start
```

##### 4. Open the App link in browser ([http://localhost:4040](http://localhost:4040) or [http://209.38.216.33:4040](http://209.38.216.33:4040) by default).

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
