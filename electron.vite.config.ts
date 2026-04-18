import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { TDesignResolver } from '@tdesign-vue-next/auto-import-resolver'
import UnoCSS from 'unocss/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  main: {
    resolve: {
      alias: {
        $: resolve('src/main'),
        '@common': resolve('src/common')
      }
    }
  },
  preload: {
    resolve: {
      alias: {
        '~': resolve('src/preload'),
        '@common': resolve('src/common')
      }
    },
    build: {
      rollupOptions: {
        input: {
          index: 'src/preload/index.ts',
          plugin: 'src/preload/plugin.ts'
        }
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@': resolve('src/renderer/src'),
        '@common': resolve('src/common')
      }
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            // 方式一：使用正则表达式匹配（推荐）
            // 将所有以 my- 开头的标签视为自定义元素
            // isCustomElement: (tag) => tag.startsWith('my-')

            // 方式二：指定具体的标签名
            isCustomElement: (tag) => ['webview'].includes(tag)
          }
        }
      }),
      vueJsx(),
      // ...
      AutoImport({
        resolvers: [
          TDesignResolver({
            library: 'vue-next'
          })
        ],
        imports: ['vue', '@vueuse/core', 'vue-router'],
        eslintrc: {
          enabled: true
        }
      }),
      Components({
        resolvers: [
          TDesignResolver({
            library: 'vue-next'
          })
        ]
      }),
      UnoCSS()
    ],
    build: {
      rollupOptions: {
        input: {
          main: resolve('src/renderer/index.html'),
          plugin: resolve('src/renderer/plugin.html'),
          quick: resolve('src/renderer/quick.html')
        }
      }
    }
  }
})
