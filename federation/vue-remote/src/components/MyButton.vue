<template>
  <button @click="getLodash">
    <!-- <slot /> -->
    1212121
  </button>
</template>
<script setup>
import { onMounted } from 'vue'
import axios from 'axios'

const getLodash = async () => {
  console.log('_: ', axios);
}
</script>