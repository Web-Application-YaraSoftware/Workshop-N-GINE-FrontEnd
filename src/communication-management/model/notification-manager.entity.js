import {ref} from "vue";

export class NotificationManager {

    constructor(notifications = ref([])) {
        this.notifications = notifications;
    }
}
