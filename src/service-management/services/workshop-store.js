import {defineStore} from "pinia";
import {ref} from "vue";
import {WorkshopService} from "./workshop.service.js";

export const useWorkshopStore = defineStore( 'workshop', ()=>{
    const workshopService = new WorkshopService();
    const workshopName = ref('');

    function getWorkshop(id){
        workshopService.getById(id)
            .then(response => {
                workshopName.value = response.data.name;
                localStorage.setItem('workshopName', response.data.name);
            });
    }

    const mechanicType = ref(null);
    const mechanicTypes = [
        {
            id: 0,
            name: 'Leader'
        },
        {
            id: 1,
            name: 'Assistant'
        }
    ];

    function setLeader(){
        mechanicType.value = mechanicTypes[0];
    }
    function setAssistant(){
        mechanicType.value = mechanicTypes[1];
    }

    return {
        mechanicType,
        mechanicTypes,
        workshopName,
        getWorkshop,
        setLeader,
        setAssistant
    }
})