import {defineStore} from "pinia";
import {ref} from "vue";

export const useUiStore = defineStore( 'ui', ()=>{
    const sidebar = ref(true);

    function toggleSidebar() {
        sidebar.value = !sidebar.value;
    }

    return {
        sidebar,
        toggleSidebar
    };
});