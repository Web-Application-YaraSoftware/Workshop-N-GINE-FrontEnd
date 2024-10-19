import http from "../../shared/services/http-common.js";

export class AccessService {
    resourceEndpoint = '/users';

    getAccessByCredentials({email, password}) {
        return http.get(this.resourceEndpoint, {
            params: {
                email: email,
                password: password
            }
        });
    }
}