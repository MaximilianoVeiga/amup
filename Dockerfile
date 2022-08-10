# Build final runtime container
FROM node:16-alpine

# Set directory for all files
WORKDIR /opt/amup/core

# Set up environment variables
ENV URL=localhost
ENV PORT=3000
ENV USERNAME
ENV PASSWORD
ENV AUTH_TOKEN

# Copy over source code
COPY . .

# Install all packages
RUN npm ci --production

# Expose port to outside world
EXPOSE 3000

# Start server up
CMD [ "node", "src/index.js" ]