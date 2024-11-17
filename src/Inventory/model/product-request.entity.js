import { ProductRequestState } from "./product-request-state.enum.js";

export class ProductRequest {
    constructor({
                    id = 0,
                    requestedQuantity = 0,
                    productId = 0,
                    workshopId = 0,
                    taskId = 0,
                    status = ''
                } = {}) {
        this.id = id;
        this.requestedQuantity = requestedQuantity;
        this.productId = productId;
        this.workshopId = workshopId;
        this.taskId = taskId;
        this.status = status;
    }
}