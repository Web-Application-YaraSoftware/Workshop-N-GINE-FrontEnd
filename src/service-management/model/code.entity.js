import {CodeState} from "./code-state.enum.js";

export class Code {
    constructor({
                    id = 0,
                    component = '',
                    errorCode = '',
                    description = '',
                    lastUpdated = '',
                    state = CodeState.GOOD
                } = {}) {
        this.id = id;
        this.component = component;
        this.errorCode = errorCode;
        this.description = description;
        this.lastUpdated = lastUpdated? new Date(lastUpdated): new Date();
        this.state = state;
    }
}