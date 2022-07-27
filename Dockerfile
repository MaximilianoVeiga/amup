# Build final runtime container
FROM node:16-alpine
# Set directory for all files
WORKDIR /opt/amup/core
# Copy over source code
COPY . .
# Install all packages
RUN npm ci --production
# Expose port to outside world
EXPOSE 3000
# Start server up
CMD [ "node", "src/index.js" ]