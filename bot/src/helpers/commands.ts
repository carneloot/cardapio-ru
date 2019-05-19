import { BotCommand } from "../decorators";
import { ContextMessageUpdate } from "telegraf";
import { CardapioService, EDiasSemana } from '../providers';

const cardapioService = new CardapioService();

export class BotCommands {
    constructor() {}

    @BotCommand({
        command: 'hoje',
        description: 'Manda o cardápio de hoje'
    })
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

}