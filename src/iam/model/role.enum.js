export const Role = Object.freeze({
    MECHANIC: 0,
    WORKSHOP_OWNER: 1,
    CLIENT: 2,

    getName(role) {
        switch(role) {
            case this.MECHANIC:
                return 'Mechanic';
            case this.WORKSHOP_OWNER:
                return 'Workshop Owner';
            case this.CLIENT:
                return 'Client';
            default:
                return 'Unknown';
        }
    }
});