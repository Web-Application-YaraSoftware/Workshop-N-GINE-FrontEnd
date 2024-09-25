import http from "../../shared/services/http-common.js";

export class InventoryItemService {
    resourceEndpoint = '/inventory_items';

    getAll(){
        return http.get(this.resourceEndpoint);
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