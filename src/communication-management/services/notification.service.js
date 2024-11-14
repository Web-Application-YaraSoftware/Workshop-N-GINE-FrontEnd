import http from "../../shared/services/http-common.js";

export class NotificationService {
    resourceEndpoint = '/notifications';

    getById(id){
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    getByUserId(userId){
        return http.get(`${this.resourceEndpoint}?userId=${userId}`);
    }

    updateState(notification, newState){
        const updateData = {state: newState}
        return http.patch(`${this.resourceEndpoint}/${notification.id}`, updateData);
    }
}
