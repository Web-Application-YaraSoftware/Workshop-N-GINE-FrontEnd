import {defineStore} from "pinia";
import {ref} from "vue";
import {WorkshopService} from "../../service-management/services/workshop.service.js";
import {Workshop} from "../model/workshop.entity.js";

export const useWorkshopStore = defineStore( 'workshop', ()=>{
    const categoryService = new WorkshopService();

    const workshop = ref();
    const role = ref(1);
    const user = ref({
        id: 1
    })

    function getWorkshop(id = 1){
        categoryService.getById(id)
            .then(response => {
                workshop.value = new Workshop(response.data);
            });
    }

    return {
        workshop,
        role,
        user,
        getWorkshop
    }
})