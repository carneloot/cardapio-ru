// Dotenv
import * as dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/../.env` });

import * as mongoose from 'mongoose';
import { bot } from './helpers/bot';
import { logger } from './middlewares/logger';
import { startUser } from './helpers/startUser';
import { initAgenda } from './agenda/agenda';
import { CardapioService, EDiasSemana } from './providers';

const init = async () => {
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

    testeCardapio();
}

const cardapioService = new CardapioService();


function testeCardapio() {
    const data = new Date();//'2019-05-13T23:30:24.240Z');
    cardapioService.findDateInBetween(data)
        .then(cardapio => cardapio.textos[data.getDay() - 1])
        .catch(err => cardapioService.findLatest()
            .then(cardapio => cardapio.textos[EDiasSemana.SEXTA]))
        .then(cardapio => console.log('Cardapio: ', cardapio));
}


init();
