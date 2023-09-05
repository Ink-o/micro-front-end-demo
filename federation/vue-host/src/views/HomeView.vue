<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="元歌绝技1232312"></HelloWorld>
    <MyButton />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import axios from 'axios'

export default {
  name: 'HomeView',
  components: {
    HelloWorld: defineAsyncComponent(() => import("vue2HelloWorld/HelloWorld")),
    MyButton: defineAsyncComponent(() => import("vue2HelloWorld/MyButton")),
  },
  methods: {
    mounted() {
      console.log('主应用加载的 axios', axios);
    },
  }
}
</script>
