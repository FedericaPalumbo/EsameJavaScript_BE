import { User } from "./user.entity";
import { QueryUserDto } from "./user.dto";
import { UserModel } from "./user.model";
import { QueryFilter } from "mongoose";
///AAA: RICORDATI DI IMPORTARE L'ERRORE, BYCRYPT e USERIDENTITYMODEL QUANDO AGGIUGNERò L'ADD 
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

}

export default new UserService();