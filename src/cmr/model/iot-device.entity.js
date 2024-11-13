export class IoTDevice {
    constructor({
                    id = 0,
                    vehicleId = 0,
                    codeList = [],
                } = {}) {
        this.id = id;
        this.vehicleId = vehicleId;
        this.codeList = codeList;
    }
}