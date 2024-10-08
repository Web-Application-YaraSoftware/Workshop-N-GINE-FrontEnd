import http from "../../shared/services/http-common.js";

export class NotificationService {
    resourceEndpoint = '/notifications';

    getAll() {
        return http.get(this.resourceEndpoint);
    }

    getById(id){
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    getByUserId(userId){
        return http.get(`${this.resourceEndpoint}?user_id=${userId}`);
    }
}
