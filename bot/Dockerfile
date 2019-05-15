FROM node:8.15

# Create working directory
RUN mkdir - p /usr/src/app
WORKDIR /usr/src/app

# Instalar dependencias
COPY package.json .
RUN npm install

CMD ["npm", "start"]