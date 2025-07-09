<template>
    <div id="root" flex="~ col">
        <globalHeader />
        <router-view v-slot="{ Component }" class="body">
            <transition
                name="fade" mode="out-in"
                @before-enter="handleBeforeEnter"
                @after-enter="handleAfterEnter"
                @after-leave="handleAfterLeave"
            >
                <keep-alive :include="cacheComponents">
                    <Suspense>
                        <component :is="Component" />
                    </Suspense>
                </keep-alive>
            </transition>
        </router-view>
        <globalFooter />
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'AppRoot',
})

// pinia 状态管理 ===>
const globalStore = useGlobalStore()

const userStore = useUserStore()

// const tmpCount = computed(() => globalStore.counter)
// 监听状态变化
globalStore.$subscribe((mutation, state) => {
    if (mutation.events) {
        let _Array = mutation.events
        if (!Array.isArray(_Array)) {
            _Array = [_Array]
        }
        _Array.forEach((item) => {
            console.log(`%c[${mutation.storeId}.${item?.key}] <${mutation.type}> >>> ${item?.oldValue} => ${item?.newValue}`, 'color: red')
        })
    }
    console.log('%c[state] >> ', 'color: red')
    console.log(state)
    console.log('%c<< [state]', 'color: red')
})
// pinia 状态管理 <===

const cacheComponents = ref('abc')

// 全局组件通信 ===>
provide(onLoginKey, (payload: string) => {
    userStore.setToken(payload)
    console.log('payload :>> ', payload)
})
// 全局组件通信 <===

function handleBeforeEnter() {
}
function handleAfterEnter() {
}
function handleAfterLeave() {
}
</script>
