import type { FetchOptions } from 'ofetch'
import type { LoadedType } from '~/types/global'
import { ofetch } from 'ofetch'
import { normalizeCookiePath } from '~/utils'

function objToStr(cookies: Record<string, string | number | boolean>) {
    if (!cookies) {
        return ''
    }
    let cookie = ''
    Object.keys(cookies).forEach((item) => {
        cookie += `${item}=${cookies[item]}; `
    })
    return cookie
}

/**
 * ofetch Api 封装
 * ```
    get<T>(url: string, params?: Objable, header?: Objable, checkCode?: boolean): Promise<ResponseData<T>>
    post<T>(url: string, data?: Objable, header?: Objable, checkCode?: boolean): Promise<ResponseData<T>>
    put<T>(url: string, data?: Objable, header?: Objable, checkCode?: boolean): Promise<ResponseData<T>>
    delete<T>(url: string, data?: Objable, header?: Objable, checkCode?: boolean): Promise<ResponseData<T>>
 * ```
 */
export const useApi: (cookies?: Objable) => ApiType = (cookies) => {
    const apiFetch = ofetch.create({
        baseURL: `${import.meta.env.VITE_APP_API}`,
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            // 处理 cookies
            'Cookie': cookies ? normalizeCookiePath(objToStr(cookies)) : '',
        },
    })

    return {
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
        async RESTful(url, method = 'get', data, options) {
            const response = await apiFetch(url, {
                method,
                query: method === 'get' ? data : undefined,
                body: method === 'get' ? undefined : data,
                timeout: 3000, // Timeout after 3 seconds
                onRequestError({ error }) {
                    ElMessage.closeAll()
                    error && ElMessage.error('Sorry, The Data Request Failed')
                },
                onResponse({ response }) {
                    if (response._data.code !== 200) {
                        ElMessage.error(response._data.message)
                        return response._data = null
                    }
                    return response._data = response._data || 'success'
                },
                onResponseError({ response }) {
                    // Log error
                    console.log('[fetch response error]', response.status)
                },
                ...options,

            })
            return response
        },
    }
}
if (typeof window !== 'undefined') {
    window.$$api = useApi()
}
export const $api = useApi()

/**
 * 依赖的父级数据加载完成 或者 当前组件已经 mounted
 * @example
 * ```
 * 不依赖数据
 * useFetchData({ initFn: () => {} })
 * 依赖数据 watchData
 * useFetchData({ watchData, dataHasError, init, initError })
 * ```
 */
export function useFetchData<T, E>(payload: LoadedType<T, E>) {
    const ins = getCurrentInstance()!
    const options = ins.type

    const log = (text: string, color = 'blue') => {
        const formatted = useDateFormat(useNow(), 'YYYY-MM-DD HH:mm:ss')
        console.log(`%c[${options.name}]  >> `, `color: ${color}`, `${text} <<-- (${formatted.value})`)
    }

    const { watchData, dataHasError, initFn, errorFn, immediate } = payload

    if (import.meta.env.SSR) {
        initFn && initFn()
        return {
            loading: false,
        }
    }

    const [loading, toggleLoading] = useToggle(false)

    if (typeof watchData === 'undefined') {
        if (typeof initFn === 'function') {
            onMounted(async () => {
                const { stop } = useTimeoutFn(() => toggleLoading(true), 300)
                log('未发现监听数据, 直接执行初始化函数')
                await (initFn && initFn())
                stop()
                toggleLoading(false)
            })
        }
        if (typeof dataHasError === 'undefined') {
            return {
                scope: () => {},
                loading: false,
            }
        }
    }

    const scope = effectScope()

    scope.run(() => {
        log('监听开始')
        watch(
            resolveRef(watchData),
            async (val, oldVal) => {
                const { stop } = useTimeoutFn(() => toggleLoading(true), 300)
                log('监听数据发生变化, 执行初始化函数')
                log(`旧值: ${JSON.stringify(oldVal)}`)
                log(`新值: ${JSON.stringify(val)}`)
                await (initFn && initFn('change-data'))
                stop()
                toggleLoading(false)
            },
            {
                deep: true,
                immediate: immediate ?? false,
            },
        )
        watch(
            resolveRef(dataHasError),
            async () => {
                const { stop } = useTimeoutFn(() => toggleLoading(true), 300)
                log('数据加载失败, 执行错误函数')
                await (errorFn && errorFn())
                stop()
                toggleLoading(false)
            },
        )
    })

    // onMounted(async () => {
    //     if (resolveUnref(watchData)) {
    //         const { stop } = useTimeoutFn(() => toggleLoading(true), 300)
    //         log('发现监听数据, 执行初始化函数')
    //         await (initFn && initFn())
    //         stop()
    //         toggleLoading(false)
    //     }
    //     else {
    //         log('未发现监听数据, 跳过初始化函数')
    //     }
    // })

    onBeforeUnmount(() => {
        scope.stop()
        log('停止监听')
    })

    return {
        scope,
        loading,
    }
}
