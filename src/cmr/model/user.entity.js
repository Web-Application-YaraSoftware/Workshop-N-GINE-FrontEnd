import {UserType} from "./user-type.entity.js";
import {UserState} from "./user-state.js";

export class User {
    constructor({id = 0, workshop_id = 0, first_name = '', last_name = '', dni = '', email = '', password = '', image = '', state = new UserState(), user_type = new UserType()} = {}) {
        this.id = id;
        this.workshopId = workshop_id;
        this.firstName = first_name;
        this.lastName = last_name;
        this.dni = dni;
        this.email = email;
        this.password = password;
        this.image = image;
        this.state = state;
        this.userType = user_type;
    }
}