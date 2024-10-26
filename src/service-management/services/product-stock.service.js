import http from "../../shared/services/http-common.js";

export class ProductStockService {
    constructor() {
        this.resourceEndpoint = '/products-stock';
    }
  
    getAllByWorkshopId(id) {
        return http.get(`${this.resourceEndpoint}?workshopId=${id}`);
    }

    getById(productStockId) {
        return http.get(`${this.resourceEndpoint}/${productStockId}`);
    }
  
    update(id, data){
        return http.put(`${this.resourceEndpoint}/${id}`, data);
    }

    delete(id){
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }
}