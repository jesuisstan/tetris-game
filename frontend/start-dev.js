// CommonJS module:
require('dotenv').config();

const { execSync } = require('child_process');

const port = process.env.REACT_APP_FRONTEND_PORT || 4040;
execSync(`cross-env PORT=${port} react-scripts start`, { stdio: 'inherit' });
