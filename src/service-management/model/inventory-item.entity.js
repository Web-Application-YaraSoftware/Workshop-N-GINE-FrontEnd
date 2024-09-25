export class InventoryItem {
    constructor({id = 0, workshop_id = 0, name = '', amount = 0}) {
        this.id = id;
        this.workshopId = workshop_id;
        this.name = name;
        this.amount = amount;
    }
}