import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { TDesignResolver } from '@tdesign-vue-next/auto-import-resolver'
import UnoCSS from 'unocss/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

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
      UnoCSS(),
      typeof monacoEditorPlugin === 'function'
        ? monacoEditorPlugin({})
        : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          monacoEditorPlugin.default({})
    ],
    build: {
      rollupOptions: {
        input: {
          index: resolve('src/renderer/index.html'),
          plugin: resolve('src/renderer/plugin.html'),
          setting: resolve('src/renderer/setting.html'),
          add: resolve('src/renderer/add.html'),
          ball: resolve('src/renderer/ball.html')
        }
      }
    }
  }
})
