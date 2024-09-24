import http from "../../shared/services/http-common.js";

export class ClientService {
    resourceEndpoint = '/users';

    getAllByWorkshop(id){
        return http.get(this.resourceEndpoint, {
            params: {
                'workshop_id': id,
                'user_type.id': 3
            }
        });
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