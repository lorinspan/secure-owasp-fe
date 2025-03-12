# Build Angular App
FROM node:20 AS build
WORKDIR /app

# Copiaza doar fisierele necesare pentru instalarea dependentelor
COPY package.json package-lock.json ./

# Instaleaza dependentele
RUN npm install

# Copiaza restul codului sursa
COPY . .

# Construieste aplicatia pentru productie
RUN npm run build

# Serve App with Nginx
FROM nginx:1.25
COPY --from=build /app/dist/secure-owasp-fe/browser /usr/share/nginx/html

# Copiaza configuratia Nginx optimizata pentru Angular SPA
COPY ./nginx.conf /etc/nginx/conf.d/default.conf