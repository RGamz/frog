<template>
  <div>
    <TextArea v-model="text"></TextArea>
    <SubmitButton @click="saveNotes">Save</SubmitButton>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import SubmitButton from "../components/SubmitButton.vue";
import TextArea from "../components/TextArea.vue";

const text = ref("");
const route = useRoute();
const password = decodeURIComponent(route.query.pw);

onMounted(async () => {
  const storedText = await window.api.loadNotes(password);
  text.value = storedText;
});

async function saveNotes() {
  await window.api.saveNotes(password, text.value);
  alert("Notes saved securely!");
}
</script>
