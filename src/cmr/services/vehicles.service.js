import http from "../../shared/services/http-common.js";

export class VehiclesService {
    getById(id) {
        return http.get(`/vehicles/${id}`);
    }
    getByUserId(ownerId) {
        return http.get(`/vehicles?userId=${ownerId}`);
    }
}