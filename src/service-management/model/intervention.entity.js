import { InterventionType } from "./intervention-type.enum.js";
import { InterventionState } from "./intervention-state.enum.js";

export class Intervention {
    constructor({
                    id = 0,
                    vehicleId = 0,
                    mechanicLeaderId = 0,
                    description = '',
                    type = InterventionType.REPARATION,
                    status = InterventionState.PENDING,
                    scheduledDate = '',
                    createdAt = '',
                    updatedAt = null
                } = {}) {
        this.id = id;
        this.vehicleId = vehicleId;
        this.mechanicLeaderId = mechanicLeaderId;
        this.description = description;
        this.type = type;
        this.status = status;
        this.scheduledDate = scheduledDate ? new Date(scheduledDate) : new Date();
        this.createdAt = createdAt ? new Date(createdAt) : new Date();
        this.updatedAt = updatedAt ? new Date(updatedAt) : null;
    }

    finish() {
        this.status = InterventionState.COMPLETED;
        this.updatedAt = new Date();
    }

    getFormattedDate() {
        return this.scheduledDate.toLocaleDateString();
    }
}