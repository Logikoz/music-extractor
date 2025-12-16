FROM node:20-alpine

RUN apk add --no-cache python3 yt-dlp ffmpeg

WORKDIR /app

COPY package.json ./

RUN npm install --production

COPY server.js ./

RUN mkdir -p tmp

EXPOSE 3000

CMD ["node", "server.js"]
