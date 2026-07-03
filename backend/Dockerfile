FROM oven/bun:1-alpine

WORKDIR /app

#Copy package files
COPY package.json bun.lock* ./

#Install dependencies
RUN bun install 

#Copy source code
COPY . .

EXPOSE 3000

CMD ["bun", "dist/index.js"]