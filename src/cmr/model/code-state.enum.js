export const CodeState = Object.freeze({
    FAILED: 0,
    GOOD: 1,
    getName(state) {
        switch(state) {
            case this.FAILED:
                return 'Failed';
            case this.GOOD:
                return 'Good';
            default:
                return 'Unknown';
        }
    }
});