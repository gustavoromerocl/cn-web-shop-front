# Etapa 1: Compilar la aplicación Angular
FROM node:18 AS build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine AS production-stage

# Ajustar para copiar desde la carpeta 'browser'
COPY --from=build-stage /app/dist/web-shop-front/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
