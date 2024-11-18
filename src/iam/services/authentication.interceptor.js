import {useAuthStore} from "./auth-store.js";

export const authenticationInterceptor = (config) =>{
    const authStore = useAuthStore();

    const isAuthenticated = authStore.isAuthenticated;

    if(isAuthenticated) {
        config.headers.Authorization = `Bearer ${authStore.token}`;
    }

    return config;
}