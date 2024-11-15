export class Task {
    constructor({
                    id = 0,
                    mechanicAssignedId = 0,
                    description = '',
                    status = '',
                    interventionId = 0
                } = {}) {
        this.id = id;
        this.mechanicAssignedId = mechanicAssignedId;
        this.description = description;
        this.status = status;
        this.interventionId = interventionId;
    }

    finishTask() {
        this.status = 'DONE';
    }
    cancelTask() {
        this.status = 'CANCELED';
    }
}