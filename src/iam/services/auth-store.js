import {defineStore} from "pinia";
import {computed, ref} from "vue";

export const useAuthStore = defineStore( 'auth', ()=>{
    const token = ref('');

    const isAuthenticated = computed(() => token.value !== '');

    function setAuth(newToken){
        token.value = newToken;
        localStorage.setItem('token', newToken);
    }

    function logout(){
        token.value = '';
        localStorage.removeItem('token');
    }

    return {
        token,
        isAuthenticated,
        setAuth,
        logout
    };
});