import { User } from "../../iam/model/user.entity.js";
import { AccountState } from "../../iam/model/account-state.enum.js";
import { Role } from "../../iam/model/role.enum.js";

export class Client extends User {
    constructor({
                    id = 0,
                    workshop_id = 0,
                    first_name = '',
                    last_name = '',
                    dni = '',
                    email = '',
                    password = '',
                    image = '',
                    age = 0,
                    location = '',
                    state = AccountState.ACTIVE,
                    role = Role.CLIENT
                } = {}) {
        super({
            id: id,
            workshop_id: workshop_id,
            first_name: first_name,
            last_name: last_name,
            dni: dni,
            email: email,
            password: password,
            image: image,
            age: age,
            location: location,
            state: state,
            role: role
        });
    }
}