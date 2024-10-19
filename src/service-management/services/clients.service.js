import http from "../../shared/services/http-common.js";

export class ClientsService {
    getClientById(id) {
        return http.get(`/users/${id}`);
    }
    getClientByDocument(dni) {
        return http.get(`/users?dni=${dni}`);
    }
}