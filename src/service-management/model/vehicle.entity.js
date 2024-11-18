export class Vehicle {
    constructor({
                    id = 0,
                    licensePlate = '',
                    brand = '',
                    model = '',
                    image = '',
                    userId = 0,
                    ioTDeviceId = 0
                } = {}) {
        this.id = id;
        this.licensePlate = licensePlate;
        this.brand = brand;
        this.model = model;
        this.image = image;
        this.userId = userId;
        this.iotDeviceId = ioTDeviceId;
    }

    get fullName() {
        return `${this.brand} ${this.model}`;
    }
}