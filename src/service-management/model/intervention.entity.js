export class Intervention {
    constructor(id, workshopId, mechanicLeaderId, vehicleId, clientId, registrationDate, completionDate, state) {
        this.id = id;
        this.workshopId = workshopId;
        this.mechanicLeaderId = mechanicLeaderId;
        this.vehicleId = vehicleId;
        this.clientId = clientId;
        this.registrationDate = registrationDate;
        this.completionDate = completionDate;
        this.state = state;
    }

}