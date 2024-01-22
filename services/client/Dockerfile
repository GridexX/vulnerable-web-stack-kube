FROM node:20 as build-stage
WORKDIR /app
COPY . .
RUN npm install
ENV NODE_ENV=production
RUN npm run build

FROM nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
