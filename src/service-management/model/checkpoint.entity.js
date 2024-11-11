export class Checkpoint {
    constructor({id=0, taskId=0, name=''}={}) {
        this.id = id;
        this.taskId = taskId;
        this.name = name;
    }
}