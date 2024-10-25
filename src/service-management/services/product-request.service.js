import http from "../../shared/services/http-common.js";

export class ProductRequestService {
    resourceEndpoint = '/products-request';

    getAllByWorkshopId(workshopId){
        return http.get(`${this.resourceEndpoint}?workshopId=${workshopId}&status=0`);
    }

    getById(id){
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    update(id, data){
        return http.put(`${this.resourceEndpoint}/${id}`, data);
    }

    updateRequests(request, newStatus) {
        const updateData = { status: newStatus };
        return http.patch(`${this.resourceEndpoint}/${request.id}`, updateData);
    }

}