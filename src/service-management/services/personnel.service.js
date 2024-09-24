import http from "../../shared/services/http-common.js";

export class PersonnelService {
    getAllPersonnel() {
        return http.get('/users');
    }

    postPersonnel(data) {
        return http.post('/users', data);
    }

    deletePersonnel(id) {
        return http.delete(`/users/${id}`);
    }

    putPersonnel(id, data) {
        return http.put(`/users/${id}`, data);
    }
}