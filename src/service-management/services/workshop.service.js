import http from "../../shared/services/http-common.js";

export class WorkshopService {
    resourceEndpoint = '/workshops';

    getById(id){
        return http.get(`${this.resourceEndpoint}/${id}`);
    }
}