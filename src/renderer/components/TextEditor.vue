<template>
  <div>
    <h1>Your Secure Notes</h1>
    <textarea v-model="text" rows="10" cols="50"></textarea>
    <button @click="saveNotes">Save</button>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'

  const text = ref('')
  const route = useRoute()
  const password = decodeURIComponent(route.query.pw)

  onMounted(async () => {
    const storedText = await window.api.loadNotes(password)
    text.value = storedText
  })

  async function saveNotes() {
    await window.api.saveNotes(password, text.value)
    alert('Notes saved securely!')
  }
</script>
