import http from "../../shared/services/http-common.js";

export class VehicleService {
    resourceEndpoint = '/vehicles';

    getByUserId(userId) {
        return http.get(this.resourceEndpoint, {
            params: {
                'userId': userId
            }
        });
    }

    getById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    getByClientDni(dni) {
        return http.get(this.resourceEndpoint, {
            params: {
                'owner.dni': dni
            }
        });
    }
    postVehicle(data) {
        return http.post(this.resourceEndpoint, data);
    }
}
