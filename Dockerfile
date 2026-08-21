FROM node:20-alpine
WORKDIR /app
COPY package.json ./
COPY server.js ./
COPY index.html styles.css app.js ./
ENV NODE_ENV=production
EXPOSE 4173
CMD ["node", "server.js"]
