import { User } from "../../iam/model/user.entity.js";
import { AccountState } from "../../iam/model/account-state.enum.js";
import { Role } from "../../iam/model/role.enum.js";

export class Client extends User {
    constructor({
                    id = 0,
                    workshopId = 0,
                    firstName = '',
                    lastName = '',
                    dni = '',
                    email = '',
                    password = '',
                    image = '',
                    age = 0,
                    location = '',
                    state = AccountState.ACTIVE,
                    role = Role.CLIENT,
                    userId = 0
                } = {}) {
        super({
            id: id,
            workshop_id: workshopId,
            first_name: firstName,
            last_name: lastName,
            dni: dni,
            email: email,
            password: password,
            image: image,
            age: age,
            location: location,
            state: state,
            role: role
        });
        this.userId = userId;
    }
}