# Build final runtime container
FROM node:16-slim

# Set directory for all files
WORKDIR /opt/amup/core

# Set up environment variables
ENV URL=localhost
ENV PORT=3000
ENV USERNAME=admin
ENV PASSWORD=admin
ENV AUTH_TOKEN=JY9qTIKwPzWftbRUdeFZjMGH6GflG9utuj8PEdajyJEZNXivANC11qqRbVRD

# Copy over source code
COPY . .

# Install all packages
RUN npm ci --production

# Expose port to outside world
EXPOSE 3000

# Start server up
CMD [ "node", "src/index.js" ]