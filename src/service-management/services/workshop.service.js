import http from "../../shared/services/http-common.js";

export class WorkshopService {
    resourceEndPoint = "/workshops";

    getById(id) {
        return http.get(`${this.resourceEndPoint}/${id}`);
    }
    getMechanicsUserIdByWorkshopId(workshopId) {
        return http.get(`${this.resourceEndPoint}/${workshopId}/mechanics`);
    }

    postMechanicToWorkshop(workshopId, mechanicData) {
        return http.post(`${this.resourceEndPoint}/${workshopId}/mechanics`, mechanicData);
    }
}