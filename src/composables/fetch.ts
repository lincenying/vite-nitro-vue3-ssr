import type { FetchOptions } from 'ofetch'
import type { ServiceType } from '~/types/fetch.types'
import { isFormData, objToCookies } from '@lincy/utils'
import { appendResponseHeader, type H3Event } from 'h3'
import { ofetch } from 'ofetch'
import qs from 'qs'
import { normalizeCookiePath } from '~/utils'

const pendingRequest = new Map<string, AbortController>()
/**
 * ofetch Api 封装
 * ```
    get<T>(url: string, params?: Objable, header?: Objable, checkCode?: boolean): Promise<ResponseData<T>>
    post<T>(url: string, data?: Objable, header?: Objable, checkCode?: boolean): Promise<ResponseData<T>>
    put<T>(url: string, data?: Objable, header?: Objable, checkCode?: boolean): Promise<ResponseData<T>>
    delete<T>(url: string, data?: Objable, header?: Objable, checkCode?: boolean): Promise<ResponseData<T>>
 * ```
 */
export const useApi: (cookies?: Record<string, string | number | boolean>, H3Event?: H3Event, needSignal?: boolean) => ApiType = (cookies, H3Event, needSignal = false) => {
    const apiFetch = ofetch.create({
        baseURL,
        credentials: cookies ? undefined : 'include',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Cookie': (cookies && objToCookies(cookies)) || '',
        },
    })

    return {
        /** 取消请求的Key */
        abortKey: '',
        getAbourtKey() {
            return this.abortKey
        },
        /** 生成request的唯一的标识 */
        generateRequestKey(config: ServiceType) {
            // 通过url，method，data生成唯一key
            const { url, method, data } = config
            return [url, method, qs.stringify(data), Date.now()].join('&')
        },

        /** 取消请求 */
        abortRequest(abortKey?: string) {
            abortKey = abortKey || this.abortKey
            if (pendingRequest.has(abortKey)) {
                const controller = pendingRequest.get(abortKey)
                controller?.abort('取消请求') // 触发取消请求
                pendingRequest.delete(abortKey) // 删除cancelKey
            }
        },
        post(url: string, data?: Objable, options?: FetchOptions) {
            return this.RESTful(url, 'post', data, options)
        },
        get(url: string, data?: Objable, options?: FetchOptions) {
            return this.RESTful(url, 'get', data, options)
        },
        put(url: string, data?: Objable, options?: FetchOptions) {
            return this.RESTful(url, 'put', data, options)
        },
        delete(url: string, data?: Objable, options?: FetchOptions) {
            return this.RESTful(url, 'delete', data, options)
        },
        async RESTful(url, method = 'get', data, options?: FetchOptions) {
            return await this.fetch(url, method, data, options)
        },
        async fetch(url, method, data, options?: FetchOptions) {
            if (import.meta.env.VITE_APP_ENV === 'development') {
                console.debug('[request]', baseURL + url, data || {})
            }
            let signal: AbortSignal | undefined
            if (needSignal) {
                this.abortKey = this.generateRequestKey({ url, method, data })
                const controller = new AbortController()
                signal = controller.signal

                pendingRequest.set(this.abortKey, controller)
            }

            const isDevSSR = isSSR && import.meta.env.VITE_APP_ENV === 'development'
            const response = await apiFetch(url, {
                method,
                query: method === 'get' ? data : undefined,
                body: method === 'get' ? undefined : data,
                timeout: 10000, // Timeout after 10 seconds
                // 开发环境 SSR 可能在 Nitro 环境尚未就绪时请求 API，对 503 自动重试
                retry: isDevSSR ? 5 : 0,
                retryDelay: 200,
                retryStatusCodes: [503],
                signal,
                ...options,
                headers: {
                    ...options?.headers,
                    ...isFormData(data) ? { } : { 'Content-Type': 'application/json' },
                },
                onRequestError({ error }) {
                    if (!isSSR) {
                        ElMessage.closeAll()
                        error && ElMessage.error('Sorry, The Data Request Failed')
                    }
                    if (import.meta.env.VITE_APP_ENV === 'development') {
                        console.debug('[fetch request error]', error)
                    }
                },
                onResponse({ response }) {
                    const setCookies = response.headers.getSetCookie()
                    if (H3Event && setCookies && setCookies.length > 0) {
                        for (const cookie of setCookies) {
                            appendResponseHeader(H3Event, 'set-cookie', normalizeCookiePath(cookie))
                        }
                    }
                    if (response._data?.code !== 200) {
                        if (!isSSR)
                            ElMessage.error(response._data?.message || '请求失败')
                        response._data = {
                            code: response._data?.code ?? 500,
                            message: response._data?.message ?? '请求失败',
                            data: null,
                        }
                        return response._data
                    }
                    return response._data
                },
                onResponseError({ response }) {
                    if (import.meta.env.VITE_APP_ENV === 'development') {
                        console.debug('[fetch response error]', response.status)
                    }
                },
            })
            return response
        },
    }
}
if (typeof window !== 'undefined') {
    window.$$api = useApi()
}
export const $api = useApi()
export const $fetch = useApi(undefined, undefined, true)
