import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {useWorkshopStore} from "../../service-management/services/workshop-store.js";

export const useAuthStore = defineStore( 'auth', ()=>{
    const workshopStore = useWorkshopStore();

    const token = ref('');

    const isAuthenticated = computed(() =>
        token.value !== '' && user.value.id !== 0 && user.value.roleId !== 0 && user.value.workshopId !== 0
    );

    const user = ref({
        id: 0,
        roleId: 0,
        workshopId : 0
    });

    function setAuth(newToken){
        token.value = newToken;
        localStorage.setItem('token', newToken);
    }

    function setUserId(newUserId){
        user.value.id = newUserId;
        localStorage.setItem('userId', newUserId);
    }

    function setRoleId(newRole){
        user.value.roleId = newRole;
        localStorage.setItem('roleId', newRole);
    }

    function setWorkshopId(newWorkshopId){
        user.value.workshopId = newWorkshopId;
        localStorage.setItem('workshopId', newWorkshopId);
    }

    function refresh(){
        token.value = localStorage.getItem('token') || '';
        user.value.id = Number(localStorage.getItem('userId')) || 0;
        user.value.roleId = Number(localStorage.getItem('roleId')) || 0;
        user.value.workshopId = Number(localStorage.getItem('workshopId')) || 0;
        workshopStore.workshopName = localStorage.getItem('workshopName') || '';
        if(workshopStore.workshopName === '' && user.value.workshopId !== 0){
            console.log(user.value.workshopId);
            workshopStore.getWorkshop(user.value.workshopId);
        }
        console.log(user.value.id, user.value.roleId, user.value.workshopId);
    }

    function refreshWorkshop(){
        workshopStore.getWorkshop(user.value.workshopId);
    }

    function logout(){
        token.value = '';
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        localStorage.removeItem('workshopId');
    }

    return {
        token,
        isAuthenticated,
        user,
        setRoleId,
        setUserId,
        setAuth,
        setWorkshopId,
        refresh,
        refreshWorkshop,
        logout
    };
});