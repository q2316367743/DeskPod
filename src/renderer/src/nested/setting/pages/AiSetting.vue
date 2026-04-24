<template>
  <div class="p-8px">
    <!-- 模型列表 -->
    <t-card title="已添加的模型" size="small">
      <template #actions>
        <t-button theme="primary" @click="handleAdd()">添加</t-button>
      </template>
      <t-list split>
        <t-list-item v-for="model in models" :key="model.id">
          <t-list-item-meta
            :title="`${model.modelName}（${model.modelId}）`"
            :description="model.apiOrigin"
          ></t-list-item-meta>
          <template #action>
            <t-button theme="danger" variant="text" @click="handleDelete(model)">
              <delete-icon />
            </t-button>
          </template>
        </t-list-item>
      </t-list>
      <div
        v-if="models.length === 0"
        class="flex flex-col items-center justify-center text-color-secondary py-32px"
      >
        <robot-icon size="48px" class="mb-8px" />
        <span>暂无 AI 模型，请添加</span>
      </div>
    </t-card>
  </div>
</template>

<script lang="ts" setup>
import { DeleteIcon, RobotIcon } from 'tdesign-icons-vue-next'
import { AiModelSetting } from '@common/types'
import { openAddAiModelFunc } from '@/nested/setting/func/AddAiModelFunc'
import { MessageBoxUtil, MessageUtil } from '@/utils'

const models = ref<AiModelSetting[]>([])

const loadModels = async () => {
  models.value = await window.settingAPI.listAiModel()
}

const handleAdd = async () => {
  openAddAiModelFunc(loadModels)
}

const handleDelete = (row: AiModelSetting) => {
  MessageBoxUtil.confirm(`确定要删除模型「${row.modelName}」吗？`, '确认删除').then(async () => {
    await window.settingAPI.deleteAiModel(row.id)
    loadModels()
    MessageUtil.success('删除成功')
  })
}
onMounted(() => {
  loadModels()
})
</script>

<style scoped lang="less"></style>
