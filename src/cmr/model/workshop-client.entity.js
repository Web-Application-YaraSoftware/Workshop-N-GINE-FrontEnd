import { User } from '../../service-management/model/user.entity.js';

export class WorkshopClient extends User {
    constructor({ vehicles = [] } = {}) {
        super();
        this.vehicles = vehicles;
    }
}
