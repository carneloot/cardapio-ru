// Dotenv
import * as dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/../.env` });

import * as mongoose from 'mongoose';
import { bot } from './helpers/bot';
import { logger } from './middlewares/logger';
import { startUser } from './helpers/startUser';
import { initAgenda } from './agenda/agenda';
import { getImageFromRu } from './agenda/jobs/lookForImage.job';

const init2 = async () => {
    // Inicializar mongoose
    await mongoose.connect(process.env.MONGO_URL, {
        dbName: process.env.MONGO_DB,
        useNewUrlParser: true,
    });
    
    // Iniciador da agenda
    const agenda = await initAgenda();
    
    // Logger
    bot.use(logger);
    
    // Start command
    bot.start(startUser);
    
    // Start bot
    bot.startPolling();
    
    console.log('Bot iniciado');
}

const init = async () => {
    getImageFromRu();
    
    console.log('Ok');
}

init();