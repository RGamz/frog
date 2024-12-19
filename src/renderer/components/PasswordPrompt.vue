<template>
  <div>
    <h1>Enter your Password</h1>
    <input type="password" v-model="password" placeholder="Password" />
    <button @click="login">Login</button>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const password = ref('')
const error = ref('')
const router = useRouter()

async function login() {
  const valid = await window.api.verifyPassword(password.value)
  if (valid) {
    router.push('/textEditor?pw=' + encodeURIComponent(password.value))
  } else {
    error.value = 'Invalid password'
  }
}
</script>
