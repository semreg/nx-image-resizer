# Start from node base image
FROM node:12-alpine as builder

# Set the current working directory inside the container
WORKDIR /build

# Copy package.json, yarn.lock files and download deps
COPY package.json yarn.lock ./

RUN yarn global add @nrwl/cli

RUN yarn

# Copy sources to the working directory
COPY . .

# Set the node environment
ARG node_env=production

ENV NODE_ENV $node_env

# Build the Node.js app
ARG project

RUN nx build

# Start a new stage from node
FROM node:12-alpine

WORKDIR /dist

# Set the node environment (nginx stage)
ARG node_env=production
ENV NODE_ENV $node_env

# Copy the build artifacts from the previous stage
ARG project

COPY --from=builder /build/dist/apps/$project .

COPY package.json yarn.lock ./

RUN yarn

CMD ["node", "main.js"]