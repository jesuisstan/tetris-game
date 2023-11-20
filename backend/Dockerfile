# Use the Node.js base image for the backend
FROM node:14 as backend

# Set the working directory for the backend in the container
WORKDIR /app/backend

# Copy the backend package.json and package-lock.json
COPY backend/package.json ./

# Install backend dependencies
RUN npm install

# Copy backend files to the working directory in the container
COPY backend ./

# Expose the port for the backend
EXPOSE 4444

# Start the backend
CMD ["npm", "start"]
