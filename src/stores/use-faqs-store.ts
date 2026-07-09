import type { FaqsState } from '../types/pinia.types'
import type { FaqsType } from '~/types/faqs.types'
import * as faqsApi from '~/api/faqs'
import { createContentStore, setupStoreHMR } from './create-content-store'

const usePiniaStore = createContentStore<
    FaqsState['index'],
    FaqsType,
    FaqsType,
    FaqsType
>('faqsStore', {
    fetchList: faqsApi.fetchFaqsList,
    fetchDetail: faqsApi.fetchFaqsDetail,
    fetchRelatedRecom: faqsApi.fetchFaqsRelatedRecom,
    fetchRecommend: faqsApi.fetchFaqsRecommend,
})

export default usePiniaStore
export const faqsStoreWithout = () => usePiniaStore(piniaInit)
setupStoreHMR(usePiniaStore)
