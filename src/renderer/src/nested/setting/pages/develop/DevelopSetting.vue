<template>
  <div class="p-8px">
    <t-card title="开发者工具" size="small">
      <t-layout style="height: calc(100vh - 64px)">
        <t-aside width="200px" class="h-full">
          <div class="develop-aside">
            <div class="content">
              <div class="develop-item">
                <div class="develop-item-icon">
                  <internet-icon />
                </div>
                <div class="develop-item-name">快应用</div>
              </div>
              <div class="develop-item">
                <div class="develop-item-icon">
                  <internet-icon />
                </div>
                <div class="develop-item-name">快应用</div>
              </div>
              <div class="develop-item">
                <div class="develop-item-icon">
                  <app-icon />
                </div>
                <div class="develop-item-name">插件</div>
              </div>
            </div>
            <div class="footer">
              <add-icon class="mr-8px" />
              新建项目
            </div>
          </div>
        </t-aside>
        <t-content> </t-content>
      </t-layout>
    </t-card>
  </div>
</template>
<script lang="ts" setup>
import { AddIcon, AppIcon, InternetIcon } from 'tdesign-icons-vue-next'
</script>
<style scoped lang="less">
:deep(.t-card) {
  overflow: hidden;
}
:deep(.t-card__body) {
  padding: 0 !important;
}
.develop-aside {
  height: 100%;
  display: flex;
  flex-direction: column;

  .content {
    height: 100%;
    overflow: auto;
    .develop-item {
      display: flex;
      height: 32px;
      border-bottom: 1px solid var(--td-border-level-1-color);
      align-items: center;
      transition: all 0.3s ease-in-out;
      cursor: pointer;
      padding-top: 4px;
      padding-bottom: 4px;

      &:hover {
        background: var(--td-bg-color-container-hover);
      }
      &:active {
        background: var(--td-bg-color-container-active);
      }
      &.active {
        background: var(--td-bg-color-container-active);
      }

      .develop-item-icon {
        margin-left: 8px;
      }
      .develop-item-name {
        margin-left: 8px;
      }
    }
  }
  .footer {
    height: 32px;
    flex-shrink: 0;
    border-top: 1px solid var(--td-border-level-1-color);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    user-select: none;

    &:hover {
      background: var(--td-bg-color-container-hover);
    }
    &:active {
      background: var(--td-bg-color-container-active);
    }
  }
}
</style>
