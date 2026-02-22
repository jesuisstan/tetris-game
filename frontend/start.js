// Production start script for Render.com
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

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
    console.log(`Loaded .env from: ${envPath}`);
    break;
  }
}

if (!envLoaded) {
  // Environment variables should be set via Render.com dashboard
  console.log(
    'No .env file found, using environment variables from Render.com'
  );
}

// Use PORT from Render.com (automatically set) or fallback to REACT_APP_FRONTEND_PORT or default
const port = process.env.PORT || process.env.REACT_APP_FRONTEND_PORT || 4040;

console.log(`Starting production server on port ${port}...`);

// Build the project first
console.log('Building React app...');
execSync('npm run build', { stdio: 'inherit' });

// Serve the build directory
console.log(`Serving build directory on port ${port}...`);
execSync(`npx serve -s build -l ${port}`, { stdio: 'inherit' });
