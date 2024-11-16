export const InterventionState = Object.freeze({
    PENDING: 1,
    IN_PROGRESS: 2,
    COMPLETED: 3,
    CANCELED: 4,
    getName(state) {
        switch(state) {
            case this.PENDING:
                return 'Pending';
            case this.IN_PROGRESS:
                return 'In Progress';
            case this.COMPLETED:
                return 'Completed';
            case this.CANCELED:
                return 'Canceled';
            default:
                return 'Unknown';
        }
    },
    getNumber(name) {
        switch(name) {
            case 'Pending':
                return this.PENDING;
            case 'In Progress':
                return this.IN_PROGRESS;
            case 'Completed':
                return this.COMPLETED;
            case 'Canceled':
                return this.CANCELED;
            default:
                return -1;
        }
    }
});