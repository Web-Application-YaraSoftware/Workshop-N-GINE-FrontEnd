import http from "../../shared/services/http-common.js";

export class TasksService {
    getAll() {
        return http.get('/tasks');
    }

    getAllByMechanicId(id) {
        return http.get(`/tasks?assistantId=${id}`);
    }

    postTask(data) {
        return http.post('/tasks', data);
    }

    deleteTask(id) {
        return http.delete(`/tasks/${id}`);
    }

    putTask(id, data) {
        return http.put(`/tasks/${id}`, data);
    }
}