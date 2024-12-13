# Base Docker image for multi-stage build
FROM node:23 AS base

WORKDIR /usr/app

COPY . ./

# Builds NextJS application
# hadolint ignore=DL3006
FROM base AS build

RUN CYPRESS_INSTALL_BINARY=0 npm install && npm run build

# Installs production dependencies
# hadolint ignore=DL3006
FROM base AS production-deps

RUN npm install --production

# NextJS production application
FROM node:23-alpine AS nextjs-app

ENV NODE_ENV=production

WORKDIR /usr/app

COPY --from=build /usr/app/.next ./.next
COPY --from=production-deps /usr/app/node_modules ./node_modules
COPY public ./public
COPY package.json ./
COPY next.config.js ./

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD curl --fail http://localhost:3000/api/health/ || exit 1

ENTRYPOINT [ "npm", "start" ]
