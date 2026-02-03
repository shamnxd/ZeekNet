
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Set NODE_PATH via env var to ensure absolute imports work in dist
ENV NODE_PATH=./dist

RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]
