import {AccountState} from "./account-state.enum.js";
import {Role} from "./role.enum.js";

export class User {
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
        this.id = id;
        this.workshopId = workshop_id;
        this.firstName = first_name;
        this.lastName = last_name;
        this.dni = dni;
        this.email = email;
        this.password = password;
        this.image = image;
        this.age = age;
        this.location = location;
        this.state = state;
        this.userType = role;
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}