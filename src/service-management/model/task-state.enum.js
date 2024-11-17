export const TaskState = Object.freeze({
    PENDING: 1,
    INPROGRESS: 2,
    COMPLETED: 3,

    getName(value) {
        switch (value) {
            case this.PENDING:
                return 'Pending';
            case this.INPROGRESS:
                return 'InProgress';
            case this.COMPLETED:
                return 'Completed';
            default:
                return null;
        }
    }
});