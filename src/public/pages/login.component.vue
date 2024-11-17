<script setup>
import {computed, ref} from "vue";
import {useAuthStore} from "../../iam/services/auth-store.js";
import {AccessService} from "../../iam/services/access.service.js";
import {useRouter} from "vue-router";
import { useToast } from 'primevue/usetoast';

const accessService = new AccessService();
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const username = ref('');
const password = ref('');
const credentials = computed(() => {
  return {
    username: username.value,
    password: password.value
  }
});

function onSubmit(event) {
  event.preventDefault();
  if(!IsValid()) return;
  accessService.signIn(credentials.value)
    .then(response => {
      saveInStore(response);
      toast.add({severity: 'success', summary: 'Success', detail: "Welcome back!"});
      goToHome();
    })
    .catch( () => {
      toast.add({severity: 'error', summary: 'Error', detail: "Invalid credentials"});
    });
}

function saveInStore(response){
  authStore.setAuth(response.data.token || 'tokenDefault');
  authStore.setUserId(response.data.id);
  authStore.setRoleId(response.data.roleId);
  authStore.setWorkshopId(response.data.workshopId);
}

function goToHome() {
  router.push({name: 'home'});
}

function IsValid() {
  return username.value.length > 0 && password.value.length > 0;
}

</script>

<template>
  <div class="login-container background">
    <pv-toast/>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <pv-card>
      <template #content>
        <div class="sections">
          <div class="section sign-in-section">
            <span class="pi pi-car icon"></span>
            <h1>¡Welcome Back!</h1>
            <form class="form" @submit.prevent="onSubmit">
              <pv-floatlabel class="w-full">
                <pv-inputtext class="w-full my-2" id="email" v-model="username"/>
                <label for="email">Username</label>
              </pv-floatlabel>
              <pv-floatlabel class="w-full">
                <pv-password class="w-full my-2" id="password" v-model="password" toggleMask fluid/>
                <label for="password">Password</label>
              </pv-floatlabel>
              <pv-button type="submit" label="Sign in" class="my-3 w-fit m-auto"></pv-button>
            </form>
          </div>

          <div class="section sign-up-section">
            <div class="content">
              <h1>Drive Your Workshop to Success</h1>
              <p>Streamline your workshop and boost efficiency. Sign up now to accelerate your growth!</p>
              <router-link :to="{name: 'register'}">
                <pv-button label="Sign up" class="w-full"></pv-button>
              </router-link>
            </div>
          </div>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>
