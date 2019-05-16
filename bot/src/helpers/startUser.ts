import { ContextMessageUpdate } from "telegraf";
import { UserService } from "../providers/providers";

const userService = new UserService();

export async function startUser(ctx: ContextMessageUpdate, next: () => any) {
    const telegramUser = ctx.update.message.from;

    // Checar se ja está no banco
    const userInDb = await userService.findByTelegramId(telegramUser.id)
    if (!userInDb) {
        const user = await userService.create({
            firstName: telegramUser.first_name,
            lastName: telegramUser.last_name,
            telegramId: telegramUser.id,
            languageCode: telegramUser.language_code,
            username: telegramUser.username,
        });
        
        ctx.replyWithMarkdown(`
Bem vindo, ${user.firstName}!
Eu sou o Bot do Cardápio do RU da UEL!
Vou te mandar todos os dias qual é o cardápio do dia!
Para mais informações, use o comando **/help**
        `);

    }

    next();
}