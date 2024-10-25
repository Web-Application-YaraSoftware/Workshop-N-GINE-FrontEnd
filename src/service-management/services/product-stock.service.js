import http from "../../shared/services/http-common.js";

export class ProductStockService {
    resourceEndpoint = '/products-stock';

    getAllByWorkshopId(workshopId){
        return http.get(`${this.resourceEndpoint}?workshopId=${workshopId}`);
    }

    getById(id){
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    create(data){
        return http.post(this.resourceEndpoint, data);
    }

    update(id, data){
        return http.put(`${this.resourceEndpoint}/${id}`, data);
    }

    delete(id){
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }
}