FROM node:lts

WORKDIR /dev-tools-studio-backend

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["node","dist/index.js"]

# CMD ["node", "--env-file=src/config/environments/prod.env","dist/index.js"]
