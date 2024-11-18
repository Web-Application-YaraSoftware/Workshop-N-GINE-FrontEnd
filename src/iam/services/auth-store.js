import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {useWorkshopStore} from "../../service-management/services/workshop-store.js";

export const useAuthStore = defineStore( 'auth', ()=>{
    const workshopStore = useWorkshopStore();

    const token = ref('');

    const isAuthenticated = computed(() =>
        token.value !== '' && user.value.id !== '' && user.value.roleId !== '' && user.value.workshopId !== ''
    );

    const user = ref({
        id: 0,
        roleId: 0,
        workshopId : 0
    });

    const isOwner = computed(() => Number(user.value.roleId) === 2);
    const isClient = computed(() => Number(user.value.roleId) === 3);
    const isMechanic = computed(() => Number(user.value.roleId) === 1);

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
            workshopStore.getWorkshop(Number(user.value.workshopId));
        }
    }

    function refreshWorkshop(){
        workshopStore.getWorkshop(Number(user.value.workshopId));
    }

    function logout(){
        token.value = '';
        user.value.id = 0;
        user.value.roleId = 0;
        user.value.workshopId = 0;
        workshopStore.workshopName = '';
        localStorage.removeItem('token');
        localStorage.removeItem('roleId');
        localStorage.removeItem('userId');
        localStorage.removeItem('workshopId');
        localStorage.removeItem('workshopName');
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
        logout,
        isOwner,
        isClient,
        isMechanic
    };
});