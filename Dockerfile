FROM node:lts

WORKDIR /dev-tools-studio-backend

COPY . .

RUN npm install

EXPOSE 3000

CMD [ "npm", "run", "dev" ]