import path from 'node:path'
import process from 'node:process'

import { fileURLToPath } from 'node:url'

import UnoCSS from 'unocss/vite'
import { defineConfig, loadEnv } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Progress from 'vite-plugin-progress'

import Build from './vite.config.build'
import Components from './vite.config.components'
import Css from './vite.config.css'
import Macros from './vite.config.macros'
import Nitro from './vite.config.nitro'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild, mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    console.log(`当前编译环境: ${process.env.VITE_APP_ENV}`)

    return {
        assetsInclude: [
            '/static/**',
        ],
        server: {
            open: true,
            port: 5273,
            hmr: {
                port: 55273,
            },
            warmup: {
                clientFiles: ['./src/main.ts', './src/views/*.vue'],
            },
        },
        build: Build.build,
        css: Css,
        resolve: {
            mainFields: ['module'],
            alias: {
                '~': path.join(__dirname, './src'),
                '@': path.join(__dirname, './src'),
                '~server': path.join(__dirname, './server'),
                '@server': path.join(__dirname, './server'),
            },
        },
        ssr: {
            noExternal: [
                'element-plus',
                '@tato30/vue-pdf', 'pdfjs-dist',
            ],
        },
        plugins: [
            ...Nitro(isSsrBuild),
            ...Macros(),
            ...Components(),
            UnoCSS(),
            /**
             * 检查Vite插件的中间状态
             * @see https://github.com/antfu/vite-plugin-inspect#readme
             */
            Inspect(),
            /**
             * 打包时展示进度条的插件
             * @see https://github.com/jeddygong/vite-plugin-progress/blob/main/README.zh-CN.md
             */
            Progress(),
        ],
    }
})
