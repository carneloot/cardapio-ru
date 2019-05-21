// Dotenv
import * as dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/../.env` });

import * as mongoose from 'mongoose';
import { bot } from './helpers/bot';
import { logger } from './middlewares/logger';
import { startUser } from './helpers/startUser';
import { initAgenda } from './agenda/agenda';
import { BotCommands } from './helpers/commands';

const init = async () => {
    // Inicializar mongoose
    await mongoose.connect(process.env.MONGO_URL, {
        dbName: process.env.MONGO_DB,
        useNewUrlParser: true,
    });
    
    // Iniciador da agenda
    await initAgenda();
    
    // Logger
    bot.use(logger);
    
    // Start command
    bot.start(startUser);
    
    // Start bot
    bot.startPolling();

    new BotCommands();

    console.log('Bot iniciado');
}

init();
