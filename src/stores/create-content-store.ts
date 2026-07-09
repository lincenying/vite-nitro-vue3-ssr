import type { IListPayload } from '~/api/types'
import { isEmpty } from '@lincy/utils'
import { acceptHMRUpdate } from 'pinia'
import { defaultList } from '~/constants'

interface IContentEndpoints<TDetail> {
    fetchList: (api: ApiType, payload: IListPayload) => Promise<ResponseData<unknown>>
    fetchDetail: (api: ApiType, id: string) => Promise<ResponseData<TDetail>>
    fetchRelatedRecom: (api: ApiType) => Promise<ResponseData<unknown>>
    fetchRecommend?: (api: ApiType) => Promise<ResponseData<unknown>>
}

interface IContentState<TList, TDetail, TRelated, TRecommend = never> {
    index: TList
    detail: Record<string, TDetail>
    relatedRecom: TRelated[]
    recommend: TRecommend[]
    category?: unknown[]
}

/**
 * 创建内容模块通用 Store
 */
export function createContentStore<
    TList,
    TDetail,
    TRelated,
    TRecommend = never,
>(
    storeId: string,
    endpoints: IContentEndpoints<TDetail>,
    extraState?: Partial<IContentState<TList, TDetail, TRelated, TRecommend>>,
) {
    const usePiniaStore = defineStore(storeId, () => {
        const state = reactive<IContentState<TList, TDetail, TRelated, TRecommend>>({
            index: defaultList() as TList,
            detail: {},
            relatedRecom: [],
            recommend: [] as TRecommend[],
            ...extraState,
        })

        const getIndex = async (payload: IListPayload, api: ApiType = $api) => {
            const { code, data } = await endpoints.fetchList(api, payload)
            if (code === 200 && !isEmpty(data)) {
                state.index = data as typeof state.index
            }
        }

        const getDetail = async (id: string, api: ApiType = $api) => {
            const { code, data } = await endpoints.fetchDetail(api, id)
            if (code === 200 && !isEmpty(data)) {
                state.detail[id] = data
            }
            return data
        }

        const getRelatedRecom = async (api: ApiType = $api) => {
            const { code, data } = await endpoints.fetchRelatedRecom(api)
            if (code === 200 && !isEmpty(data)) {
                state.relatedRecom = data as typeof state.relatedRecom
            }
            return data
        }

        const getRecommend = async (api: ApiType = $api) => {
            if (!endpoints.fetchRecommend) {
                return
            }
            const { code, data } = await endpoints.fetchRecommend(api)
            if (code === 200 && !isEmpty(data)) {
                state.recommend = data as typeof state.recommend
            }
        }

        return {
            ...toRefs(state),
            getIndex,
            getDetail,
            getRelatedRecom,
            getRecommend,
        }
    })

    return usePiniaStore
}

export function setupStoreHMR(usePiniaStore: ReturnType<typeof createContentStore>) {
    if (import.meta.hot) {
        import.meta.hot.accept(acceptHMRUpdate(usePiniaStore as never, import.meta.hot))
    }
}
