# Install node v15.3
FROM node:15.3

# Set the workdir /var/www/otp-engine
WORKDIR /var/www/otp-engine

# Copy the package.json to workdir
COPY package.json ./

# Run npm install - install the npm dependencies
RUN npm install

# Copy application source
COPY ./ ./

EXPOSE 3000

# Start the application
CMD ["npm", "start"]
