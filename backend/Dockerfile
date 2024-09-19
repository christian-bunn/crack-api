FROM ubuntu:latest
RUN apt update && apt install -y hashcat
WORKDIR /app


# update the repository sources list
# and install dependencies
RUN apt-get update \
    && apt-get install -y curl \
    && apt-get -y autoclean

# install node js
# install node and npm
RUN source $NVM_DIR/nvm.sh \
    && nvm install node \
    && nvm alias default node \
    && nvm use default

RUN apt install -y curl
# install dependencies
RUN npm init -y \
    npm i @aws-sdk/client-s3 \
    npm i dotenv \
    npm install multer \
    npm install aws-sdk

# run backend
RUN node server.js