import type { IncomingMessage, ServerResponse } from 'node:http'
import type { CusRouteComponent } from './types/global.types'
import { basename } from 'node:path'

import { createHead, renderSSRHead } from '@unhead/vue/server'
import { createEvent, parseCookies, sendRedirect } from 'h3'
import { renderToString } from 'vue/server-renderer'
import { createApp } from './app'
import { resetSSRInstanceProperties } from './composables/asyncData'

import { useApi } from './composables/fetch'
import { needSSR } from './config'

function replaceHtmlTag(html: string): string {
    return html.replace(/<script(.*?)>/gi, '&lt;script$1&gt;').replace(/<\/script>/g, '&lt;/script&gt;')
}

export default async function render(url: string, template: string, context: { req: IncomingMessage, res: ServerResponse }) {
    if (!needSSR) {
        return template.replace('<!--app-html-->', '').replace('<!--head-tags-->', '').replace('<!--app-teleports-->', '')
    }

    if (url.startsWith('/.well-known') || url.startsWith('/sm/')) {
        return ''
    }
    const H3Event = createEvent(context?.req, context?.res)
    const cookies = parseCookies(H3Event)

    const { app, router, store } = createApp()

    resetSSRInstanceProperties(app)

    const head = createHead()
    app.use(head)

    if (cookies.token && url.includes('/login')) {
        return sendRedirect(H3Event, '/')
    }
    if (!cookies.token && !url.includes('/login')) {
        return sendRedirect(H3Event, '/login')
    }

    const api = useApi(cookies, H3Event)

    console.log('%c[url] >> ', 'color: red', url)
    await router.push(url)
    await router.isReady()
    console.log('server router ready')

    if (router.currentRoute.value.matched.length === 0) {
        return '404 Not Found'
    }

    const matchedComponents = router.currentRoute.value.matched.flatMap((record) => {
        return Object.values(record.components as Record<string, CusRouteComponent>)
    })

    const globalStore = useGlobalStore(store)
    const productStore = useProductStore(store)
    globalStore.setCookies(cookies)
    await productStore.getCategory(api)

    console.log('%c[matchedComponents] >> ', 'color: red', matchedComponents.map(item => item.name))

    try {
        await Promise.all(
            matchedComponents.map((component) => {
                if (component.asyncData) {
                    return component.asyncData({
                        store,
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

    const ctx: { modules?: any, teleports?: any } = {}
    let content = await renderToString(app, ctx)

    const preloadLinks = renderPreloadLinks(ctx.modules, {})
    const teleports = renderTeleports(ctx.teleports)
    const { headTags } = await renderSSRHead(head)

    content += `<script>window.__initialState__ = ${replaceHtmlTag(JSON.stringify(app.config.globalProperties.initialState))}</script>`
    content += `<script>window.__globalState__ = ${replaceHtmlTag(JSON.stringify(app.config.globalProperties.globalState))}</script>`
    content += `<script>window.__piniaState__ = ${replaceHtmlTag(JSON.stringify(piniaInit.state.value))}</script>`

    const html = template
        .replace(`<!--preload-links-->`, preloadLinks)
        .replace('<!--app-html-->', content)
        .replace('<!--head-tags-->', headTags)
        .replace(/(\n|\r\n)\s*<!--app-teleports-->/, teleports)

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

function renderTeleports(teleports) {
    if (!teleports)
        return ''
    return Object.entries(teleports).reduce((all, [key, value]) => {
        if (key.startsWith('#el-popper-container-')) {
            return `${all}<div id="${key.slice(1)}">${value}</div>`
        }
        return all
    }, teleports.body || '')
}
