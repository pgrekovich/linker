FROM node:lts

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy the source code to the working directory
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the server port
EXPOSE 3000

# Start the application
CMD [ "npm", "start" ]