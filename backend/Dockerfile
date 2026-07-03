FROM oven/bun:1-alpine

WORKDIR /app

RUN bun add -g typescript tsc-alias

#Copy package files
COPY package.json bun.lock* ./

#Install dependencies
RUN bun install 

#Copy source code
COPY . .

#Build typescript 
RUN bun run build

EXPOSE 3000

CMD ["bun", "dist/index.js"]