# Use an official Node.js runtime as a base image
FROM node:18.16.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# copy entrypoint.sh
COPY ./scripts/entrypoint.sh .

# Copy the application code to the container
COPY . .

# run entrypoint.sh
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
