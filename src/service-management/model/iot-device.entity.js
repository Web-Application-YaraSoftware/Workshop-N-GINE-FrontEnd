export class IoTDevice {
    constructor({
                    id = 0,
                    codeList = [],
                    vehicleId = 0
                } = {}) {
        this.id = id;
        this.codeList = codeList;
        this.vehicleId = vehicleId;
    }
}