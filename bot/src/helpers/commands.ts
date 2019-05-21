import { BotCommand } from "../decorators";
import { ContextMessageUpdate } from "telegraf";
import { CardapioService, EDiasSemana, UserService } from '../providers';
import { getAgenda } from '../agenda/agenda';

const cardapioService = new CardapioService();
const userService = new UserService();

export class BotCommands {
    constructor() {}

    @BotCommand({ command: 'hoje', description: 'Manda o cardápio de hoje' })
    hoje(ctx: ContextMessageUpdate, next: () => any) {
        const data = new Date();
        let mensagem = '';
        cardapioService.findDateInBetween(data)
            .then(cardapio => {
                mensagem += 'Aqui está:\n';
                return cardapio.textos[data.getDay() - 1];
            })
            .catch(err => {
                mensagem += '**Não** encontrei o cardápio de hoje.\nO último cardápio que tenho é esse:\n';
                return cardapioService.findLatest()
                    .then(cardapio => cardapio.textos[EDiasSemana.SEXTA])
            })
            .then(cardapio => {
                mensagem += '\n' + cardapio;
                ctx.replyWithMarkdown(mensagem);
            });

        next();
    }

    @BotCommand({ command: 'agendar', description: 'Agenda um horário para mandar a mensagem' })
    agendar(ctx: ContextMessageUpdate, next: () => any) {
        // Checar se a mensagem veio no fomato certo
        const params = ctx.message.text.split(' ');
        
        if (params.length == 1 || !params[1].match(/\d{2}:\d{2}/)) {
            ctx.replyWithMarkdown('Você me mandou uma hora errada. Me manda no formato 00:00 :D');
            next();
        } else {
            const agenda = getAgenda();
            const hora = params[1];
            userService.findByTelegramId(ctx.message.from.id).then(user => {
                agenda.jobs({ _id: user.jobId }).then(jobs => jobs[0]).then(job => {
                    job.enable()
                        .repeatAt(`tomorrow ${hora}`)
                        .schedule(`at ${hora}`)
                        .save().then(_ => {
                            ctx.reply(`Beleza! As ${hora} eu te mando o cardápio ;)`);
                            next();
                        });
                });
            });
        }        
    }

    @BotCommand({ command: 'parar', description: 'Desativa o envio automático do cardápio' })
    parar(ctx: ContextMessageUpdate, next: () => void) {
        userService.findByTelegramId(ctx.message.from.id).then(user => {
            const agenda = getAgenda();
            agenda.jobs({ _id: user.jobId }).then(jobs => jobs[0]).then(job => {
                job.disable()
                    .save().then(_ => {
                        ctx.reply(`Pode deixar, parceiro! Não vou mais te mandar o cardápio.`);
                        next();
                    });
            });
        });
    }

}