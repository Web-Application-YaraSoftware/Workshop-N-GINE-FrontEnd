export const AccountState = Object.freeze({
    ACTIVE: 0,
    INACTIVE: 1,
    HIDDEN: 2,

    getName(state) {
        switch(state) {
            case this.ACTIVE:
                return 'Active';
            case this.INACTIVE:
                return 'Inactive';
            case this.HIDDEN:
                return 'Hidden';
            default:
                return 'Unknown';
        }
    }
});