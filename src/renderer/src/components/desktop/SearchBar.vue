<script lang="ts" setup>
import { SearchIcon } from 'tdesign-icons-vue-next'

type SearchEngine = 'baidu' | 'bing' | 'douyin' | 'bilibili'

interface SearchEngineConfig {
  key: SearchEngine
  name: string
  url: string
  placeholder: string
  icon?: string
}

const engines: SearchEngineConfig[] = [
  { key: 'baidu', name: '百度', url: 'https://www.baidu.com/s', placeholder: '百度一下，你就知道' },
  {
    key: 'bing',
    name: '必应',
    url: 'https://www.bing.com/search',
    placeholder: '搜索你想要的内容'
  },
  {
    key: 'douyin',
    name: '抖音',
    url: 'https://www.douyin.com/search',
    placeholder: '搜索抖音视频'
  },
  {
    key: 'bilibili',
    name: '哔哩哔哩',
    url: 'https://search.bilibili.com/all',
    placeholder: '搜索视频、番剧、影视'
  }
]

const props = defineProps<{
  defaultEngine?: SearchEngine
}>()

const emit = defineEmits<{
  search: [query: string, engine: SearchEngine]
}>()

const currentEngine = ref<SearchEngine>(props.defaultEngine ?? 'baidu')
const query = ref('')
const suggestions = ref<Array<{ text: string; type: string }>>([])
const showSuggestions = ref(false)

const activeEngine = computed(() => engines.find((e) => e.key === currentEngine.value)!)

const switchEngine = (engine: SearchEngine) => {
  currentEngine.value = engine
}

const handleSearch = () => {
  if (!query.value.trim()) return
  emit('search', query.value.trim(), currentEngine.value)
  const engine = activeEngine.value
  const encodedQuery = encodeURIComponent(query.value.trim())
  const searchUrl = `${engine.url}?wd=${encodedQuery}`
  window.open(searchUrl, '_blank')
  showSuggestions.value = false
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleSearch()
  }
}

// 监听输入，获取自动完成建议（模拟）
watch(query, async (newVal) => {
  if (!newVal.trim()) {
    suggestions.value = []
    showSuggestions.value = false
    return
  }

  // 根据当前引擎获取建议
  try {
    let results: Array<{ text: string; type: string }> = []

    if (currentEngine.value === 'baidu') {
      // 百度自动完成
      const response = await fetch(
        `https://www.baidu.com/sugrec?json=1&prod=pc&wd=${encodeURIComponent(newVal)}`
      )
      const data = await response.json()
      if (data.g) {
        results = data.g.map((item: { q: string }) => ({ text: item.q, type: 'baidu' }))
      }
    } else if (currentEngine.value === 'bing') {
      const response = await fetch(
        `https://api.bing.com/osjson.aspx?query=${encodeURIComponent(newVal)}`
      )
      const data = await response.json()
      if (data[1]) {
        results = (data[1] as string[]).map((text) => ({ text, type: 'bing' }))
      }
    } else if (currentEngine.value === 'bilibili') {
      const response = await fetch(
        `https://s.search.bilibili.com/main/suggest?term=${encodeURIComponent(newVal)}`
      )
      const data = await response.json()
      if (data.result?.tag) {
        results = (data.result.tag as string[]).map((text) => ({ text, type: 'bilibili' }))
      }
    }

    suggestions.value = results.slice(0, 6)
    showSuggestions.value = results.length > 0
  } catch {
    suggestions.value = []
    showSuggestions.value = false
  }
})

const selectSuggestion = (text: string) => {
  query.value = text
  handleSearch()
}

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.search-bar-container')) {
    showSuggestions.value = false
  }
}

defineExpose({
  focus: () => {
    const input = document.querySelector('.search-input') as HTMLInputElement
    if (input) input.focus()
  }
})

import { onMounted, onUnmounted } from 'vue'
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div class="search-bar-container">
    <div class="engine-tabs">
      <button
        v-for="engine in engines"
        :key="engine.key"
        :class="['engine-tab', { active: currentEngine === engine.key }]"
        @click="switchEngine(engine.key)"
      >
        {{ engine.name }}
      </button>
    </div>

    <div class="search-input-wrapper">
      <SearchIcon class="search-icon" size="20px" />
      <input
        v-model="query"
        type="text"
        class="search-input"
        :placeholder="activeEngine.placeholder"
        @keydown="handleKeyDown"
      />
      <button class="search-btn" @click="handleSearch">搜索</button>
    </div>

    <!-- 自动完成建议 -->
    <transition name="fade">
      <div v-if="showSuggestions && suggestions.length > 0" class="suggestions-dropdown">
        <div
          v-for="(item, index) in suggestions"
          :key="index"
          class="suggestion-item"
          @click="selectSuggestion(item.text)"
        >
          <span class="suggestion-text">{{ item.text }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="less" scoped>
.search-bar-container {
  position: relative;
  max-width: 640px;
  margin: 0 auto;
  padding: 0 16px 24px;
}

.engine-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.engine-tab {
  padding: 4px 16px;
  border: none;
  border-radius: var(--fluent-radius-smooth);
  background: transparent;
  color: var(--td-text-color-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all var(--fluent-transition-fast);

  &:hover {
    background: var(--fluent-item-hover);
    color: var(--td-text-color-primary);
  }

  &.active {
    background: var(--fluent-accent-color);
    color: #ffffff;
  }
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--fluent-acrylic-bg);
  backdrop-filter: var(--fluent-acrylic-blur);
  border: 1px solid var(--fluent-border-subtle);
  border-radius: var(--fluent-radius-large);
  box-shadow: var(--fluent-card-shadow);
  transition: all var(--fluent-transition-normal);

  &:focus-within {
    border-color: var(--fluent-accent-color);
    box-shadow: var(--fluent-focus-ring);
  }
}

.search-icon {
  color: var(--td-text-color-placeholder);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 15px;
  color: var(--td-text-color-primary);
  outline: none;

  &::placeholder {
    color: var(--td-text-color-placeholder);
  }
}

.search-btn {
  padding: 6px 20px;
  border: none;
  border-radius: var(--fluent-radius-smooth);
  background: var(--fluent-accent-color);
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  transition: all var(--fluent-transition-fast);
  white-space: nowrap;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.97);
  }
}

.suggestions-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 16px;
  right: 16px;
  max-width: 608px;
  margin: 0 auto;
  background: var(--fluent-acrylic-bg);
  backdrop-filter: var(--fluent-acrylic-blur);
  border: 1px solid var(--fluent-border-subtle);
  border-radius: var(--fluent-radius-card);
  box-shadow: var(--fluent-elevation-3);
  z-index: 100;
  overflow: hidden;
}

.suggestion-item {
  padding: 10px 16px;
  cursor: pointer;
  transition: background var(--fluent-transition-fast);

  &:hover {
    background: var(--fluent-item-hover);
  }

  &:active {
    background: var(--fluent-item-active);
  }
}

.suggestion-text {
  font-size: 14px;
  color: var(--td-text-color-primary);
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
