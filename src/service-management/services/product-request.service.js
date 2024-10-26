import http from "../../shared/services/http-common.js";

export class ProductRequestService {
    constructor() {
        this.resourceEndpoint = '/products-request';
    }

    getAllByTaskId(taskId) {
        return http.get(`${this.resourceEndpoint}?taskId=${taskId}`);
    }

    post(data) {
        return http.post(this.resourceEndpoint, data);
    }

    delete(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }

    put(id, data) {
        return http.put(`${this.resourceEndpoint}/${id}`, data);
    }
}