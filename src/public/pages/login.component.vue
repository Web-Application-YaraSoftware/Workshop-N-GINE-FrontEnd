<script setup>
import {ref} from "vue";
import {useWorkshopStore} from "../../shared/services/workshop-store.js";
import {AccessService} from "../../iam/services/access.service.js";
import {useRouter} from "vue-router";
import { useToast } from 'primevue/usetoast';

const workshopStore = useWorkshopStore();
const accessService = new AccessService();
const router = useRouter();
const toast = useToast();

function onSubmit(event) {
  event.preventDefault();
  accessService.getAccessByCredentials({
    email: emailUser.value,
    password: passwordUser.value
  }).then(
    (response) => {
      if(response.data && response.data.length > 0) {
        workshopStore.role = response.data[0].user_type.id;
        workshopStore.user = response.data[0];
        localStorage.setItem('token', JSON.stringify(true));
        toast.add({severity:'success', summary: 'Success login', detail: 'Valid credentials', life: 5000});
        router.push({name: 'home'});
      } else {
        toast.add({severity:'error', summary: 'Error login', detail: 'Invalid credentials', life: 5000});
      }
    }
  ).catch(
    () => {
      toast.add({severity:'error', summary: 'Error login', detail: 'Invalid credentials', life: 5000});
    }
  );
}
const emailUser = ref('');
const passwordUser = ref('');
</script>

<template>
  <pv-toast/>
  <div class="login-container">
    <pv-card>
      <template #content>
        <div class="sections align-items-center justify-center gap-4" >
          <div class="section flex flex-column align-items-center">
            <span class="pi pi-car" style="font-size: 12.5rem"></span>
            <h1>Sign In</h1>
            <form class="form" @submit.prevent = "onSubmit">
              <pv-floatlabel class="w-full">
                <pv-inputtext class="w-full my-2" id="email" v-model="emailUser"/>
                <label for="email">Email</label>
              </pv-floatlabel>
              <pv-floatlabel class="w-full">
                <pv-password class="w-full my-2" id="password" v-model="passwordUser" toggleMask/>
                <label for="password">Password</label>
              </pv-floatlabel>
              <pv-button type="submit" label="Log In" class="my-3"></pv-button>
            </form>
          </div>

          <div class="section hidden flex flex-column align-items-center">
            <h1>Hello, Friend!</h1>
            <p>Create your account now and start your journey with us</p>
            <router-link :to="{name: 'register'}">
              <pv-button label="Create Account" class></pv-button>
            </router-link>
          </div>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>


.items-center{
  --primary-100: ;
}

.login-container {
  margin: auto;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 7rem;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.sections {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.section {
  width: 100%;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.login-section h1 {
  font-size: 3rem;
  text-align: center;
}
</style>