<script setup>

</script>

<template>
  <div class="login-container">
    <pv-card>
      <template #content>
        <div class="flex justify-center gap-4" >
          <div class="login-section flex flex-column items-center">
            <span class="pi pi-car" style="scale: 10; margin-bottom: 3rem"></span>
            <h1>Sign In</h1>
            <pv-inputtext class="mb-4" placeholder="Email"/>
            <pv-inputtext class="mb-4" placeholder="Password"/>
            <router-link to="personnel">
              <pv-button label="Log In" ></pv-button>
            </router-link>
          </div>

          <div class="login-section flex flex-column items-center">
            <h1>Hello, Friend!</h1>
            <p>Create your account now and start your journey with us</p>
            <router-link to="register">
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


.flex{
  padding: 30px;
}

.login-container {
  margin: auto;
  width: 100%;
  height: 100%;
  display: block;
  padding: 70px;

}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
  align-content: center;
}

.gap-4 {
  gap: 1rem;
}

.login-section {
  margin: auto;
  margin-bottom: 10em;
  width: 100%;
  height: 100%;
  display: block;
  font-family: 'Roboto', sans-serif;
}

.login-section h1 {
  font-size: 3rem;
  text-align: center;
  padding: 3rem;
}

.login-section p {
  font-family: 'Roboto', sans-serif;
  padding: 3rem;
}

.w-full {
  width: 100%;

}

.mb-4 {
  margin-bottom: 1rem;
}

img{
}


</style>