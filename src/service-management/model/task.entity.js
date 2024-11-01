import { TaskState } from "./task-state.enum.js";

export class Task {
    constructor({
                    id = 0,
                    assistantId = 0,
                    interventionId = 0,
                    state = TaskState.PENDING,
                    description = ''
                } = {}) {
        this.id = id;
        this.assistantId = assistantId;
        this.interventionId = interventionId;
        this.state = state;
        this.description = description;
    }

    finishTask() {
        this.state = TaskState.DONE;
    }
    cancelTask() {
        this.state = TaskState.CANCELED;
    }
}