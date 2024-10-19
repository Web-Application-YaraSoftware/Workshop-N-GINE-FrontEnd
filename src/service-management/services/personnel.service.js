import http from "../../shared/services/http-common.js";

export class PersonnelService {
    getAllPersonnel() {
        return http.get('/users?workshop_id=1&user_type.id=2');
    }

    postPersonnel(data) {
        return http.post('/users?workshop_id=1&user_type.id=2', data);
    }

    deletePersonnel(id) {
        return http.delete(`/users/${id}?workshop_id=1&user_type.id=2`);
    }

    putPersonnel(id, data) {
        return http.put(`/users/${id}?workshop_id=1&user_type.id=2`, data);
    }
}