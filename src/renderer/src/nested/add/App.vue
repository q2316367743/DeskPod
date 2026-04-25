<template>
  <t-layout class="w-100vw h-100vh">
    <t-header>
      <t-head-menu v-model="page" expand-type="popup">
        <t-menu-item value="/native/app">本地应用</t-menu-item>
        <t-menu-item value="/link">链接</t-menu-item>
        <t-menu-item value="/quick">快应用</t-menu-item>
        <t-menu-item value="/plugin">插件</t-menu-item>
        <t-submenu v-if="hasWidget" title="小部件" value="/widget">
          <t-menu-item value="/widget/builtin" disabled>内置</t-menu-item>
          <t-menu-item value="/widget/quick">快应用</t-menu-item>
          <t-menu-item value="/widget/plugin">插件</t-menu-item>
        </t-submenu>
        <t-submenu title="本地" value="/native">
          <t-menu-item value="/native/file">文件</t-menu-item>
          <t-menu-item value="/native/folder">文件夹</t-menu-item>
          <t-menu-item value="/native/command">命令</t-menu-item>
          <t-menu-item value="/native/script">脚本</t-menu-item>
        </t-submenu>
      </t-head-menu>
    </t-header>
    <t-content class="h-full overflow-y-auto">
      <add-link v-if="page === '/link'" />
      <add-quick-app v-else-if="page === '/quick'" />
      <add-plugin v-else-if="page === '/plugin'" />
      <add-widget-quick v-else-if="page === '/widget/quick'" />
      <add-widget-plugin v-else-if="page === '/widget/plugin'" />
      <add-native-app v-else-if="page === '/native/app'" />
      <add-native-file v-else-if="page === '/native/file'" />
      <add-native-folder v-else-if="page === '/native/folder'" />
    </t-content>
  </t-layout>
</template>
<script lang="ts" setup>
import AddNativeApp from '@/nested/add/components/AddNativeApp.vue'
import AddLink from '@/nested/add/components/AddLink.vue'
import AddQuickApp from '@/nested/add/components/AddQuickApp.vue'
import AddPlugin from '@/nested/add/components/AddPlugin.vue'
import AddWidgetQuick from '@/nested/add/components/AddWidgetQuick.vue'
import AddWidgetPlugin from '@/nested/add/components/AddWidgetPlugin.vue'
import AddNativeFile from '@/nested/add/components/AddNativeFile.vue'
import AddNativeFolder from '@/nested/add/components/AddNativeFolder.vue'

const params = new URLSearchParams(location.search)
const page = ref(params.get('type') || '/native/app')
const hasWidget = ref(!params.get('parentId'))
</script>
<style scoped lang="less"></style>
