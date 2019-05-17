import { Typegoose, prop } from 'typegoose';

export class User extends Typegoose {
    @prop()
    telegramId: number;
    
    @prop()
    firstName: string;
    
    @prop()
    lastName: string;
    
    @prop()
    username: string;

    @prop()
    startDate: Date;
    
    @prop()
    languageCode: string;

    @prop()
    chatId: number;
}