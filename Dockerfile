FROM node:20-alpine
WORKDIR /app
# Copia package.json e package-lock.json
COPY package*.json ./
# Installa le dipendenze
RUN npm ci
# Copia tutto il codice sorgente
COPY . .
# Esponi la porta
EXPOSE 3000
# Comando di avvio
ENTRYPOINT ["npm", "start"]