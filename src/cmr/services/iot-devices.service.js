import http from "../../shared/services/http-common.js";

export class IotDevicesService {
    getAllByVehicleId(id) {
        return http.get(`/iot-devices?vehicleId=${id}`);
    }
}