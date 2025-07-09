import path from 'node:path'
import process from 'node:process'

import { fileURLToPath } from 'node:url'

import nitro from '@analogjs/vite-plugin-nitro'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig, loadEnv } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Progress from 'vite-plugin-progress'

import Build from './vite.config.build'
import Components from './vite.config.components'
import Css from './vite.config.css'
import Macros from './vite.config.macros'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild, mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    console.log(`当前编译环境: ${process.env.VITE_APP_ENV}`)

    const proxyDomain = process.env.NITRO_ENV_HOST_API_URL || 'https://php.mmxiaowu.com'

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
            },
        },
        ssr: {
            noExternal: [
                'element-plus',
            ],
        },
        plugins: [
            isSsrBuild ? [] : vue(),
            ...Macros(),
            nitro({
                ssr: true,
                static: false,
                prerender: {
                    routes: [],
                },
                entryServer: `${__dirname}/src/main.server.ts`,
            }, {
                srcDir: 'server',
                serveStatic: true,
                output: {
                    dir: '.output',
                    publicDir: '.output/public',
                },
                routeRules: {
                    '/php/**': {
                        proxy: {
                            to: `${proxyDomain}/api/**`,
                        },
                        swr: false,
                    },
                },
                storage: {
                    fsdb: {
                        driver: 'fs',
                        // 相对项目根目录
                        base: './.data/fsdb',
                    },
                },
                // 开启sqlite数据库存储
                experimental: {
                    database: true,
                },
                database: {
                    // 配置SQLite数据库
                    default: {
                        connector: 'sqlite',
                        options: {
                            // 相对项目根目录
                            path: './.data/db.sqlite',
                            name: 'db',
                        },
                    },
                    sqlite3: {
                        connector: 'better-sqlite3',
                        options: {
                            // 相对项目根目录
                            path: './.data/db.sqlite3',
                            name: 'db',
                        },
                    },
                },
            }),
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
