FROM node:20-alpine

WORKDIR /app

#Install Bun
RUN npm install -g bun

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