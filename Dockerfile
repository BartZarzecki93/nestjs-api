FROM node:14.5 AS builder
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .
RUN ls -l
RUN npm run build

RUN ls -l
EXPOSE 3000

CMD ["npm", "run", "start"]