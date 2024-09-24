export class Notification {
    constructor({ id = 0, state = [], user_id = 0, date = new date(), content = '', endpoint = ''}) {
        this.id = id;
        this.state = state;
        this.userId = user_id;
        this.date = date;
        this.content = content;
        this.endpoint = endpoint;
    }
}