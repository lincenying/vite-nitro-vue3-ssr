import type { CasesState } from '../types/pinia.types'
import type { CasesType } from '~/types/cases.types'
import type { NewsType } from '~/types/news.types'
import * as casesApi from '~/api/cases'
import { createContentStore, setupStoreHMR } from './create-content-store'

const usePiniaStore = createContentStore<
    CasesState['index'],
    NewsType,
    CasesType,
    NewsType
>('casesStore', {
    fetchList: casesApi.fetchCasesList,
    fetchDetail: casesApi.fetchCasesDetail,
    fetchRelatedRecom: casesApi.fetchCasesRelatedRecom,
    fetchRecommend: casesApi.fetchCasesRecommend,
})

export default usePiniaStore
export const casesStoreWithout = () => usePiniaStore(piniaInit)
setupStoreHMR(usePiniaStore)
