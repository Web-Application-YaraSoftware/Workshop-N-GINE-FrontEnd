import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import 'primeflex/primeflex.css';
import App from './App.vue'

//Toast service
import ToastService from 'primevue/toastservice';

// Router
import router from "./router/index.js";

// i18n
import i18n from "./i18n.js";

// PrimeVue Theme
import PrimeVue from 'primevue/config';
import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

// PrimeVue Icons
import 'primeicons/primeicons.css';

// PrimeVue Components
import AutoComplete from "primevue/autocomplete";
import CascadeSelect from "primevue/cascadeselect";
import Checkbox from "primevue/checkbox";
import DataPicker from "primevue/datepicker";
import FloatLabel from "primevue/floatlabel";
import IconField from "primevue/iconfield";
import InputIcon from 'primevue/inputicon';
import InputGroup from "primevue/inputgroup";
import InputMask from "primevue/inputmask";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import MultiSelect from "primevue/multiselect";
import Password from "primevue/password";
import Select from "primevue/select";
import Textarea from "primevue/textarea";
import ToggleSwitch from "primevue/toggleswitch";
import Button from "primevue/button";
import SpeedDial from "primevue/speeddial";
import DataTable from "primevue/datatable";
import Column from 'primevue/column';
import Paginator from "primevue/paginator";
import Timeline from "primevue/timeline";
import Accordion from "primevue/accordion";
import Card from "primevue/card";
import Panel from "primevue/panel";
import ScrollPanel from "primevue/scrollpanel";
import Stepper from "primevue/stepper";
import Tabs from "primevue/tabs";
import Toolbar from "primevue/toolbar";
import ConfirmDialog from "primevue/confirmdialog";
import Dialog from "primevue/dialog";
import Drawer from "primevue/drawer";
import Tooltip from "primevue/tooltip";
import Menu from "primevue/menu";
import Message from "primevue/message";
import Toast from "primevue/toast";
import Image from "primevue/image";
import Avatar from "primevue/avatar";
import Badge from "primevue/badge";
import Tag from "primevue/tag";

// My design preset
const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{blue.50}',
            100: '{blue.100}',
            200: '{blue.200}',
            300: '{blue.300}',
            400: '{blue.400}',
            500: '{blue.500}',
            600: '{blue.600}',
            700: '{blue.700}',
            800: '{blue.800}',
            900: '{blue.900}',
            950: '{blue.950}'
        },
        colorScheme: {
            light: {
                primary: {
                    color: '{blue.950}',
                    inverseColor: '#ffffff',
                    hoverColor: '{blue.900}',
                    activeColor: '{blue.800}'
                },
                highlight: {
                    background: '{blue.950}',
                    focusBackground: '{blue.700}',
                    color: '#ffffff',
                    focusColor: '#ffffff'
                }
            },
            dark: {
                primary: {
                    color: '{blue.50}',
                    inverseColor: '{blue.950}',
                    hoverColor: '{blue.100}',
                    activeColor: '{blue.200}'
                },
                highlight: {
                    background: 'rgba(250, 250, 250, .16)',
                    focusBackground: 'rgba(250, 250, 250, .24)',
                    color: 'rgba(255,255,255,.87)',
                    focusColor: 'rgba(255,255,255,.87)'
                }
            }
        }
    }
});

// Create app instance
const app = createApp(App);

// Use i18n
app.use(i18n);

//Use Router
app.use(router);

// Use PrimeVue
app.use(PrimeVue, {
    theme: {
        preset: MyPreset,
        options: {
            darkModeSelector: 'system',
        }
    },
});

// Use PrimeVue Components
app.component('pv-autocomplete', AutoComplete)
    .component('pv-cascadeselect', CascadeSelect)
    .component('pv-checkbox', Checkbox)
    .component('pv-datepicker', DataPicker)
    .component('pv-floatlabel', FloatLabel)
    .component('pv-iconfield', IconField)
    .component('pv-inputicon', InputIcon)
    .component('pv-inputgroup', InputGroup)
    .component('pv-inputmask', InputMask)
    .component('pv-inputnumber', InputNumber)
    .component('pv-inputtext', InputText)
    .component('pv-multiselect', MultiSelect)
    .component('pv-password', Password)
    .component('pv-select', Select)
    .component('pv-textarea', Textarea)
    .component('pv-toggleswitch', ToggleSwitch)
    .component('pv-button', Button)
    .component('pv-speeddial', SpeedDial)
    .component('pv-datatable', DataTable)
    .component('pv-column', Column)
    .component('pv-paginator', Paginator)
    .component('pv-timeline', Timeline)
    .component('pv-accordion', Accordion)
    .component('pv-card', Card)
    .component('pv-panel', Panel)
    .component('pv-scrollpanel', ScrollPanel)
    .component('pv-stepper', Stepper)
    .component('pv-tabs', Tabs)
    .component('pv-toolbar', Toolbar)
    .component('pv-confirmdialog', ConfirmDialog)
    .component('pv-dialog', Dialog)
    .component('pv-drawer', Drawer)
    .component('pv-tooltip', Tooltip)
    .component('pv-menu', Menu)
    .component('pv-message', Message)
    .component('pv-toast', Toast)
    .component('pv-image', Image)
    .component('pv-avatar', Avatar)
    .component('pv-badge', Badge)
    .component('pv-tag', Tag);

// Use Toast Service
app.use(ToastService);

// Use Pinia
app.use(createPinia());

// Mount the app
app.mount('#app')
