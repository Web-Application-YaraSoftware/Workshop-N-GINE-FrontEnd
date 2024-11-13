import http from "../../shared/services/http-common.js";

export class ProfilesService {
    getProfileByUserId(userId) {
        return http.get(`/profiles/${userId}`);
    }

    postProfile(data) {
        return http.post('/profiles', data);
    }

    putProfile(id, data) {
        return http.put(`/profiles/${id}`, data);
    }
}