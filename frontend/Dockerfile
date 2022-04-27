### Stage 1 - Build ###
FROM node:14-alpine AS build
WORKDIR /app
COPY package*.json /app/
RUN npm install
ARG APP_URL
ENV APP_URL $APP_URL
COPY ./ /app/
RUN npm run build

### Stage 2 - Run on nginx ###
FROM nginx:1.17.1-alpine
COPY ./nginx.conf /etc/nginx/conf.d/nginx.conf
COPY --from=build /app/build/ /usr/share/nginx/html
EXPOSE 80