import http from "../../shared/services/http-common.js";

export class PersonnelService {
    getAllPersonnel() {
        return http.get('/users');
    }
}