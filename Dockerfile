FROM node:lts

WORKDIR /dev-tools-studio-backend

COPY . .

RUN npm install