.login-container {
  margin: auto;
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.sections {
  display: flex;
  flex-wrap: wrap;
  max-width: 1000px;
  margin: auto;
  overflow: hidden;
}

.section {
  flex: 1;
  min-width: 30rem;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  text-align: center;
}

.sign-in-section {
  background-color: #fff;
}

.sign-up-section {
  position: relative;
  background-image: url("/assets/images/sign-in-presentation.webp");
  background-size: cover;
  background-position: center;
}
.sign-up-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.content{
  z-index: 2;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.form {
  padding: 0.5rem 0;
  width: 100%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form pv-button {
  width: 100%;
}


.icon {
  font-size: 12.5rem;
  color: #1943a8;
}
@keyframes move {
  100% {
    transform: translate3d(0, 0, 1px) rotate(360deg);
  }
}

.background {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: linear-gradient(135deg, #71b7e6, #00185b);
  overflow: hidden;
}

.background > span {
  width: 20vmin;
  height: 20vmin;
  z-index: -1;
  border-radius: 20vmin;
  backface-visibility: hidden;
  position: absolute;
  animation: move;
  animation-duration: 45s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.background > span:nth-child(0) {
  color: #00ffe1;
  top: 58%;
  left: 53%;
  animation-duration: 23s;
  animation-delay: -3s;
  transform-origin: -7vw 15vh;
  box-shadow: 40vmin 0 5.176595533161283vmin currentColor;
}
.background > span:nth-child(1) {
  color: #5a81e4;
  top: 53%;
  left: 39%;
  animation-duration: 44s;
  animation-delay: -22s;
  transform-origin: 5vw 10vh;
  box-shadow: -40vmin 0 5.534879177075572vmin currentColor;
}
.background > span:nth-child(2) {
  color: #3c5687;
  top: 8%;
  left: 28%;
  animation-duration: 9s;
  animation-delay: -43s;
  transform-origin: -2vw 9vh;
  box-shadow: 40vmin 0 5.3338857346990185vmin currentColor;
}
.background > span:nth-child(3) {
  color: #5ae4e4;
  top: 91%;
  left: 71%;
  animation-duration: 26s;
  animation-delay: -35s;
  transform-origin: -20vw -7vh;
  box-shadow: 40vmin 0 5.144052913178565vmin currentColor;
}
.background > span:nth-child(4) {
  color: #5a91e4;
  top: 22%;
  left: 16%;
  animation-duration: 30s;
  animation-delay: -6s;
  transform-origin: 13vw -5vh;
  box-shadow: -40vmin 0 5.0179488232776vmin currentColor;
}
.background > span:nth-child(5) {
  color: #3c5187;
  top: 32%;
  left: 56%;
  animation-duration: 39s;
  animation-delay: -30s;
  transform-origin: -13vw -10vh;
  box-shadow: 40vmin 0 5.74162874244422vmin currentColor;
}
.background > span:nth-child(6) {
  color: #3c5f87;
  top: 15%;
  left: 43%;
  animation-duration: 14s;
  animation-delay: -34s;
  transform-origin: 2vw 4vh;
  box-shadow: -40vmin 0 5.23603017387423vmin currentColor;
}
.background > span:nth-child(7) {
  color: #acf5ff;
  top: 83%;
  left: 46%;
  animation-duration: 41s;
  animation-delay: -16s;
  transform-origin: -6vw 4vh;
  box-shadow: 40vmin 0 5.968657162274097vmin currentColor;
}
.background > span:nth-child(8) {
  color: #3c7387;
  top: 17%;
  left: 65%;
  animation-duration: 54s;
  animation-delay: -48s;
  transform-origin: -9vw 7vh;
  box-shadow: -40vmin 0 5.135904289019175vmin currentColor;
}
.background > span:nth-child(9) {
  color: #acdcff;
  top: 52%;
  left: 64%;
  animation-duration: 34s;
  animation-delay: -14s;
  transform-origin: 7vw 7vh;
  box-shadow: -40vmin 0 5.692954844076822vmin currentColor;
}
.background > span:nth-child(10) {
  color: #3c4b87;
  top: 12%;
  left: 42%;
  animation-duration: 6s;
  animation-delay: -36s;
  transform-origin: 8vw 9vh;
  box-shadow: -40vmin 0 5.950233220710903vmin currentColor;
}
.background > span:nth-child(11) {
  color: #3c4b87;
  top: 5%;
  left: 51%;
  animation-duration: 49s;
  animation-delay: -16s;
  transform-origin: -13vw -23vh;
  box-shadow: 40vmin 0 5.242227084588272vmin currentColor;
}
.background > span:nth-child(12) {
  color: #3c4e87;
  top: 55%;
  left: 62%;
  animation-duration: 46s;
  animation-delay: -44s;
  transform-origin: -23vw -2vh;
  box-shadow: 40vmin 0 5.892195299247033vmin currentColor;
}
.background > span:nth-child(13) {
  color: #5a76e4;
  top: 31%;
  left: 51%;
  animation-duration: 37s;
  animation-delay: -20s;
  transform-origin: -23vw -23vh;
  box-shadow: 40vmin 0 5.637218709000092vmin currentColor;
}
.background > span:nth-child(14) {
  color: #acbdff;
  top: 77%;
  left: 91%;
  animation-duration: 31s;
  animation-delay: -2s;
  transform-origin: -10vw 19vh;
  box-shadow: -40vmin 0 5.015925952755738vmin currentColor;
}
.background > span:nth-child(15) {
  color: #5a71e4;
  top: 18%;
  left: 72%;
  animation-duration: 23s;
  animation-delay: -36s;
  transform-origin: -18vw 13vh;
  box-shadow: -40vmin 0 5.279589277116813vmin currentColor;
}
.background > span:nth-child(16) {
  color: #5a8ae4;
  top: 98%;
  left: 99%;
  animation-duration: 6s;
  animation-delay: -9s;
  transform-origin: 18vw 16vh;
  box-shadow: 40vmin 0 5.666999065774667vmin currentColor;
}
.background > span:nth-child(17) {
  color: #5a81e4;
  top: 95%;
  left: 73%;
  animation-duration: 23s;
  animation-delay: -47s;
  transform-origin: -15vw 13vh;
  box-shadow: 40vmin 0 5.069137396264436vmin currentColor;
}
.background > span:nth-child(18) {
  color: #5a9ae4;
  top: 87%;
  left: 94%;
  animation-duration: 15s;
  animation-delay: -33s;
  transform-origin: -4vw 18vh;
  box-shadow: 40vmin 0 5.52669289232621vmin currentColor;
}
.background > span:nth-child(19) {
  color: #3c5187;
  top: 97%;
  left: 64%;
  animation-duration: 40s;
  animation-delay: -46s;
  transform-origin: -8vw -13vh;
  box-shadow: -40vmin 0 5.283217922715748vmin currentColor;
}

</style>
