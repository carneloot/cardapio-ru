import * as Agenda from 'agenda';
import { UserService, CardapioService } from '../../providers';
import { bot } from '../../helpers/bot';

const userService = new UserService();
const cardapioService = new CardapioService();

export async function sendDaily(job: Agenda.Job, done: (err?: Error) => void): Promise<void> {
    const { userId } = job.attrs.data;
    const user = await userService.findById(userId);

    const hoje = new Date();

    const cardapio = await cardapioService.findDateInBetween(hoje);

    let mensagem = 'O cardápio de hoje é\n'
    mensagem += cardapio.textos[hoje.getDay() - 1];

    bot.telegram.sendMessage(user.chatId, mensagem).then(_ => {
        console.log(`Mensagem enviada para ${user.username}!`);
        done();
    }).catch(err => {
        job.fail(err);
        job.save();
    });
}