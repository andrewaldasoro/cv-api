FROM node:12.19.0-alpine

ARG MAPBOX_ACCESS_TOKEN
ARG GOOGLE_CLOUD_API_TOKEN

ENV MAPBOX_ACCESS_TOKEN=$MAPBOX_ACCESS_TOKEN
ENV GOOGLE_CLOUD_API_TOKEN=$GOOGLE_CLOUD_API_TOKEN

WORKDIR /usr/src/app
COPY .env.prod ./.env
COPY package.json yarn.lock ./
RUN yarn install --production

COPY . .

EXPOSE 3000

CMD ["node", "./bin/www"]