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

7.  **Deployment**: The application is deployed on Render.com with separate services for frontend and backend

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

## Deployment on Render.com

The application can be deployed on Render.com as separate frontend and backend services. Follow these steps:

### Backend Deployment

1. **Create a new Web Service** on Render.com
2. **Connect your GitHub repository** (select the branch with backend code)
3. **Configure the service:**
   - **Name**: `tetris-game-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (or your preferred plan)

4. **Add Environment Variables** in Render.com Dashboard:
   ```
   FRONTEND_URL=https://your-frontend-name.onrender.com
   MONGO=your-mongodb-connection-string
   JWT=your-jwt-secret-key
   REACT_APP_BACKEND_PORT=10000
   REACT_APP_FRONTEND_PORT=4040
   REACT_APP_MAX_PLAYERS_IN_ROOM=3
   REACT_APP_TETROMINOES_AMOUNT=42
   ```

5. **Note the backend URL** after deployment (e.g., `https://tetris-game-backend-verb.onrender.com`)

### Frontend Deployment

1. **Create a new Web Service** on Render.com
2. **Connect your GitHub repository** (select the branch with frontend code)
3. **Configure the service:**
   - **Name**: `tetris-game-frontend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npm start`
   - **Plan**: Free (or your preferred plan)

4. **Add Environment Variables** in Render.com Dashboard:
   ```
   REACT_APP_BACKEND_URL=https://your-backend-name.onrender.com
   REACT_APP_TEST_EMAIL=test@test.com (optional)
   REACT_APP_TEST_PASSWORD=your-password (optional)
   ```

5. **Note the frontend URL** after deployment (e.g., `https://tetris-game-frontend.onrender.com`)

6. **Update Backend Environment Variables**: After getting the frontend URL, update the `FRONTEND_URL` variable in the backend service to match your frontend URL

### Keep Services Alive (Important for Free Plan)

Render.com's free plan puts inactive services to sleep. To prevent this, create a GitHub Actions workflow:

1. **Create the workflow file** `.github/workflows/keep-alive.yml` in your repository (already included in this project)

2. **Update the URLs** in the workflow file to match your deployed services:
   ```yaml
   curl -f https://your-frontend-name.onrender.com
   curl -f https://your-backend-name.onrender.com/api/check
   ```

3. **Push to GitHub** - the workflow will automatically run every 10 minutes to keep your services active

The workflow file is located at `.github/workflows/keep-alive.yml` and can be customized to change the ping interval if needed.

### Important Notes

- **CORS Configuration**: Make sure `FRONTEND_URL` in backend matches your frontend URL exactly (with `https://`, no trailing slash)
- **Environment Variables**: React apps compile environment variables at build time, so you need to rebuild frontend after changing `REACT_APP_*` variables
- **Service Restart**: Always restart services after updating environment variables
- **Free Plan Limitations**: Services on the free plan may take 30-60 seconds to wake up after being idle

## Deployment on Render.com

The application can be deployed on Render.com as separate frontend and backend services. Follow these steps:

### Backend Deployment

1. **Create a new Web Service** on Render.com
2. **Connect your GitHub repository** (select the branch with backend code)
3. **Configure the service:**
   - **Name**: `tetris-game-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (or your preferred plan)

4. **Add Environment Variables** in Render.com Dashboard:
   ```
   FRONTEND_URL=https://your-frontend-name.onrender.com
   MONGO=your-mongodb-connection-string
   JWT=your-jwt-secret-key
   REACT_APP_BACKEND_PORT=10000
   REACT_APP_FRONTEND_PORT=4040
   REACT_APP_MAX_PLAYERS_IN_ROOM=3
   REACT_APP_TETROMINOES_AMOUNT=42
   ```

5. **Note the backend URL** after deployment (e.g., `https://tetris-game-backend-verb.onrender.com`)

### Frontend Deployment

1. **Create a new Web Service** on Render.com
2. **Connect your GitHub repository** (select the branch with frontend code)
3. **Configure the service:**
   - **Name**: `tetris-game-frontend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npm start`
   - **Plan**: Free (or your preferred plan)

4. **Add Environment Variables** in Render.com Dashboard:
   ```
   REACT_APP_BACKEND_URL=https://your-backend-name.onrender.com
   REACT_APP_TEST_EMAIL=test@test.com (optional)
   REACT_APP_TEST_PASSWORD=your-password (optional)
   ```

5. **Note the frontend URL** after deployment (e.g., `https://tetris-game-frontend.onrender.com`)

6. **Update Backend Environment Variables**: After getting the frontend URL, update the `FRONTEND_URL` variable in the backend service to match your frontend URL

### Keep Services Alive (Important for Free Plan)

Render.com's free plan puts inactive services to sleep. To prevent this, create a GitHub Actions workflow:

1. **Create the workflow file** `.github/workflows/keep-alive.yml` in your repository (already included in this project)

2. **Update the URLs** in the workflow file to match your deployed services:
   ```yaml
   curl -f https://your-frontend-name.onrender.com
   curl -f https://your-backend-name.onrender.com/api/check
   ```

3. **Push to GitHub** - the workflow will automatically run every 8 minutes to keep your services active

The workflow file is located at `.github/workflows/keep-alive.yml` and can be customized to change the ping interval if needed.

### Important Notes

- **CORS Configuration**: Make sure `FRONTEND_URL` in backend matches your frontend URL exactly (with `https://`, no trailing slash)
- **Environment Variables**: React apps compile environment variables at build time, so you need to rebuild frontend after changing `REACT_APP_*` variables
- **Service Restart**: Always restart services after updating environment variables
- **Free Plan Limitations**: Services on the free plan may take 30-60 seconds to wake up after being idle
