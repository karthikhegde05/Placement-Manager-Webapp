### Stage 1 - Build ###
FROM node:14-alpine AS build
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app/
RUN npm run build

### Stage 2 - Run on nginx ###
FROM nginx:latest
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build/ /usr/share/nginx/html
EXPOSE 80