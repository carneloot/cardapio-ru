FROM node:8.15

# Install tesseract
RUN apt-get update
RUN apt-get install -y tesseract-ocr
COPY assets/lang-data/por.traineddata /usr/share/tesseract-ocr/tessdata

# Create working directory
RUN mkdir - p /usr/src/app
WORKDIR /usr/src/app

# Instalar dependencias
COPY package.json .
RUN npm install
