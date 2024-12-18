import http from "../../shared/services/http-common.js";

export class WorkshopService {
    resourceEndPoint = "/workshops";

    getById(id) {
        return http.get(`${this.resourceEndPoint}/${id}`);
    }

    getAllInterventionsByWorkshopId(workshopId) {
        return http.get(`${this.resourceEndPoint}/${workshopId}/interventions`);
    }

    post(data) {
        return http.post(this.resourceEndPoint, data);
    }

    getMechanicsUserIdByWorkshopId(workshopId) {
        return http.get(`${this.resourceEndPoint}/${workshopId}/mechanics`);
    }

    postMechanicToWorkshop(workshopId, mechanicData) {
        return http.post(`${this.resourceEndPoint}/${workshopId}/mechanics`, mechanicData);
    }

    getClientsUserIdByWorkShopId(workshopId) {
        return http.get(`${this.resourceEndPoint}/${workshopId}/clients`);
    }
    postClientToWorkshop(workshopId, clientData) {
        return http.post(`${this.resourceEndPoint}/${workshopId}/clients`, clientData);
    }
    getAllInterventionsByMechanicLeaderId(workshopId, mechanicLeaderId) {
        return http.get(`${this.resourceEndPoint}/${workshopId}/interventions?mechanicLeaderId=${mechanicLeaderId}`);
    }

    getAllInterventionsByMechanicAssistantId(workshopId, mechanicAssistantId) {
        return http.get(`${this.resourceEndPoint}/${workshopId}/interventions?mechanicAssitantId=${mechanicAssistantId}`);
    }



}