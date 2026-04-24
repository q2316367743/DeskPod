<template>
  <div class="quick-app">
    <router-view />
  </div>
</template>
<script lang="ts" setup></script>
<style scoped lang="less">
.quick-app {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}
</style>
