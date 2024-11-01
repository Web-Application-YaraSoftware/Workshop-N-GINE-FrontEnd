import http from "../../shared/services/http-common.js";

export class ProductTypeService {
    resourceEndpoint = '/productTypes';

    getAll() {
        return http.get(this.resourceEndpoint);
    }

    getById(id){
        return http.get(`${this.resourceEndpoint}/${id}`);
    }
}
