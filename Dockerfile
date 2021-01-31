FROM node:latest AS builder
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:latest
WORKDIR /app
COPY --from=builder /app ./
RUN ls -l
EXPOSE 5001
CMD ["npm", "run", "start"]