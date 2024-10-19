import {defineStore} from "pinia";
import {ref} from "vue";
import {WorkshopService} from "../../service-management/services/workshop.service.js";
import {Workshop} from "../model/workshop.entity.js";

export const useWorkshopStore = defineStore( 'workshop', ()=>{
    const workshopService = new WorkshopService();

    const workshop = ref();
    const role = ref(1);
    const user = ref({
        id: 1
    });
    const mechanicType = ref(null);
    const mechanicTypes = [
        {
            id: 1,
            name: 'Leader'
        },
        {
            id: 2,
            name: 'Assistant'
        }
    ];

    function getWorkshop(id = 1){
        workshopService.getById(id)
            .then(response => {
                workshop.value = new Workshop(response.data);
            });
    }
    function setLeader(){
        mechanicType.value = mechanicTypes[0];
    }
    function setAssistant(){
        mechanicType.value = mechanicTypes[1];
    }

    return {
        workshop,
        role,
        user,
        mechanicType,
        getWorkshop,
        setLeader,
        setAssistant
    }
})