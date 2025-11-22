FROM node:20-alpine

WORKDIR /src/app

COPY package*.json ./

RUN npm install --production

RUN npm run sass

COPY . .

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /src/app

USER nodejs

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node healthcheck.js || exit 1


ENV NODE_ENV=production

CMD ["node", "server.js"]
