require('dotenv').config();

const { execSync } = require('child_process');

const port = process.env.REACT_APP_FRONTEND_PORT || 4040;

// Build the project
execSync('react-scripts build', { stdio: 'inherit' });

// Serve the build directory
execSync(`serve -s build -l ${port}`, { stdio: 'inherit' });
