<template>
  <div>
    <h1>Create a Password</h1>
    <input type="password" v-model="password" placeholder="Enter password" />
    <input type="password" v-model="confirmPassword" placeholder="Confirm password" />
    <button @click="save">Save</button>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const router = useRouter()

async function save() {
  if (!password.value || password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }
  await window.api.setPassword(password.value)
  router.push('/textEditor')
}
</script>
