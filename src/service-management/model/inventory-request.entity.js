export class InventoryRequest {
    constructor({id = 0, workshop_id = 0, user_Id = 0,
                    task_Id = 0, item_Id=0, amount=0, description='', state=[]}) {
        this.id = id;
        this.workshopId = workshop_id;
        this.userId = user_Id;
        this.taskId = task_Id;
        this.itemId = item_Id;
        this.amount = amount;
        this.description = description;
        this.state = state;

    }
}