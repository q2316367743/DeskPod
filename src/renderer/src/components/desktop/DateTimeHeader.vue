<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

const now = ref(dayjs())
const dateString = ref('')
const timeString = ref('')
const lunarDate = ref('')

const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

const updateDateTime = () => {
  const current = dayjs()
  now.value = current
  dateString.value = current.format('YYYY年MM月DD日') + ' ' + weekdays[current.day()]
  timeString.value = current.format('HH:mm')
  lunarDate.value = current.format('农历MM月DD日')
}

let timer: number

onMounted(() => {
  updateDateTime()
  timer = window.setInterval(updateDateTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <div class="datetime-header">
    <div class="date-line">
      <span class="date-text">{{ dateString }}</span>
    </div>
    <div class="time-line">
      <span class="time-text">{{ timeString }}</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.datetime-header {
  text-align: center;
  padding: 24px 16px 16px;
}

.date-line {
  margin-bottom: 4px;
}

.date-text {
  font-size: var(--td-font-size-body-large);
  color: var(--td-text-color-primary);
  font-weight: 400;
}

.time-line {
  margin-bottom: 8px;
}

.time-text {
  font-size: var(--td-font-size-title-large);
  font-weight: 600;
  color: var(--td-text-color-primary);
  letter-spacing: 2px;
}
</style>
