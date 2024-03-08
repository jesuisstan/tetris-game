# Use the Node.js base image for the frontend
FROM node:21 as frontend

# Set the working directory for the frontend in the container
WORKDIR /app/frontend

# Copy the frontend package.json and package-lock.json
COPY frontend/package.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend files to the working directory in the container
COPY frontend ./

# Expose the port for the frontend development server
EXPOSE 4040

# Start the frontend application in development mode
CMD ["npm", "start"]
