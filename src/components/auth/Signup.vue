<template>
  <main class="relative">
    <div class="max-w-screen-xl px-4 py-10 mt-20 mx-auto sm:px-6 lg:px-8">
      <div class="max-w-lg mx-auto">
        <h1 class="text-2xl font-bold text-center text-white sm:text-3xl">
          Sign up today
        </h1>

        <p class="max-w-md mx-auto mt-4 text-center text-gray-200">
          Enjoy saving your button design sets.
        </p>
        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
        <form
          @submit="processRegister"
          action=""
          class="p-8 mt-6 mb-0 space-y-4 rounded-lg shadow-md dark:bg-gray-700/50 backdrop-blur-md bg-none dark:text-white"
        >
          <p class="text-lg font-medium">Sign up new account</p>

          <div>
            <label for="nameOfUser" class="text-sm font-medium">Username</label>

            <div class="relative mt-1">
              <input
                v-model="username"
                type="text"
                id="username"
                required
                placeholder="Enter username"
                class="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm dark:text-black"
              />
            </div>
          </div>
          <div>
            <label for="nameOfUser" class="text-sm font-medium"
              >Your Name</label
            >

            <div class="relative mt-1">
              <input
                v-model="nameOfUser"
                type="text"
                id="nameOfUser"
                required
                placeholder="Enter your name"
                class="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm dark:text-black"
              />
            </div>
          </div>
          <div>
            <label for="email" class="text-sm font-medium">Email</label>

            <div class="relative mt-1">
              <input
                v-model="email"
                type="email"
                id="email"
                required
                class="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm dark:text-black"
                placeholder="Enter email"
              />
            </div>
          </div>

          <div>
            <label for="password" class="text-sm font-medium">Password</label>

            <div class="relative mt-1">
              <input
                v-model="password"
                type="password"
                id="password"
                required
                class="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm dark:text-black"
                placeholder="Enter password"
              />
            </div>
          </div>
          <div>
            <label for="confirmPassword" class="text-sm font-medium"
              >Confirm Password</label
            >

            <div class="relative mt-1">
              <input
                v-model="confirmPassword"
                type="password"
                id="confirmPassword"
                required
                placeholder="Confirm Password"
                class="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm dark:text-black"
              />
            </div>
          </div>

          <button type="submit">
            <Primarybtn> Sign Up </Primarybtn>
          </button>

          <slot />
        </form>
      </div>
    </div>
  </main>
</template>

<script>
import Primarybtn from "../buttons/Primarybtn.vue";
export default {
  name: "Signup",
  components: {
    Primarybtn,
  },
  data: () => {
    return {
      username: "",
      nameOfUser: "",
      email: "",
      password: "",
      confirmPassword: "",
      loading: "",
      error: false,
    };
  },
  methods: {
    async processRegister(e) {
      e.preventDefault();
      // Validation
      if (this.loading) {
        return;
      }
      // Password confirmation
      if (this.password !== this.confirmPassword) {
        this.error = "Error: Passwords must be matching.";
        return;
      }
      // Length Validation
      if (!(this.password.length >= 6 && this.password.length <= 32)) {
        this.error = "Error: Password must be between 6 and 32 characters.";
        return;
      }
      if (this.nameOfUser.length >= 100) {
        this.error = "Error: Name can not exceed 100 characters";
        return;
      }
      if (this.username.length >= 50) {
        this.error = "Error: username can not exceed 50 characters";
        return;
      }
      this.loading = true;

      //I need a username here to make dynamic users routes

      let username = this.username;
      username = username.replace(/\s+/g, "").toLowerCase();

      if (
        (await this.$parent.signup(
          username,
          this.nameOfUser,
          this.password,
          this.email
        )) === false
      ) {
        this.error =
          "Something went wrong while registering, Check console for more details.";
      } else {
        setTimeout(() => {
          this.$parent.updateUsername(username);
        }, 300);
      }
    },
  },
};
</script>

<style></style>
