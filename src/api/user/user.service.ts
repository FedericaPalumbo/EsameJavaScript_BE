import { UserExistsError } from "../../errors/user-exists.error";
import { UserIdentityModel } from "../../lib/auth/local/user-identity.model";
import { User } from "./user.entity";
import { QueryUserDto } from "./user.dto";
import { UserModel } from "./user.model";
import { QueryFilter } from "mongoose";
import * as bcrypt from 'bcrypt';
export class UserService {

    async find(filters: QueryUserDto): Promise<User[]> {
        const { type } = filters;
        const query: QueryFilter<User> = {};

        if (type !== undefined) {
            query.role = type;
        }

        const results = await UserModel.find(query);
        return results;
    }

    async add(
        user: Omit<User, 'id' | 'fullName'>,
        credentials: { username: string, password: string }): Promise<User> {
        const existingIdentity =
            await UserIdentityModel.findOne({ 'credentials.username': credentials.username });
        if (existingIdentity) {
            throw new UserExistsError();
        }

        const newUser = await UserModel.create(user);

        const hashedPassword = await bcrypt.hash(credentials.password, 10);

        await UserIdentityModel.create({
            provider: 'local',
            user: newUser,
            credentials: {
                username: credentials.username,
                hashedPassword
            }
        });

        return newUser;
    }
}

export default new UserService();