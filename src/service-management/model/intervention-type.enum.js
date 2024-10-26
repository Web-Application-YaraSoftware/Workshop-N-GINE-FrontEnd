export const InterventionType = Object.freeze({
    REPARATION: 0,
    MAINTENANCE: 1,
    getName(type) {
        switch(type) {
            case this.REPARATION:
                return 'Reparation';
            case this.MAINTENANCE:
                return 'Maintenance';
            default:
                return 'Unknown';
        }
    }
});