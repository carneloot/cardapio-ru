// Dotenv
import * as dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/../.env` });

import { bot } from './helpers/bot';
import { logger } from './middlewares/logger';
import { startUser } from './helpers/startUser';
import * as mongoose from 'mongoose';


const init = async () => {
    // Inicializar mongoose
    mongoose.connect(process.env.MONGO_URL, {
        dbName: process.env.MONGO_DB,
        useNewUrlParser: true,
    });

    // Logger
    bot.use(logger);
    
    // Start command
    bot.start(startUser);
    
    // Start bot
    bot.startPolling();
    
    console.log('Bot iniciado');
}

init();