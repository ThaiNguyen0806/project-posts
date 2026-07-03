FROM oven/bun:1-alpine

WORKDIR /app

#Copy package files
COPY package.json bun.lock* ./

#Install dependencies
RUN bun install --frozen-lockfile

#Copy source code
COPY . .

#Build typescript 
RUN bun run build

EXPOSE 3000

CMD ["bun", "dist/index.js"]