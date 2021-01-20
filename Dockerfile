ARG node_version=14.15.4-alpine3.12

# Base Docker image for multi-stage build
FROM node:${node_version} AS base

WORKDIR /usr/app

COPY package.json package-lock.json src public ./

RUN npm ci && npm run build

# NextJS development application
FROM base AS nextjs-dev-app

EXPOSE 3000

ENTRYPOINT [ "npm", "run", "dev" ]

# NextJS production application
FROM node:${node_version} AS nextjs-app

ENV NODE_ENV=production

WORKDIR /usr/app

COPY --from=base /usr/app/.next ./.next
COPY --from=base /usr/app/node_modules ./node_modules
COPY public package.json ./

USER node

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]