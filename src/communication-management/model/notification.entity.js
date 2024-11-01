import {NotificationState} from "./notification-state.enum.js";

export class Notification {
    constructor({ id = 0, state = NotificationState.UNREAD, userid = 0, date = new date(), content = '', endpoint = ''}) {
        this.id = id;
        this.state = state;
        this.userid = userid;
        this.date = new Date(date);
        this.content = content;
        this.endpoint = endpoint;
    }
}