import {NotificationState} from "./notification-state.enum.js";

export class Notification {
    constructor({ id = 0, stateId = NotificationState.UNREAD, userId = 0, date = new date(), content = '', endpoints = ''}) {
        this.id = id;
        this.stateId = stateId;
        this.userId = userId;
        this.date = new Date(date);
        this.content = content;
        this.endpoint = endpoints;
    }
}