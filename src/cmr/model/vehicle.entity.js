export class Vehicle {
    constructor({
                    id = 0,
                    licensePlate = '',
                    brand = '',
                    model = '',
                    clientId = 0,
                    iotDeviceId = 0
                } = {}) {
        this.id = id;
        this.licensePlate = licensePlate;
        this.brand = brand;
        this.model = model;
        this.clientId = clientId;
        this.iotDeviceId = iotDeviceId;
    }

    get fullName() {
        return `${this.brand} ${this.model}`;
    }
}