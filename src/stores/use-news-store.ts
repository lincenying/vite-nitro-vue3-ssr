import type { NewsState } from '../types/pinia.types'
import type { NewsType } from '~/types/news.types'
import * as newsApi from '~/api/news'
import { createContentStore, setupStoreHMR } from './create-content-store'

const usePiniaStore = createContentStore<
    NewsState['index'],
    NewsType,
    NewsType,
    NewsType
>('newsStore', {
    fetchList: newsApi.fetchNewsList,
    fetchDetail: newsApi.fetchNewsDetail,
    fetchRelatedRecom: newsApi.fetchNewsRelatedRecom,
    fetchRecommend: newsApi.fetchNewsRecommend,
}, { recommend: [] })

export default usePiniaStore
export const newsStoreWithout = () => usePiniaStore(piniaInit)
setupStoreHMR(usePiniaStore)
