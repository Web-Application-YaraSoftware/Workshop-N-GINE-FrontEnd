import http from "../../shared/services/http-common.js";

export class ProductStockService {
    resourceEndpoint = '/products-stock';

    getAllByWorkshopId(workshopId){
        return http.get(`${this.resourceEndpoint}?workshopId=${workshopId}`);
    }

    update(id, data){
        return http.put(`${this.resourceEndpoint}/${id}`, data);
    }

    delete(id){
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }
}