#FROM node:16 as builder
FROM python:3.6-alpine
FROM node:16 as builder
RUN apt update -y
RUN apt install git -y

ENV NODE_ENV=production
WORKDIR /data
COPY . .

RUN npm install

CMD ["npm", "start"]
