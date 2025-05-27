FROM node:lts

WORKDIR /dev-tools-studio

COPY . .

RUN npm install

EXPOSE 3000

CMD [ "npm", "run", "dev" ]