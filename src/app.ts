import type { App } from 'vue'

import { ID_INJECTION_KEY, ZINDEX_INJECTION_KEY } from 'element-plus'
import { createApp as createPWAApp, createSSRApp } from 'vue'

import Main from './App.vue'
import { needSSR } from './config'
import router from './router'

console.log(`当前环境: ${import.meta.env.VITE_APP_ENV}`)

// SSR 要求每个请求都有一个新的应用程序实例，
// 因此我们导出一个创建新应用程序实例的函数。
export function createApp() {
    let app: App<Element>

    if (needSSR) {
        app = createSSRApp(Main)
    }
    else {
        app = createPWAApp(Main)
    }

    app.provide(ZINDEX_INJECTION_KEY, { current: 0 })
    app.provide(ID_INJECTION_KEY, {
        prefix: 2048,
        current: 0,
    })

    setupPinia(app).use(router)

    return { app, router, store: piniaInit }
}
