FROM node:14

RUN mkdir -p /app
WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .

EXPOSE 3000

CMD ["npm", "start"]