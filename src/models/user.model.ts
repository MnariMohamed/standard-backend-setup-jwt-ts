import mongoose from 'mongoose';


export enum UserRoleEnum {
    ADMIN = 'ADMIN',
    CLIENT = 'CLIENT',
    SUPER_ADMIN = 'SUPER_ADMIN'
}

export interface IUser {
    _id: string;
    role: UserRoleEnum;
    name: string;
    phoneNumber: string;
    Country: mongoose.Types.ObjectId;
    email: string;
    password: string;
    tokens: any;
}

export type UserDoc = IUser & mongoose.Document;

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: IUser): UserDoc;
}

export const userSchema = new mongoose.Schema<UserDoc, UserModel>({
    role: {
        type: String, enum: Object.values(UserRoleEnum),
        default: UserRoleEnum.CLIENT, required: true
    },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    Country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tokens: { resetPassword: String }
}, { timestamps: true });


const User = mongoose.model<UserDoc, UserModel>('User', userSchema);
export default User;
