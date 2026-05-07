<template>
  <div class="desktop-header">
    <div :class="{ 'desktop-header-wrap': true, mac: isMac }">
      <button class="btn">
        <search-icon />
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { SearchIcon } from 'tdesign-icons-vue-next'

const isMac = window.supportAPI.isMacOS()
</script>
<style scoped lang="less">
.desktop-header {
  height: 32px;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  .desktop-header-wrap {
    padding-left: 0;
    padding-right: 76px;
    display: flex;
    justify-content: space-between;
    -webkit-app-region: drag;
    .btn {
      height: 32px;
      width: 32px;
      cursor: pointer;
      border: none;
      background-color: transparent;
      transition: all 0.3s ease-in-out;
      border-radius: 4px;

      &:hover {
        background-color: var(--fluent-reveal-bg);
      }

      -webkit-app-region: no-drag;

      .t-icon {
        color: var(--td-brand-color);
      }
    }
    &.mac {
      padding-left: 76px;
      padding-right: 0;
    }
  }
}
</style>
