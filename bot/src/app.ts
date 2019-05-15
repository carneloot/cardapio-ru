// Dotenv
import * as dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/../.env` });

// Dependencias
import { bot } from './helpers/bot';
import { logger } from './middlewares/logger';

// Logger
bot.use(logger);

// Start bot
bot.startPolling();

console.log('Bot iniciado');