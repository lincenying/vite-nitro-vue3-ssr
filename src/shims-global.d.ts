/**
 * Null 或者 Undefined 或者 T
 */
declare type Nullable<T> = T | null | undefined
/**
 * 非 Null 类型
 */
declare type NonNullable<T> = T extends null | undefined ? never : T
/**
 * 数组<T> 或者 T
 */
declare type Arrayable<T> = T | T[]
/**
 * 键为字符串, 值为 Any 的对象
 */
declare type Objable<T = any> = Record<string, T>
/**
 * Function
 */
declare type Fn<T = void> = () => T
/**
 * 任意函数
 */
declare type AnyFn<T = any> = (...args: any[]) => T
/**
 * Promise, or maybe not
 */
declare type Awaitable<T> = T | PromiseLike<T>

/** 根据指定的键将对象的部分属性变为可选 */
type PartialByKeys<T, K extends keyof T> = {
    [P in Exclude<keyof T, K>]-?: T[P];
} & {
    [P in K]?: T[P];
}

/**
 * 接口返回模板
 * ```
 * {
    data: T
    code: number
    message: string
    info?: string
 * }
 * ```
 */
declare interface ResponseData<T> {
    data: T
    code: number
    message: string
    info?: string
    [propName: string]: any
}

type Methods = 'get' | 'post' | 'delete' | 'put'

type FetchOptions = import('ofetch').FetchOptions

declare interface ApiType {
    get: <T>(url: string, data?: Objable, options?: FetchOptions) => Promise<ResponseData<T>>
    get: <T, U = Objable>(url: string, data?: Objable, options?: FetchOptions) => Promise<ResponseData<T> & U>
    post: <T>(url: string, data?: Objable, options?: FetchOptions) => Promise<ResponseData<T>>
    post: <T, U = Objable>(url: string, data?: Objable, options?: FetchOptions) => Promise<ResponseData<T> & U>
    put: <T>(url: string, data?: Objable, options?: FetchOptions) => Promise<ResponseData<T>>
    put: <T, U = Objable>(url: string, data?: Objable, options?: FetchOptions) => Promise<ResponseData<T> & U>
    delete: <T>(url: string, data?: Objable, options?: FetchOptions) => Promise<ResponseData<T>>
    delete: <T, U = Objable>(url: string, data?: Objable, options?: FetchOptions) => Promise<ResponseData<T> & U>
    RESTful: <T>(url: string, method: Methods, data?: Objable, options?: FetchOptions) => Promise<ResponseData<T>>
}

declare interface Window {
    config: {
        timer: Objable<number>
    }
    $$lock?: boolean
    $$api: ApiType
    $$time: NodeJS.Timeout
    __initialState__: Record<string, any>
    __globalState__: Record<string, any>
    __piniaState__: Record<string, any>
}

declare interface ImportMeta {
    env: {
        NODE_ENV: 'development' | 'production'
        VITE_APP_ENV: 'development' | 'production' | 'pre-release' | 'test'
        VITE_APP_API: string
        VITE_APP_API_DOMAIN: string
        BASE_URL: string
        SSR: boolean
    }
}
