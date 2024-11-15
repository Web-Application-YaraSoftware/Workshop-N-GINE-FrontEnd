export const InterventionState = Object.freeze({
    PENDING: 0,
    IN_PROGRESS: 1,
    COMPLETED: 2,
    getName(state) {
        switch(state) {
            case this.PENDING:
                return 'Pending';
            case this.IN_PROGRESS:
                return 'In Progress';
            case this.COMPLETED:
                return 'Completed';
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
            default:
                return -1;
        }
    }
});