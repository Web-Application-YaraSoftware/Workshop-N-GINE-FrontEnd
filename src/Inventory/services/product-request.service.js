import http from "../../shared/services/http-common.js";

export class ProductRequestService {
    constructor() {
        this.resourceEndpoint = '/product-requests';
    }
  
    getAllByTaskId(taskId) {
        return http.get(`${this.resourceEndpoint}?taskId=${taskId}`);
    }

    post(data) {
        return http.post(this.resourceEndpoint, data);
    }

    put(id, data) {
        return http.put(`${this.resourceEndpoint}/${id}`, data);
    }
  
    getAllByWorkshopId(workshopId){
        return http.get(`${this.resourceEndpoint}?workshopId=${workshopId}`);
    }

    acceptRequest(id) {
        return http.post(`${this.resourceEndpoint}/${id}/accept`);
    }

    rejectRequest(id) {
        return http.post(`${this.resourceEndpoint}/${id}/reject`);

    }

}