import http from "../../shared/services/http-common.js";

export class ProfilesService {
    getProfileByUserId(userId) {
        return http.get(`/profiles/${userId}`);
    }

    getById(profileId) {
        return http.get(`/profiles/${profileId}`);
    }

    postProfile(data) {
        return http.post('/profiles', data);
    }

    putProfile(id, data) {
        return http.put(`/profiles/${id}`, data);
    }
}