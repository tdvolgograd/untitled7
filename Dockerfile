# Stage 1: Build the Angular application
FROM node:latest AS build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json  ./

RUN npm install

RUN npm install -g @angular/cli
# Copy application source code and build
COPY . .

RUN npm run build --configuration=production

# Stage 2: Serve the application with Nginx
FROM nginx:latest
#
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# Copy built application from previous stage
COPY --from=build /app/dist/untitled7 /usr/share/nginx/html
COPY --from=build /app/dist/untitled7 /usr/share/nginx/html

# Expose port and start Nginx server
EXPOSE 80

