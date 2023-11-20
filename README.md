# Project Documentation: Info Map Fullstack App

The deployed project can be accessed at http://209.38.216.33:4040/. \
The source code with explanatory comments is available on GitHub [repository](https://github.com/jesuisstan/InfoMapApp).

## Objective

The primary goal of this project was to develop a web app using react / typescript to display a map and API data.
The Info Map App displays a map interface with interactive markers representing places fetched from the Yelp Fusion API, enabling users to explore different categories and adjust the number of visible places. It offers a dynamic and user-friendly way to discover and interact with location-based data.

## Implementation

The project was implemented using functional components and popular hooks in ReactJS with TypeScript and [Create React App](https://facebook.github.io/create-react-app/docs/getting-started), leveraging the Material UI library for its components and styling, in addition to custom CSS modules. The Contact Book App was developed to be responsive, following a multi-platform approach. The following steps were taken to complete the project:

1.  **Backend + MongoDB implementation**: Backend was built with NodeJS and Express server to save time. Database (MongoDB) was attached to backend to store all user accounts data. Authentication (sign up and sign in) with user's email and password (encrypted) is also implemented.

2. **Material UI, Custom Styling with CSS Modules & Custom Fonts**: Material UI components were utilized to achieve a consistent and visually appealing design. Components such as TextField, Drawer, FloatingButton, LoadingButton and others were used to create responsive and user-friendly web-app and related elements. The Montserrat font was applied to the project to improve attractiveness of the App.

3. **Map visualizing**: The App imports the [Leaflet library](https://leafletjs.com/) for interactive map functionality and styles it using Leaflet's CSS.

3. **API callingt**: The App serves as a map-based interface to display and interact with places fetched from the [Yelp Fusion API](https://www.yelp.fr/paris).
It fetches places data from the Yelp Fusion API using Axios, passing relevant parameters such as the selected category, fixed coordinates, and visible amount.
The fetched places data are looped through, and markers are added to the map for each place using Leaflet's L.marker. Popups and tooltips are also configured for each marker.

4. **Deployment**: The code was deployed on a Digital Ocean web server and made accessible through the [URL](http://209.38.216.33:4040/).

5. **Version Control**: The code was hosted on GitHub and made publicly accessible. The repository can be found at https://github.com/jesuisstan/InfoMapApp.

## Results

Deployed version of the App allows user to:

- authenticate with email and password (create new account or login to existing one). To test the App a user can click the button "Test" on authentication page;

- start application from the default map position - Paris. User always can return to this point, clicking on the floating button Home in the bottom right corner of the page;

- fetch specific places of interest according to available categories in selector;

- fetch from 10 to 50 (max size of data array according to the free Yelp Fusion API plan) places of interest. Max amount of requests per day - 500;

- get additional information about a place of interest by clicking on it's map marker;

- move through the whole map and fetch new places of interest by clicking on any point of the map.

## Demonstration


https://github.com/jesuisstan/InfoMapApp/assets/82715902/951bb119-629e-4c23-a3c9-3200c94a853b



## Future Improvements

While the project has been successfully implemented and deployed, there are potential areas for improvement:

- **Unit Testing**: Implementing unit tests for the components and functionality of the Info Map App would help ensure the stability and maintainability of the codebase, allowing for easier future modifications and bug fixes.

- **Safari browser support** was not tested.

- **API requests** from frontend are supposed to be moved to backend.


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
