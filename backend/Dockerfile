FROM node:22

# update the repository sources list
# and install dependencies
RUN apt-get update \
    && apt-get install -y curl \
    && apt install -y hashcat \
    && apt-get -y autoclean

WORKDIR /backend
COPY ./package.json .
COPY ./package-lock.json .

# install dependencies
RUN npm ci

COPY ./cognito ./cognito
COPY ./crack ./crack
COPY ./server.js ./server.js

ENV AWS_ACCESS_KEY_ID ""
ENV AWS_SECRET_ACCESS_KEY ""
ENV AWS_SESSION_TOKEN ""
ENV NODE_ENV "production"

# run backend
ENTRYPOINT ["npm", "run", "start"]