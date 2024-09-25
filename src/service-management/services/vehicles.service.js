import http from "../../shared/services/http-common.js";

export class VehiclesService {
    getCarById(id) {
        return http.get(`/vehicles/${id}`);
    }
    getCarsByOwner(ownerId) {
        return http.get(`/vehicles?user_id=${ownerId}`);
    }
}