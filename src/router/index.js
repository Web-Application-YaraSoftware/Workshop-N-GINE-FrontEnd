import {createRouter, createWebHistory} from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '',
            name: 'dashboard',
            alias: ['/dashboard', '/home'],
            component: () => import('../dashboards/pages/dashboard.component.vue'),
            children: [
                {
                    path: 'personnel',
                    name: 'personnel',
                    component: () => import('../personnel-management/pages/personnel-list.component.vue')
                },
                {
                    path: 'clients',
                    name: 'clients',
                    component: () => import('../client-management/pages/client-list.component.vue')
                },
                {
                    path: 'client/:id',
                    name: 'client-details',
                    component: () => import('../client-management/pages/client-detail.component.vue')
                },
                {
                    path: 'interventions',
                    name: 'interventions',
                    component: () => import('../intervention-management/pages/intervention-list.component.vue')
                },
                {
                    path: 'intervention/:id',
                    name: 'intervention-details',
                    component: () => import('../intervention-management/pages/intervention-detail.component.vue')
                },
                {
                    path: 'inventory',
                    redirect: {name: 'stock'},
                    component: () => import('../inventory-management/components/inventory-header.component.vue'),
                    children: [
                        {
                            path: 'stock',
                            name: 'stock',
                            component: () => import('../inventory-management/pages/inventory-stock.component.vue')
                        },
                        {
                            path: 'requests',
                            name: 'requests',
                            component: () => import('../inventory-management/pages/inventory-requests.component.vue')
                        }
                    ]
                },
                {
                    path: 'metrics',
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
                    component: () => import('../notifications/pages/notification-list.component.vue')
                },
                {
                    path: 'tasks',
                    name: 'tasks',
                    component: () => import('../task-management/pages/task-list.component.vue')
                },
                {
                    path: 'task/:taskId',
                    name: 'task-details',
                    redirect: {name: 'task-information'},
                    component: () => import('../task-management/components/step-list.component.vue'),
                    children: [
                        {
                            path: 'information',
                            name: 'task-information',
                            component: () => import('../task-management/pages/task-information.component.vue')
                        },
                        {
                            path: 'diagnostic-preparation',
                            name: 'task-diagnostic-preparation',
                            component: () => import('../task-management/pages/task-diagnostic-preparation.component.vue')
                        },
                        {
                            path: 'execution',
                            name: 'task-execution',
                            component: () => import('../task-management/components/related-task-list.component.vue'),
                            children: [
                                {
                                    path: 'internal-task/:internalTaskId',
                                    name: 'internal-task-details',
                                    redirect: {name: 'internal-task-requests'},
                                    component: () => import('../task-management/components/internal-task-header.component.vue'),
                                    children: [
                                        {
                                            path: 'requests',
                                            name: 'internal-task-requests',
                                            component: () => import('../task-management/pages/task-requests.component.vue')
                                        },
                                        {
                                            path: 'tracking',
                                            name: 'internal-task-tracking',
                                            component: () => import('../task-management/pages/task-tracking.component.vue')
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            path: 'monitoring',
                            name: 'task-monitoring',
                            component: () => import('../task-management/pages/task-monitoring.component.vue')
                        }
                    ]
                },
                {
                    path: 'vehicles/:carOwnerId',
                    name: 'vehicles',
                    component: () => import('../vehicle-management/pages/vehicle-list.component.vue')
                },
                {
                    path: 'vehicle/:carId',
                    name: 'vehicle-details',
                    component: () => import('../vehicle-management/pages/vehicle-detail.component.vue')
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

export default router;