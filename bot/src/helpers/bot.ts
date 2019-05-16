import { Telegraf, ContextMessageUpdate } from 'telegraf';

const TelegrafBot = require('telegraf');

export const bot = new TelegrafBot(process.env.BOT_TOKEN) as Telegraf<ContextMessageUpdate>;

bot.telegram.getMe().then(botInfo => {
    const botAny = bot as any;
    botAny.options.username = botInfo.username
});
