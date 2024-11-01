export const ProductRequestState = Object.freeze({
    PENDING: 0,
    REJECTED: 1,
    APPROVED: 2,
    getName(state) {
        switch (state) {
            case 0:
                return 'Pending';
            case 1:
                return 'Rejected';
            case 2:
                return 'Approved';
            default:
                return 'Unknown';
        }
    }
});