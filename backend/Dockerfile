FROM node:20-alpine

RUN apk add --no-cache python3 yt-dlp ffmpeg

WORKDIR /app
COPY server.js .

EXPOSE 3000
CMD ["node", "server.js"]
