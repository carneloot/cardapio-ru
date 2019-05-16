import { User } from "./user.model";
import { CreateUserDto } from "./create-user.dto";
import { Model } from "mongoose";
import { InstanceType } from "typegoose";

export class UserService {
    private UserModel: Model<InstanceType<User>, {}>
    
    constructor() {
        this.UserModel = new User().getModelForClass(User);
    }

    async create(newUserInfo: CreateUserDto): Promise<User> {
        newUserInfo.startDate = new Date();
        return await new this.UserModel(newUserInfo).save();
    }

    async findById(id: string): Promise<User> {
        return await this.UserModel.findById(id).exec();
    }
    
    async findByTelegramId(telegramId: number): Promise<User> {
        return await this.UserModel.findOne({ telegramId }).exec();
    }

}
