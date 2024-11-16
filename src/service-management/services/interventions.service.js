import http from "../../shared/services/http-common.js";

export class InterventionsService {
    resourceEndPoint = "/interventions";

    getAll() {
        return http.get(`${this.resourceEndPoint}`);
    }

    getAllByMechanicLeaderId(id) {
        return http.get(`${this.resourceEndPoint}?mechanicLeaderId=${id}`);
    }

    getAllByMechanicAssistantId(id) {
        return http.get(`${this.resourceEndPoint}`);
    }

    getAllByVehicleId(id) {
        return http.get(`${this.resourceEndPoint}?vehicleId=${id}`);
    }

    getById(id) {
        return http.get(`${this.resourceEndPoint}/${id}`);
    }

    post(data) {
        return http.post(`${this.resourceEndPoint}`, data);
    }

    delete(id) {
        return http.delete(`${this.resourceEndPoint}/${id}`);
    }

    put(id, data) {
        return http.put(`${this.resourceEndPoint}/${id}`, data);
    }

    //task related endpoints
    getAllTasksByInterventionId(interventionId) {
        return http.get(`${this.resourceEndPoint}/${interventionId}/tasks`);
    }
    //TODO: assistant es mechanic leader nomas
    getAllByMechanicId(id, interventionId) {
        return http.get(`${this.resourceEndPoint}/${interventionId}/tasks?assistantId=${id}`);
    }
    getAllTasksByMechanicIdAndInterventionId(leaderId, interventionId) {
        return http.get(`${this.resourceEndPoint}/${interventionId}/tasks?mechanicLeaderId=${leaderId}`);
    }

    postTask(data, interventionId) {
        return http.post(`${this.resourceEndPoint}/${interventionId}/tasks`, data);
    }

    deleteTask(id, interventionId) {
        return http.delete(`${this.resourceEndPoint}/${interventionId}/tasks/${id}`);
    }

    putTask(id, data, interventionId) {
        return http.put(`${this.resourceEndPoint}/${interventionId}/tasks/${id}`, data);
    }

    //checkpoint related endpoints
    getAllCheckpointsByInterventionIdAndTaskId(taskId, interventionId) {
        return http.get(`${this.resourceEndPoint}/${interventionId}/tasks/${taskId}/checkpoints`);
    }

    postCheckpoint(data, taskId, interventionId) {
        return http.post(`${this.resourceEndPoint}/${interventionId}/tasks/${taskId}/checkpoints`, data);
    }

    deleteCheckpoint(checkpointId, taskId, interventionId) {
        return http.delete(`${this.resourceEndPoint}/${interventionId}/tasks/${taskId}/checkpoints/${checkpointId}`);
    }

    putCheckpoint(checkpointId, taskId, interventionId, data) {
        return http.put(`${this.resourceEndPoint}/${interventionId}/tasks/${taskId}/checkpoints/${checkpointId}`, data);
    }


}