FROM oven/bun:1 as base
WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY bun.lockb /usr/src/app
RUN bun install

COPY . .

EXPOSE 3000
CMD [ "bun", "run", "index.ts" ]
