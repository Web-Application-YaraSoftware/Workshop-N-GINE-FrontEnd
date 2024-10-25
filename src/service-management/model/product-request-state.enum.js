export const ProductRequestState = Object.freeze({
    PENDING: 0,
    REJECTED: 1,
    APPROVED: 2,

    getName(value) {
        switch (value) {
            case this.PENDING:
                return 'Pending';
            case this.REJECTED:
                return 'Rejected';
            case this.APPROVED:
                return 'Approved';
            default:
                return null;
        }
    }
});