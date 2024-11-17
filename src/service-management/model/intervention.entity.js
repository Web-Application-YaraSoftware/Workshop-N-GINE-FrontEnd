import { InterventionState } from "./intervention-state.enum.js";

export class Intervention {
    constructor({
                    id = 0,
                    workshopId = 0,
                    vehicleId = 0,
                    mechanicLeaderId = 0,
                    scheduledDate = '',
                    startedAt = '',
                    completedAt = '',
                    type = '',
                    status = '',
                    description = ''
                } = {}) {
        this.id = id;
        this.workshopId = workshopId;
        this.mechanicLeaderId = mechanicLeaderId;
        this.vehicleId = vehicleId;
        this.scheduledDate = scheduledDate ? new Date(scheduledDate) : new Date();
        this.createdAt = startedAt ? new Date(startedAt) : new Date();
        this.updatedAt = completedAt ? new Date(completedAt) : null;
        this.type = type;
        this.status = status;
        this.description = description;
    }

    finish() {
        this.status = InterventionState.COMPLETED;
        this.updatedAt = new Date();
    }

    getFormattedDate() {
        return this.scheduledDate.toLocaleDateString();
    }
}