FROM node:lts

WORKDIR /dev-tools-studio-backend

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["node", "--env-file=.prod.env","dist/index.js"]