
export class ProductStock {
    constructor({
                    id = 0,
                    name = '',
                    stockQuantity = 0,
                    workshopId = 0,
                    lowStockThreshold = 0,
                    description = ''
                } = {}) {
        this.id = id;
        this.name = name;
        this.stockQuantity = stockQuantity;
        this.workshopId = workshopId;
        this.lowStockThreshold = lowStockThreshold;
        this.description = description;
    }
}
