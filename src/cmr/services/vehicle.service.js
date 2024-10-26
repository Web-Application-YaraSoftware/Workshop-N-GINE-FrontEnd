import http from "../../shared/services/http-common.js";

export class VehicleService {
    resourceEndpoint = '/vehicles';

    getByClientId(clientId) {
        return http.get(this.resourceEndpoint, {
            params: {
                'owner.id': clientId
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
    create(data) {
        return http.post(this.resourceEndpoint, data);
    }
}
