export class Workshop {
    constructor({id=0, owner_id=0, name=''}={}) {
        this.id = id;
        this.ownerId = owner_id;
        this.name = name;
    }
}