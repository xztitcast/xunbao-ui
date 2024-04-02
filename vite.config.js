import { resolve } from "path";
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from "vite-plugin-html";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig((mode) => {
  return {
    plugins: [
      vue(),
      createHtmlPlugin({
        inject: {
          data: {
            apiURL: loadEnv(mode, process.cwd()).VITE_APP_API,
            title: ""
          }
        },
        minify: true
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver({importStyle: "sass"})],
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        // eslint-disable-next-line no-undef
        iconDirs: [resolve(process.cwd(), 'src/assets/icons/svg')],
        // 指定 symbolId 的格式
        symbolId: 'icon-[dir]-[name]'
      })
    ],
    define: {
      // 启用生产环境构建下激活不匹配的详细警告
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
    },
    build: {
      chunkSizeWarningLimit: 1024,
      commonjsOptions: {
        include: /node_modules|lib/
      },
      rollupOptions: {
        output: {
          manualChunks: {
            quill: ["quill"],
            lodash: ["lodash"],
            vlib: ["vue", "vue-router", "element-plus"]
          }
        }
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    server: {
      open: false, // 自动启动浏览器
      host: "0.0.0.0", // localhost
      port: 8001, // 端口号
      https: false,
      hmr: { overlay: false },
      proxy: {
        '/sys': {
          target: 'http://localhost:8080',
          changeOrigin: true
        }
      }
    }
  }
})
