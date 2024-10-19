import { User } from './user.entity.js';
import { IotDispositive } from './iot-dispositive.entity.js';

export class Vehicle {
  constructor({
                id = 0,
                licensePlate = '',
                brand = '',
                model = '',
                owner = new User(),
                image = '',
                iotDispositive = new IotDispositive(),
                interventionRegister = []
              } = {}) {
    this.id = id;
    this.licensePlate = licensePlate;
    this.brand = brand;
    this.model = model;
    this.owner = owner;
    this.image = image;
    this.iotDispositive = iotDispositive;
    this.interventionRegister = interventionRegister;
  }
}
