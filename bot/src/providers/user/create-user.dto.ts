export interface CreateUserDto {
    telegramId: number;

    firstName: string;

    lastName: string;

    username: string;

    languageCode: string;

    chatId: number;

    startDate?: Date;
}