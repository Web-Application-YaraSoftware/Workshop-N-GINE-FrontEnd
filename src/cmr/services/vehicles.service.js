import http from "../../shared/services/http-common.js";

export class VehiclesService {
    getById(id) {
        return http.get(`/vehicles/${id}`);
    }
    getByClientId(ownerId) {
        return http.get(`/vehicles?user_id=${ownerId}`);
    }
}