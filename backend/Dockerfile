FROM oven/bun:1-slim

WORKDIR /usr/src/app

COPY package.json bun.lockb* ./

RUN bun install --production --frozen-lockfile

COPY . .

RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "server:prod"]