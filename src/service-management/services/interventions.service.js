import http from "../../shared/services/http-common.js";

export class InterventionsService {

    getByVehicleId(id) {
        return http.get(`/interventions?vehicleId=${id}`);
    }

    getAllByMechanicLeaderId(id) {
        return http.get(`/interventions?mechanicLeaderId=${id}`);
    }

    getAllCheckpointsByInterventionIdAndTaskId(interventionId, taskId) {
        return http.get(`/interventions/${interventionId}/tasks/${taskId}/checkpoints`);
    }

    getAllTasksByInterventionId(id) {
        return http.get(`/interventions/${id}/tasks`);
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