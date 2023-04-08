FROM node:lts as frontend
WORKDIR /app/web
COPY web/package*.json ./
RUN npm ci
COPY web/ ./
RUN npm run build

# Build the Node.js backend
FROM node:lts as backend
WORKDIR /app
COPY api/package*.json ./
RUN npm ci
COPY api/ ./
RUN npm run build

COPY --from=frontend /app/web/build /app/dist/public

# Expose the server port
EXPOSE 3000

# Start the application
CMD [ "npm", "start" ]
