# First stage: Build project
FROM node as build

# Copy files and install dependencies
COPY ./ /
RUN npm install

# Build project
RUN npm run build


# Second stage: Server to deliver files
FROM node:alpine

# Port 8080 can be used as non root
EXPOSE 8080

# Create user with home directory and no password
RUN adduser -Dh /admintool admintool
USER admintool
WORKDIR /admintool

# Install http server
RUN npm install --no-save http-server

# Copy files from first stage
COPY --from=build /index.html /admintool/
COPY --from=build /dist /admintool/dist

# Run server (-g will automatically serve the gzipped files if possible)
CMD ["/admintool/node_modules/.bin/http-server", "-g", "/admintool"]
