import http from "../../shared/services/http-common.js";

export class InterventionsService {
    getAll() {
        return http.get('/interventions');
    }

    getAllByMechanicLeaderId(id) {
        return http.get(`/interventions?mechanicLeaderId=${id}`);
    }

    getAllByMechanicAssistantId(id) {
        return http.get(`/interventions`);
    }

    getAllByVehicleId(id) {
        return http.get(`/interventions?vehicleId=${id}`);
    }

    getById(id) {
        return http.get(`/interventions/${id}`);
    }

    post(data) {
        return http.post('/interventions', data);
    }

    delete(id) {
        return http.delete(`/interventions/${id}`);
    }

    put(id, data) {
        return http.put(`/interventions/${id}`, data);
    }
}