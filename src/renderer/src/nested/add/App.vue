<template>
  <t-layout class="w-full h-full">
    <t-header>
      <t-head-menu v-model="page" expand-type="popup">
        <t-menu-item value="/app">本地应用</t-menu-item>
        <t-menu-item value="/link">链接</t-menu-item>
        <t-menu-item value="/quick">快应用</t-menu-item>
        <t-menu-item value="/plugin">插件</t-menu-item>
        <t-submenu title="小部件" value="/widget">
          <t-menu-item value="/widget/builtin">内置</t-menu-item>
          <t-menu-item value="/widget/quick">快应用</t-menu-item>
          <t-menu-item value="/widget/plugin">插件</t-menu-item>
        </t-submenu>
      </t-head-menu>
    </t-header>
    <t-content>
      <add-app v-if="page === '/app'" />
      <add-link v-else-if="page === '/link'" />
    </t-content>
  </t-layout>
</template>
<script lang="ts" setup>
import AddApp from '@/nested/add/components/AddApp.vue'
import AddLink from '@/nested/add/components/AddLink.vue'

const page = ref('/app')
</script>
<style scoped lang="less"></style>
