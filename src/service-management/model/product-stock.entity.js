import { ProductType } from "./product-type.entity.js";

export class ProductStock {
    constructor({
                    id = 0,
                    name = '',
                    amount = 0,
                    workshopId = 0,
                    productTypeId = 0,
                    limit = 0,
                    productType = new ProductType()
                } = {}) {
        this.id = id;
        this.name = name;
        this.amount = amount;
        this.workshopId = workshopId;
        this.productTypeId = productTypeId;
        this.limit = limit;
        this.productType = productType;
    }
}
