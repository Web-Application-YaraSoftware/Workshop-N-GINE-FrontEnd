import { Role } from './role.enum.js';
import { Workshop } from './workshop.entity.js';
import { AccountState } from './account-state.enum.js';

export class User {
  constructor({
                id = 0,
                firstName = '',
                lastName = '',
                dni = '',
                image = 'https://xsgames.co/randomusers/avatar.php?g=female',
                email = '',
                password = '',
                role = Role.CLIENT,
                age = 0,
                location = '',
                workshop = new Workshop(),
                state = AccountState.ACTIVE,
                notificationList = []
              } = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.dni = dni;
    this.image = image;
    this.email = email;
    this.password = password;
    this.role = role;
    this.age = age;
    this.location = location;
    this.workshop = workshop;
    this.state = state;
    this.notificationList = notificationList;
  }
}
