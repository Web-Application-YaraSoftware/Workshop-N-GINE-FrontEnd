export const TaskState = Object.freeze({
    PENDING: 0,
    CANCELED: 1,
    DONE: 2,

    getName(value) {
        switch (value) {
            case this.PENDING:
                return 'Pending';
            case this.CANCELED:
                return 'Canceled';
            case this.DONE:
                return 'Done';
            default:
                return null;
        }
    }
});