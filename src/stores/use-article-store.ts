import type { ArticleState } from '../types/pinia.types'
import type { ArticleType } from '~/types/article.types'
import * as articleApi from '~/api/article'
import { createContentStore, setupStoreHMR } from './create-content-store'

const usePiniaStore = createContentStore<
    ArticleState['index'],
    ArticleType,
    ArticleType,
    ArticleType
>('articleStore', {
    fetchList: articleApi.fetchArticleList,
    fetchDetail: articleApi.fetchArticleDetail,
    fetchRelatedRecom: articleApi.fetchArticleRelatedRecom,
    fetchRecommend: articleApi.fetchArticleRecommend,
})

export default usePiniaStore
export const articleStoreWithout = () => usePiniaStore(piniaInit)
setupStoreHMR(usePiniaStore)
