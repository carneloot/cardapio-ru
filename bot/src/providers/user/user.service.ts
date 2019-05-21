import { User } from "./user.model";
import { Model, Types } from "mongoose";
import { InstanceType } from "typegoose";
import { CreateUserDto } from "./create-user.dto";

export class UserService {
    private userModel: Model<InstanceType<User>, {}>
    
    constructor() {
        this.userModel = new User().getModelForClass(User);
    }

    async create(newUserInfo: CreateUserDto): Promise<User> {
        newUserInfo.startDate = new Date();
        return await new this.userModel(newUserInfo).save();
    }

    async findById(id: string): Promise<User> {
        return await this.userModel.findById(id).exec();
    }
    
    async findByTelegramId(telegramId: number): Promise<User> {
        return this.userModel.findOne({ telegramId }).exec();
    }

    async update(user: User): Promise<User> {
        return this.userModel.findByIdAndUpdate((<any>user)._id, user).exec();
    }

}
