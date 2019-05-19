import { bot } from "../helpers/bot";
import { startUser } from '../helpers/startUser';
import { DescriptionService } from '../providers';

const descriptionService = new DescriptionService();

interface IBotCommandParams {
    command: string,
    description?: string,
};

export function BotCommand(values: string | IBotCommandParams) {
    return function (
        target: Object,
        propertyName: string,
        descriptor: PropertyDescriptor) {

        let command: string;
        let description: string;

        if (typeof values === 'string') {
            command = values;
        } else {
            command = values.command;
            description = values.description
        }

        console.log(`Adicionando comando '/${command}'`);

        bot.command(command, startUser, descriptor.value);

        // TODO: Salvar as descrições para mandar para o bot depois
        if (description) {
            descriptionService.addDescription({ command, description });
        }

    }
};
