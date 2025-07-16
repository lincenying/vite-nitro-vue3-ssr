import type { IncomingMessage, ServerResponse } from 'node:http'
import type { CusRouteComponent } from './types/global.types'
import { basename } from 'node:path'

import { createHead, renderSSRHead } from '@unhead/vue/server'
import { ID_INJECTION_KEY, ZINDEX_INJECTION_KEY } from 'element-plus'
import { createEvent, parseCookies, sendRedirect } from 'h3'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import App from './App.vue'
import { useApi } from './composables/fetch'
import router from './router'

function replaceHtmlTag(html: string): string {
    return html.replace(/<script(.*?)>/gi, '&lt;script$1&gt;').replace(/<\/script>/g, '&lt;/script&gt;')
}

export default async function render(url: string, template: string, context: { req: IncomingMessage, res: ServerResponse }) {
    if (url.startsWith('/.well-known') || url.startsWith('/sm/')) {
        return ''
    }
    const H3Event = createEvent(context?.req, context?.res)
    const cookies = parseCookies(H3Event)

    const app = createSSRApp(App)
    app.provide(ZINDEX_INJECTION_KEY, { current: 0 })
    app.provide(ID_INJECTION_KEY, {
        prefix: Math.floor(Math.random() * 10000),
        current: 0,
    })

    const head = createHead()

    if (cookies.token && url.includes('/login')) {
        return sendRedirect(H3Event, '/')
    }
    if (!cookies.token && !url.includes('/login')) {
        return sendRedirect(H3Event, '/login')
    }

    const api = useApi(cookies, H3Event)

    setupPinia(app).use(head).use(router)

    console.log('%c[url] >> ', 'color: red', url)
    await router.push(url)
    await router.isReady()
    console.log('server router ready')

    if (router.currentRoute.value.matched.length === 0) {
        // context.throw(404, "Not Found");
    }

    const matchedComponents = router.currentRoute.value.matched.flatMap((record) => {
        return Object.values(record.components as Record<string, CusRouteComponent>)
    })

    const globalStore = useGlobalStore(piniaInit)
    const productStore = useProductStore(piniaInit)
    globalStore.setCookies(cookies)
    await productStore.getCategory(api)

    console.log('%c[matchedComponents] >> ', 'color: red', matchedComponents.map(item => item.name))

    try {
        await Promise.all(
            matchedComponents.map((component) => {
                if (component.asyncData) {
                    return component.asyncData({
                        store: piniaInit,
                        route: router.currentRoute.value,
                        req: context.req,
                        api,
                    })
                }
                return null
            }).filter(Boolean),
        )
    }
    catch (error) {
        console.log(error)
    }

    const ctx: { modules?: any } = {}
    let content = await renderToString(app, ctx)
    const preloadLinks = renderPreloadLinks(ctx.modules, {})
    const { headTags } = await renderSSRHead(head)

    content += `<script>window.__INITIAL_STATE__ = ${replaceHtmlTag(JSON.stringify(piniaInit.state.value))}</script>`

    const html = template
        .replace(`<!--preload-links-->`, preloadLinks)
        .replace('<!--app-html-->', content)
        .replace('<!--head-tags-->', headTags)

    return html
}

function renderPreloadLinks(modules: any[] = [], manifest: any) {
    let links = ''
    const seen = new Set()
    modules.forEach((id) => {
        const files = manifest[id]
        if (files) {
            files.forEach((file: string) => {
                if (!seen.has(file)) {
                    seen.add(file)
                    const filename = basename(file)
                    if (manifest[filename]) {
                        for (const depFile of manifest[filename]) {
                            links += renderPreloadLink(depFile)
                            seen.add(depFile)
                        }
                    }
                    links += renderPreloadLink(file)
                }
            })
        }
    })
    return links
}

function renderPreloadLink(file: string) {
    if (file.endsWith('.js')) {
        return `<link rel="modulepreload" crossorigin href="${file}">`
    }
    else if (file.endsWith('.css')) {
        return `<link rel="stylesheet" href="${file}">`
    }
    else if (file.endsWith('.woff')) {
        return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
    }
    else if (file.endsWith('.woff2')) {
        return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
    }
    else if (file.endsWith('.gif')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/gif">`
    }
    else if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`
    }
    else if (file.endsWith('.png')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/png">`
    }
    else {
    // TODO
        return ''
    }
}
