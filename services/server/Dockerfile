# Use an official Node.js runtime as a parent image
FROM node:20

# Set the environment variable
RUN apt update && apt upgrade -y \
  && apt install -y cowsay curl
# Install kubectl

ENV PATH "$PATH:/usr/games"

# Copy needed files
COPY package.json .
COPY package-lock.json .
COPY dist dist
RUN npm ci

# Expose any necessary ports
EXPOSE 3000

# Run the application
ENTRYPOINT ["node", "dist"]
