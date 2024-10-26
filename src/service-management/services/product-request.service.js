import http from "../../shared/services/http-common.js";

export class ProductRequestService {
    resourceEndpoint = '/products-request';

    getAllByWorkshopId(workshopId){
        return http.get(`${this.resourceEndpoint}?workshopId=${workshopId}&status=0`);
    }

    updateRequests(request, newStatus) {
        const updateData = { status: newStatus };
        return http.patch(`${this.resourceEndpoint}/${request.id}`, updateData);
    }

}