import {createRouter, createWebHistory} from "vue-router";

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
                    component: () => import('../cmr/pages/client-list.component.vue')
                },
                {
                    path: 'client/:id',
                    name: 'client-details',
                    component: () => import('../cmr/pages/client-detail.component.vue')
                },
                {
                    path: 'interventions',
                    name: 'interventions',
                    component: () => import('../service-management/pages/intervention-list.component.vue')
                },
                {
                    path: 'intervention/:id',
                    name: 'intervention-details',
                    component: () => import('../service-management/pages/intervention-detail.component.vue')
                },
                {
                    path: 'inventory',
                    redirect: {name: 'stock'},
                    component: () => import('../service-management/components/inventory-header.component.vue'),
                    children: [
                        {
                            path: 'stock',
                            name: 'stock',
                            component: () => import('../service-management/pages/inventory-stock.component.vue')
                        },
                        {
                            path: 'requests',
                            name: 'requests',
                            component: () => import('../service-management/pages/inventory-requests.component.vue')
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
                    component: () => import('../communication-management/pages/notification-list.component.vue')
                },
                {
                    path: 'tasks',
                    name: 'tasks',
                    component: () => import('../service-management/pages/task-list.component.vue')
                },
                {
                    path: 'task/:taskId',
                    name: 'task-details',
                    redirect: {name: 'task-information'},
                    component: () => import('../service-management/components/step-list.component.vue'),
                    children: [
                        {
                            path: 'information',
                            name: 'task-information',
                            component: () => import('../service-management/pages/task-information.component.vue')
                        },
                        {
                            path: 'diagnostic-preparation',
                            name: 'task-diagnostic-preparation',
                            component: () => import('../service-management/pages/task-diagnostic-preparation.component.vue')
                        },
                        {
                            path: 'execution',
                            name: 'task-execution',
                            component: () => import('../service-management/components/related-task-list.component.vue'),
                            children: [
                                {
                                    path: 'internal-task/:internalTaskId',
                                    name: 'internal-task-details',
                                    redirect: {name: 'internal-task-requests'},
                                    component: () => import('../service-management/components/internal-task-header.component.vue'),
                                    children: [
                                        {
                                            path: 'requests',
                                            name: 'internal-task-requests',
                                            component: () => import('../service-management/pages/task-requests.component.vue')
                                        },
                                        {
                                            path: 'tracking',
                                            name: 'internal-task-tracking',
                                            component: () => import('../service-management/pages/task-tracking.component.vue')
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            path: 'monitoring',
                            name: 'task-monitoring',
                            component: () => import('../service-management/pages/task-monitoring.component.vue')
                        }
                    ]
                },
                {
                    path: 'vehicles/:carOwnerId',
                    name: 'vehicles',
                    component: () => import('../cmr/pages/vehicle-list.component.vue')
                },
                {
                    path: 'vehicle/:carId',
                    name: 'vehicle-details',
                    component: () => import('../cmr/pages/vehicle-detail.component.vue')
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