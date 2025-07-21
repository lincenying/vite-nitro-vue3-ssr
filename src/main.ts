import type { CusRouteComponent } from './types/global.types'

import { createHead } from '@unhead/vue/client'
import ls from 'store2'

import globalPlugin from '@/plugin/global'

import { createApp } from './app'
import { getContext, setClientInstanceProperties } from './composables/asyncData'

//                            _ooOoo_
//                           o8888888o
//                           88" . "88
//                           (| -_- |)
//                            O\ = /O
//                        ____/`---'\____
//                      .   ' \\| |// `.
//                       / \\||| : |||// \
//                     / _||||| -:- |||||- \
//                       | | \\\ - /// | |
//                     | \_| ''\---/'' | |
//                      \ .-\__ `-` ___/-. /
//                   ___`. .' /--.--\ `. . __
//                ."" '< `.___\_<|>_/___.' >'"".
//               | | : `- \`.;`\ _ /`;.`/ - ` : | |
//                 \ \ `-. \_ __\ /__ _/ .-` / /
//         ======`-.____`-.___\_____/___.-`____.-'======
//                            `=---='
//
//         .............................................
//                  佛祖镇楼                  BUG辟易
//          佛曰:
//                  写字楼里写字间，写字间里程序员；
//                  程序人员写程序，又拿程序换酒钱。
//                  酒醒只在网上坐，酒醉还来网下眠；
//                  酒醉酒醒日复日，网上网下年复年。
//                  但愿老死电脑间，不愿鞠躬老板前；
//                  奔驰宝马贵者趣，公交自行程序员。
//                  别人笑我忒疯癫，我笑自己命太贱；
//                  不见满街漂亮妹，哪个归得程序员？

// import 'default-passive-events'

import '@/polyfill/toFixed'
import 'uno.css'
import 'md-editor-v3/lib/style.css'
import './assets/icon-font/icon-font.css'
import './assets/scss/global/animate.min.css'
import './assets/scss/global/global.scss'
import './assets/scss/style.scss'

console.log(`VITE_APP_ENV: ${import.meta.env.VITE_APP_ENV}`)

const { app, router, store } = createApp()

const head = createHead()

const context = getContext()

setClientInstanceProperties(app, context)

router.isReady().then(() => {
    router.beforeResolve(async (to, from) => {
        const token = ls.get('token')
        if (!token && to.path !== '/login') {
            return { path: '/login' }
        }
        if (token && to.path === '/login') {
            return { path: '/' }
        }

        let diffed = false
        const activated = to.matched.filter((c, i) => {
            return diffed || (diffed = from.matched[i] !== c) || from.path !== to.path
        })

        if (!activated.length && to.fullPath === from.fullPath) {
            return false
        }

        await Promise.all(
            activated.map((c) => {
                const routeComponent = c.components?.default as CusRouteComponent
                if (routeComponent.asyncData) {
                    return routeComponent.asyncData({
                        store,
                        route: to,
                        api: $api,
                    })
                }

                return true
            }),
        )
    })

    app.use(head).use(globalPlugin).mount('#app')
    console.log('client router ready')
})
