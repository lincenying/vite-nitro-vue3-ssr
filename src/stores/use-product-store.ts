import type { ProductCategory, ProductState } from '../types/pinia.types'
import type { NewsType } from '~/types/news.types'
import { isEmpty } from '@lincy/utils'
import { acceptHMRUpdate } from 'pinia'
import { defaultList } from '~/constants'

interface PayloadType {
    page: number
    pageSize?: number
    tag: string | string[] | undefined
    category: string | string[] | undefined
}

const usePiniaStore = defineStore('productStore', () => {
    const state: ProductState = reactive({
        index: defaultList(),
        category: [],
        detail: {},
        recommend: [],
        relatedRecom: [],
    })

    const setCategory = (payload: ProductCategory[]) => {
        state.category = payload
    }

    const getIndex = async (payload: PayloadType, api: ApiType = $api) => {
        const { code, data } = await api.get<ProductState['index']>('/home/getList', payload)
        if (code === 200 && !isEmpty(data)) {
            state.index = data
        }
    }

    const getCategory = async (api: ApiType = $api) => {
        const { code, data } = await api.get<ProductState['category']>('/home/getCategory', { })
        if (code === 200 && !isEmpty(data)) {
            state.category = data
        }
    }

    const getRecommend = async (api: ApiType = $api) => {
        const { code, data } = await api.get<ProductState['recommend']>('/home/getRecommend', { })
        if (code === 200 && !isEmpty(data)) {
            state.recommend = data
        }
    }

    const getDetail = async (id: string, api: ApiType = $api) => {
        const { code, data } = await api.get<NewsType>('/news/detail', { id })
        if (code === 200 && data) {
            state.detail[id] = data
        }

        return data
    }

    const getRelatedRecom = async (api: ApiType = $api) => {
        const { code, data } = await api.get<ProductState['relatedRecom']>('/home/relatedRecom', { })
        if (code === 200 && data) {
            state.relatedRecom = data
        }

        return data
    }

    return {
        ...toRefs(state),
        getIndex,
        getCategory,
        setCategory,
        getRecommend,
        getDetail,
        getRelatedRecom,
    }
})
export default usePiniaStore
export const productStoreWithout = () => usePiniaStore(piniaInit)

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePiniaStore, import.meta.hot))
}
