import http from "../../shared/services/http-common.js";

export class WorkshopClientService {
    resourceEndpoint = '/clients';

    getById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`)
            .then(response => response.data)
            .catch(error => {
                console.error("Error fetching workshop client:", error);
                throw error;
            });
    }

    update(id, data) {
        return http.put(`${this.resourceEndpoint}/${id}`, data);
    }

    delete(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }
}
