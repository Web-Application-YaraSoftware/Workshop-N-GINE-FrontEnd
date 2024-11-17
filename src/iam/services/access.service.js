import http from "../../shared/services/http-common.js";

export class AccessService {
    resourceEndpoint = '/authentication/';

    signIn(data) {
        return http.post(`${this.resourceEndpoint}sign-in`, data);
    }

    signUp(data) {
        return http.post(`${this.resourceEndpoint}sign-up`, data);
    }
}