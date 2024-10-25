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
        return http.get(`/interventions?vehicle.id=${id}`);
    }

    getById(id) {
        return http.get(`/interventions/${id}`);
    }

    postIntervention(data) {
        return http.post('/interventions', data);
    }

    deleteIntervention(id) {
        return http.delete(`/interventions/${id}`);
    }

    putIntervention(id, data) {
        return http.put(`/interventions/${id}`, data);
    }
}