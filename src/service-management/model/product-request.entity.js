import { ProductRequestState } from "./product-request-state.enum.js";

export class ProductRequest {
    constructor({
                    id = 0,
                    name = '',
                    requestedQuantity = 0,
                    workshopId = 0,
                    taskId = 0,
                    requestedDate = '',
                    observation = '',
                    status = ProductRequestState.PENDING
                } = {}) {
        this.id = id;
        this.name = name;
        this.requestedQuantity = requestedQuantity;
        this.workshopId = workshopId;
        this.taskId = taskId;
        this.requestedDate = requestedDate ? new Date(requestedDate) : new Date();
        this.observation = observation;
        this.status = status;
    }
}