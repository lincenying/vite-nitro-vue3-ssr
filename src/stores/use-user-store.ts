import type { UserState } from '../types/pinia.types'
import { acceptHMRUpdate } from 'pinia'
import { fetchUserProfile, logoutUser } from '~/api/user'
import { userStorage } from '~/composables/storage'

const usePiniaStore = defineStore('userStore', () => {
    const state: UserState = reactive(userStorage.value || {
        info: {},
        token: '',
    })

    const isLoggedIn = computed(() => !!state.info?.name)

    /**
     * 设置用户信息
     */
    const setInfo = (payload: Objable) => {
        state.info = payload
    }

    /**
     * 设置登录 token
     */
    const setToken = (payload: string) => {
        state.token = payload
    }

    /**
     * 清除用户状态
     */
    const clearUser = () => {
        state.info = {}
        state.token = ''
    }

    /**
     * 从服务端获取当前登录用户
     */
    const fetchProfile = async (api: ApiType = $api) => {
        const { code, data } = await fetchUserProfile(api)
        if (code === 200 && data) {
            setInfo(data)
            return true
        }
        clearUser()
        return false
    }

    /**
     * 登出
     */
    const logout = async (api: ApiType = $api) => {
        await logoutUser(api)
        clearUser()
    }

    return {
        ...toRefs(state),
        isLoggedIn,
        setInfo,
        setToken,
        clearUser,
        fetchProfile,
        logout,
    }
})

usePiniaStore(piniaInit).$subscribe((_mutation, state) => {
    userStorage.value = state
})

export default usePiniaStore
export const userStoreWithout = () => usePiniaStore(piniaInit)

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePiniaStore, import.meta.hot))
}
