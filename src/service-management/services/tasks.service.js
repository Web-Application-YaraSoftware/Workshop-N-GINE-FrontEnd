import http from "../../shared/services/http-common.js";

export class TasksService {
    getAllByInterventionId(id) {
        return http.get(`/tasks?interventionId=${id}`);
    }

    getAllByMechanicId(id) {
        return http.get(`/tasks?assistantId=${id}`);
    }

    getAllByMechanicIdAndInterventionId(assistantId, interventionId) {
        return http.get(`/tasks?assistantId=${assistantId}&interventionId=${interventionId}`);
    }

    post(data) {
        return http.post('/tasks', data);
    }

    delete(id) {
        return http.delete(`/tasks/${id}`);
    }

    put(id, data) {
        return http.put(`/tasks/${id}`, data);
    }
}