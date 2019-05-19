interface ICommand {
    command: string;

    description: string;
}

export class DescriptionService {
    private static commands: ICommand[] = [];

    constructor() {}

    addDescription(command: ICommand): void {
        DescriptionService.commands.push(command);
    }

    generateDescriptions(): string {
        const commandArray = DescriptionService.commands.map(command => `${command.command} - ${command.description}`);
        return commandArray.join('\n');
    }
}