<template>
  <div class="desktop-ball" @click="handleClick">
    <div class="ball-bar"></div>
  </div>
</template>
<script lang="ts" setup></script>
<style scoped lang="less">
.desktop-ball {
  position: fixed;
  top: 0;
  right: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--fluent-reveal-bg);
  cursor: pointer;
  .ball-bar {
    width: 32px;
    height: 32px;
    position: fixed;
    top: 8px;
    right: 8px;
    border-radius: 50%;
    background-color: var(--fluent-reveal-bg);
  }
}
</style>
