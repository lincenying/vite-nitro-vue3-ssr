import type { FetchOptions } from 'ofetch'
import { ofetch } from 'ofetch'

/**
 * ofetch Api 封装
 * ```
    get<T>(url: string, params?: Objable, header?: Objable, checkCode?: boolean): Promise<ResponseData<T>>
    post<T>(url: string, data?: Objable, header?: Objable, checkCode?: boolean): Promise<ResponseData<T>>
    put<T>(url: string, data?: Objable, header?: Objable, checkCode?: boolean): Promise<ResponseData<T>>
    delete<T>(url: string, data?: Objable, header?: Objable, checkCode?: boolean): Promise<ResponseData<T>>
 * ```
 */
export const useApi: (cookies?: string) => ApiType = (cookies) => {
    const apiFetch = ofetch.create({
        baseURL: `${import.meta.env.VITE_APP_API}`,
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Cookie': cookies || '',
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
        async RESTful(url, method = 'get', data, options?: FetchOptions) {
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
