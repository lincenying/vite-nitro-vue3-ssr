import type { CommentType } from '~/types/comments.types'
import type { CommentState } from '~/types/pinia.types'
import { acceptHMRUpdate } from 'pinia'

interface PayloadType {
    page: number
    id: string | number
    type: string
}

const usePiniaStore = defineStore('commentStore', () => {
    const state: CommentState = reactive({
        detail: {},
    })
    const getComment = async (payload: PayloadType, api: ApiType = $api) => {
        const { code, data } = await api.get<CommentType>('/comment/getList', payload)
        if (code === 200 && data) {
            state.detail[`${payload.type}-${payload.id}`] = data
        }

        return data
    }

    return {
        ...toRefs(state),
        getComment,
    }
})
export default usePiniaStore
export const commentStoreWithout = () => usePiniaStore(piniaInit)

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePiniaStore, import.meta.hot))
}
