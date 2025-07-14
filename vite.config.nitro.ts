import type { PluginOption } from 'vite'
import path from 'node:path'

import process from 'node:process'
import { fileURLToPath } from 'node:url'
import nitro from '@analogjs/vite-plugin-nitro'
import vue from '@vitejs/plugin-vue'

export default (isSsrBuild?: boolean): PluginOption[] => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const proxyDomain = process.env.NITRO_ENV_HOST_API_URL || 'https://php.mmxiaowu.com'

    const plugins: PluginOption[] = []

    if (!isSsrBuild)
        plugins.push(vue())

    plugins.push(nitro({
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
    }))

    return plugins
}
