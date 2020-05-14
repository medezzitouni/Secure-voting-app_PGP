<template>
  <div id="app">
    <navbar/>
      <router-view></router-view>
  </div>
</template>

<script>
import navbar from "./components/navbar"
export default {
  components:{
    navbar,
  }
}
</script>
<style >
body {
  min-height: 100vh;
  background-color: rgb(230, 228, 219);
  background-image: linear-gradient(147deg, rgb(47, 47, 48) 0%, rgb(161, 161, 165) 100%);
}

</style>