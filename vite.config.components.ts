import type { PluginOption } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

export default (): PluginOption[] => ([
    /**
     * 按需自动导入API
     * @see https://github.com/antfu/unplugin-auto-import#readme
     */
    AutoImport({
        eslintrc: {
            enabled: true,
        },
        include: [
            /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
            /\.vue$/,
            /\.vue\?vue/, // .vue
            /\.md$/, // .md
        ],
        imports: [
            'vue',
            'vue-router',
            '@vueuse/core',
            {
                '@lincy/utils': ['deepClone', 'deepMerge', 'deepEqual'],
                'pinia': ['defineStore', 'storeToRefs'],
                'vue-router': ['createRouter', 'createWebHashHistory'],
                '@unhead/vue': ['createHead', 'useHead'],
                '@vueuse/router': ['useRouteHash', 'useRouteParams', 'useRouteQuery'],
            },
        ],
        dts: 'src/auto-imports.d.ts',
        dirs: ['src/components', 'src/composables', 'src/stores'],

        resolvers: [
            ElementPlusResolver(),
        ],
        defaultExportByFilename: false,
        vueTemplate: true,
    }),
    /**
     * 按需自动导入Vue组件
     * @see https://github.com/antfu/unplugin-vue-components#readme
     */
    Components({
        include: [
            /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
            /\.vue$/,
            /\.vue\?vue/, // .vue
            /\.md$/, // .md
        ],
        extensions: ['vue', 'tsx', 'jsx'],
        resolvers: [
            ElementPlusResolver(),
        ],
        dts: 'src/components.d.ts',
        directoryAsNamespace: true,
    }),
    /**
     * 按需访问数千个图标作为组件
     * @see https://github.com/antfu/unplugin-icons#readme
     * @example <i-mdi-account-box style="font-size: 2em; color: red"/>
     */
    Icons({
        autoInstall: true,
    }),
])
