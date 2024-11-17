export const ProductRequestState = Object.freeze({
    PENDING: 1,
    ACCEPTED: 2,
    REJECTED: 3,

    getName(state) {
        switch (state) {
            case 1:
                return 'Pending';
            case 2:
                return 'Accepted';
            case 3:
                return 'Rejected';
            default:
                return 'Unknown';
        }
    }
});