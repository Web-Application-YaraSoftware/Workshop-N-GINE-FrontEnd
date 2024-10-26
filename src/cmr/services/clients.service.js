import http from "../../shared/services/http-common.js";

export class ClientsService {
    resourceEndpoint = '/clients';

    getAllByWorkshop(id) {
        return http.get(`${this.resourceEndpoint}?workshop_id=${id}`);
    }

    getById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }
    getByDocument(dni) {
        return http.get(`${this.resourceEndpoint}?dni=${dni}`);
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