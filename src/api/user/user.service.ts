//perchè qui non devo aggiungere userExistsError?
import { User } from "./user.entity";
import { QueryUserDto } from "./user.dto";
import { UserModel } from "./user.model";
import { QueryFilter } from "mongoose";

export class UserService {

    async find(filters: QueryUserDto): Promise<User[]> {
        const { type } = filters;
        const query: QueryFilter<User> = {};

        if (type !== undefined) {
            //perchè qui non ho dovuto mettere qualcosa di simile a query.$or?
            //query.$or = [
            //{name: {$regex: name, $options: 'i'} },
            //{description: {$regex: name, $options: 'i'} }
            // ]
            query.role = type;
        }

        const results = await UserModel.find(query);
        return results;
    }

}

export default new UserService();