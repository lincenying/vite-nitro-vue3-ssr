## Features

- 💚 [Nitro](https://nitro.build/guide) - Nitro 是一个开源框架，用于使用 h3 构建网络服务器，并提供大量内置功能
- ⚡️ [Vite](https://cn.vitejs.dev/) - 即时 HMR.
- 🎨 [UnoCSS](https://github.com/unocss/unocss) - 即时按需原子 CSS 引擎
- 😃 使用纯 CSS 中任何图标集的图标，由 [UnoCSS](https://github.com/unocss/unocss) 驱动.
- 🔥 `<script setup lang="ts">` 语法.
- 🍍 [通过 Pinia 进行状态管理](https://github.com/vuejs/pinia), 详见 [./stores/use-index-store.ts](./stores/use-index-store.ts).
- 📑 [布局系统](/src/layouts).
- 📥 API 自动导入 - 用于 Composition API、VueUse 和自定义可组合项
- 🏎 零配置云功能和部署
- 🦾 当然是 TypeScript.

## IDE

建议使用 [VS Code](https://code.visualstudio.com/) 和 [Volar](https://github.com/vuejs/language-tools) 以获得最佳体验（您可能需要禁用 [Vetur](https://vuejs.github.io/vetur/) 如果你有的话）。

## Variations

- [vite-nuxt3](https://github.com/lincenying/vite-nuxt3) - Nuxt3 + Vite 入门模板
- [vite-uniapp-vue3](https://github.com/lincenying/vite-uniapp-vue3) - Uniapp3 + Vite 入门模板
- [vite-react-mobx-ssr](https://github.com/lincenying/vite-react-mobx-ssr) - React + Mobx + Vite + SSR 入门模板
- [vite-react-mobx](https://github.com/lincenying/vite-react-mobx) - React + Mobx + Vite 入门模板
- [vite-react-redux](https://github.com/lincenying/vite-react-redux) - React + Redux + Vite 入门模板
- [vite-vue3-h5-ssr](https://github.com/lincenying/vite-vue3-h5-ssr) - Vue3 + Vant + Vite + SSR 入门模板
- [vite-vue3-h5](https://github.com/lincenying/vite-vue3-h5) - Vue3 + Vant + Vite 入门模板
- [vite-vue3-admin](https://github.com/lincenying/vite-vue3-admin) - Vue3 + ElementPlus + Vite 管理后台入门模板

## Try it now!

### Clone to local

如果您更喜欢使用更干净的 git 历史记录手动执行此操作

```bash
npx degit lincenying/vite-nitro-vue-ssr vite-nitro-vue-ssr
cd vite-nitro-vue-ssr
pnpm i # 如果您没有安装 pnpm，请运行：npm install -g pnpm
```

### 开发环境

```bash
pnpm serve
```

### 生产环境

```bash
pnpm build
```

### 生产环境预览

```bash
pnpm start
```

### Lint 和修复文件

```bash
pnpm lint # eslint检测不修复
pnpm lint:fix # eslint检测并修复
pnpm lint:ts # ts 类型检测
pnpm lint:css # css 检测并修复

```

## License

[MIT]
