import {Vehicle} from "./vehicle.entity.js";
import {InterventionType} from "./intervention-type.enum.js";
import {InterventionState} from "./intervention-state.enum.js";

export class Intervention {
    constructor({
                    id = 0,
                    workshopId = 0,
                    vehicle = new Vehicle(),
                    mechanicLeaderId = 0,
                    registrationDate = '',
                    completionDate = '',
                    interventionType = InterventionType.REPARATION,
                    state = InterventionState.PENDING,
                    description = ''
                } = {}) {
        this.id = id;
        this.workshopId = workshopId;
        this.vehicle = vehicle;
        this.mechanicLeaderId = mechanicLeaderId;
        this.registrationDate = registrationDate ? new Date(registrationDate) : new Date();
        this.completionDate = completionDate ? new Date(completionDate) : new Date();
        this.interventionType = interventionType;
        this.state = state;
        this.description = description;
    }

    finish() {
        this.state = InterventionState.COMPLETED;
        this.completionDate = new Date();
    }
}