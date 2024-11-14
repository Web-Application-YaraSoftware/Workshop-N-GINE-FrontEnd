import {createRouter, createWebHistory} from "vue-router";
import {useAuthStore} from "../iam/services/auth-store.js";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '',
            name: 'home',
            component: () => import('../shared/components/main-layout.component.vue'),
            children: [
                {
                    path: 'personnel',
                    name: 'personnel',
                    component: () => import('../service-management/pages/personnel.view.vue')
                },
                {
                    path: 'clients',
                    name: 'clients',
                    component: () => import('../service-management/pages/client-list.component.vue')
                },
                {
                    path: 'clients/:id',
                    name: 'client-details',
                    component: () => import('../service-management/pages/client-detail.component.vue')
                },
                {
                    path: 'interventions',
                    name: 'interventions',
                    component: () => import('../service-management/pages/intervention-list.component.vue')
                },
                {
                    path: 'interventions/:id',
                    name: 'intervention-details',
                    component: () => import('../service-management/pages/intervention-detail.component.vue')
                },
                {
                    path: 'inventory',
                    name: 'inventory',
                    redirect: {name: 'stock'},
                    component: () => import('../Inventory/components/inventory-header.component.vue'),
                    children: [
                        {
                            path: 'stock',
                            name: 'stock',
                            component: () => import('../Inventory/pages/inventory-stock.component.vue')
                        },
                        {
                            path: 'requests',
                            name: 'requests',
                            component: () => import('../Inventory/pages/inventory-requests.component.vue')
                        }
                    ]
                },
                {
                    path: 'metrics',
                    name: 'metrics',
                    redirect: {name: 'interventions-by-date'},
                    component: () => import('../analytics/components/metrics-header.component.vue'),
                    children:[
                        {
                            path: 'interventions-by-date',
                            name: 'interventions-by-date',
                            component: () => import('../analytics/pages/metric-interventions-by-date.component.vue')
                        }
                        // TODO: Add more metrics
                    ]
                },
                {
                    path: 'notifications',
                    name: 'notifications',
                    component: () => import('../communication-management/pages/notification-list.component.vue')
                },
                {
                    path: 'activities',
                    name: 'activities',
                    redirect: {name: 'assistant'},
                    component: () => import('../service-management/components/activities-header.component.vue'),
                    children: [
                        {
                            path: 'assistant',
                            name: 'assistant',
                            component: () => import('../service-management/pages/interventions-assistant.view.vue')
                        },
                        {
                            path: 'leader',
                            name: 'leader',
                            component: () => import('../service-management/pages/interventions-leader.view.vue')
                        }
                    ]
                },
                {
                    path: 'activities/:id',
                    name: 'activity-details',
                    component: () => import('../service-management/pages/activity.view.vue')
                },
                {
                    path: 'vehicles/:carOwnerId',
                    name: 'vehicles',
                    component: () => import('../service-management/pages/vehicle-list.component.vue')
                },
                {
                    path: 'vehicle/:carId',
                    name: 'vehicle-details',
                    component: () => import('../service-management/pages/vehicle-detail.component.vue')
                },
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../public/pages/login.component.vue')
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('../public/pages/sign-up.component.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('../public/pages/page-not-found.component.vue')
        }
    ]
});

/*router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    if (to.name !== 'login' && to.name !== 'register' && !authStore.isAuthenticated) {
        next({name: 'login'});
    } else {
        next();
    }
});*/

export default router;