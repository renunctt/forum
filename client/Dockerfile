FROM oven/bun:1
WORKDIR /usr/src/app

COPY package.json .
COPY bun.lockb .
RUN bun install
COPY . .

EXPOSE 5000
CMD ["bun", "run", "dev"]
