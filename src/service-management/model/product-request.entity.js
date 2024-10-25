import {ProductRequestState} from "./product-request-state.enum.js";

export class ProductRequest {
    constructor({id = 0, workshopId = 0,
                    taskId = 0, name= '', requestedQuantity= 0,
                    requestedDate=  '', status= ProductRequestState.PENDING, observation=''}) {
        this.id = id;
        this.workshopId = workshopId;
        this.taskId = taskId;
        this.name = name;
        this.requestedQuantity = requestedQuantity;
        this.requestedDate = new Date(requestedDate);
        this.status = status;
        this.observation = observation;


    }
}