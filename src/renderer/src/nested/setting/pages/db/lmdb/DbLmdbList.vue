<template>
  <div class="m-8px">
    <t-card size="small" title="lmdb">
      <t-list size="small" split>
        <t-list-item v-for="key in keys" :key="key">
          {{ key }}
          <template #action>
            <t-button theme="primary" variant="text" @click="openDbLmdbValue(key)"> 查看 </t-button>
            <t-popconfirm
              content="是否删除这个数据，部分数据删除后需要重启生效"
              @confirm="handleDelete(key)"
            >
              <t-button theme="danger" variant="text"> 删除 </t-button>
            </t-popconfirm>
          </template>
        </t-list-item>
      </t-list>
    </t-card>
  </div>
</template>
<script lang="ts" setup>
import { openDbLmdbValue } from './func'
import { MessageUtil } from '@/utils'

const keys = ref(new Array<string>())

const init = () =>
  window.dbAPI.lmdb.main.keys().then((res) => {
    keys.value = res
  })

const handleDelete = (key: string): void => {
  window.dbAPI.lmdb.main
    .delete(key)
    .then(() => {
      MessageUtil.success('删除成功')
      init()
    })
    .catch((e) => {
      MessageUtil.error('删除失败', e)
    })
}

onMounted(init)
</script>
<style scoped lang="less"></style>
