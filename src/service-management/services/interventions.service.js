import http from "../../shared/services/http-common.js";

export class InterventionsService {
    resourceEndPoint = "/interventions";

    getAll() {
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

    put(id, data) {
        return http.put(`${this.resourceEndPoint}/${id}`, data);
    }

    //task related endpoints
    getAllTasksByInterventionId(interventionId) {
        return http.get(`${this.resourceEndPoint}/${interventionId}/tasks`);
    }
    //mechanicLeader hace mencion al leader de la task (assigned), no al leader de la intervencion
    getAllTasksByMechanicIdAndInterventionId(mechanicAssignedId, interventionId) {
        return http.get(`${this.resourceEndPoint}/${interventionId}/tasks?mechanicLeaderId=${mechanicAssignedId}`);
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