export class Profile {
    constructor({
                    id = 0,
                    firstName = '',
                    lastName = '',
                    dni = 0,
                    email = '',
                    age = 0,
                    location = '',
                    userId = 0,
                } = {}) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dni = dni;
        this.email = email;
        this.age = age;
        this.location = location;
        this.userId = userId;
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}