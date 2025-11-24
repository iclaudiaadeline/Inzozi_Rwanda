# Use Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the React app
RUN npm run build

# Install serve to host the production build
RUN npm install -g serve

# Expose frontend port
EXPOSE 3000

# Serve with single-page app support (handles React Router)
CMD ["serve", "-s", "build", "-l", "3000", "--single"]