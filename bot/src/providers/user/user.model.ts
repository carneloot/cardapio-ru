import { Typegoose, prop } from 'typegoose';
import { Types } from 'mongoose';

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

    @prop()
    jobId?: Types.ObjectId;
}