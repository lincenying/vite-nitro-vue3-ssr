<template>
    <div class="global-header" flex="~ none justify-center items-center" h="80px!" fixed left-0 top-0 z-999 w-100vw bg-hex-fff>
        <div ref="headerInnerRef" class="global-header__inner" flex="~ justify-between items-center auto" w-full max-w-1294px lt-s1366="mx-24px">
            <div flex="~ items-center">
                <img :src="NavLogo" h-31px w-109px alt="">
                <div class="menu-wrap menu-wrap--desktop" flex="~ items-center" ml-64px>
                    <el-dropdown class="menu-item" :class="menuActive === 'home' ? 'active' : ''" mr-32px @command="handleCommand">
                        <span class="el-dropdown-link">
                            <router-link un-text="16px hex-202935" lh-32px to="/">产品展示</router-link>
                            <el-icon class="el-icon--right">
                                <ArrowDown />
                            </el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item v-for="(item, index) in category" :key="index" :command="item.id">{{ item.title }}</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>

                    <router-link class="menu-item" :class="menuActive === 'cases' ? 'active' : ''" relative mr-32px text-16px lh-32px to="/cases">案例展示</router-link>
                    <router-link class="menu-item" :class="menuActive === 'news' ? 'active' : ''" mr-32px text-16px lh-32px to="/news">新闻中心</router-link>
                    <router-link class="menu-item" :class="menuActive === 'faqs' ? 'active' : ''" mr-32px text-16px lh-32px to="/faqs">常见问题</router-link>
                    <router-link class="menu-item" :class="menuActive === 'article' ? 'active' : ''" mr-32px text-16px lh-32px to="/article">SQLite文章</router-link>
                    <router-link class="menu-item" :class="menuActive === 'editor' ? 'active' : ''" mr-32px text-16px lh-32px to="/editor">编辑器</router-link>
                </div>
            </div>

            <button
                ref="menuToggleRef"
                class="menu-toggle"
                type="button"
                aria-label="打开导航菜单"
                :aria-expanded="mobileMenuVisible"
                @click="toggleMobileMenu"
            >
                <el-icon :size="24">
                    <Menu />
                </el-icon>
            </button>

            <Transition name="mobile-menu">
                <div v-show="mobileMenuVisible" ref="mobileMenuRef" class="mobile-menu-panel">
                    <div class="mobile-menu-item" :class="{ active: menuActive === 'home' }">
                        <router-link text-16px lh-32px to="/" @click="closeMobileMenu">产品展示</router-link>
                    </div>
                    <div v-for="item in category" :key="item.id" class="mobile-menu-subitem">
                        <router-link text-14px lh-28px :to="`/?category=${item.id}`" @click="closeMobileMenu">{{ item.title }}</router-link>
                    </div>
                    <div class="mobile-menu-item" :class="{ active: menuActive === 'cases' }">
                        <router-link text-16px lh-32px to="/cases" @click="closeMobileMenu">案例展示</router-link>
                    </div>
                    <div class="mobile-menu-item" :class="{ active: menuActive === 'news' }">
                        <router-link text-16px lh-32px to="/news" @click="closeMobileMenu">新闻中心</router-link>
                    </div>
                    <div class="mobile-menu-item" :class="{ active: menuActive === 'faqs' }">
                        <router-link text-16px lh-32px to="/faqs" @click="closeMobileMenu">常见问题</router-link>
                    </div>
                    <div class="mobile-menu-item" :class="{ active: menuActive === 'article' }">
                        <router-link text-16px lh-32px to="/article" @click="closeMobileMenu">SQLite文章</router-link>
                    </div>
                    <div class="mobile-menu-item" :class="{ active: menuActive === 'editor' }">
                        <router-link text-16px lh-32px to="/editor" @click="closeMobileMenu">编辑器</router-link>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
    <div h-80px></div>
</template>

<script setup lang="ts">
import { ArrowDown, Menu } from '@element-plus/icons-vue'
import { onClickOutside } from '@vueuse/core'

import NavLogo from '@/assets/images/nav-logo.png'

defineOptions({
    name: 'GlobalHeader',
})

const globalStore = useGlobalStore()
const { menuActive } = storeToRefs(globalStore)

const router = useRouter()
const route = useRoute()

const productStore = useProductStore()
const { category } = storeToRefs(productStore)

const mobileMenuVisible = ref(false)
const headerInnerRef = useTemplateRef<HTMLElement>('headerInnerRef')
const mobileMenuRef = useTemplateRef<HTMLElement>('mobileMenuRef')
const menuToggleRef = useTemplateRef<HTMLElement>('menuToggleRef')

/** 切换移动端导航菜单显示状态 */
function toggleMobileMenu() {
    mobileMenuVisible.value = !mobileMenuVisible.value
}

/** 关闭移动端导航菜单 */
function closeMobileMenu() {
    mobileMenuVisible.value = false
}

/** 处理产品分类下拉选择 */
function handleCommand(command: string) {
    router.push(`/?category=${command}`)
}

onClickOutside(mobileMenuRef, () => {
    mobileMenuVisible.value = false
}, {
    ignore: [menuToggleRef, headerInnerRef],
})

watch(() => route.fullPath, () => {
    closeMobileMenu()
})
</script>
