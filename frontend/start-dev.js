// Development start script
const path = require('path');
const fs = require('fs');

// Try to load .env from multiple possible locations
const envPaths = [
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '.env'),
  path.resolve(process.cwd(), '.env')
];

let envLoaded = false;
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.log('No .env file found, using environment variables');
}

const { execSync } = require('child_process');

const port = process.env.REACT_APP_FRONTEND_PORT || 4040;
execSync(`cross-env PORT=${port} react-scripts start`, { stdio: 'inherit' });
