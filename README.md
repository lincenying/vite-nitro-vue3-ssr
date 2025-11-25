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

- [vite-nitro-vue3](https://github.com/lincenying/vite-nitro-vue3) - Vue3 + Nitro2 + ElementPlus + Vite web入门模板
- [vite-nitro-vue3-ssr](https://github.com/lincenying/vite-nitro-vue3-ssr) - Vue3 + Nitro2 + ElementPlus + Vite + SSR web入门模板
- [vite-nitro3-vue3](https://github.com/lincenying/vite-nitro3-vue3) - Vue3 + Nitro3 + ElementPlus + Vite + SSR web入门模板
- [vite-nuxt3](https://github.com/lincenying/vite-nuxt3) - Nuxt3 + Vite 入门模板
- [vite-vue3-admin](https://github.com/lincenying/vite-vue3-admin) - Vue3 + ElementPlus + Vite 管理后台入门模板
- [vite-vue3-h5](https://github.com/lincenying/vite-vue3-h5) - Vue3 + Vant + Vite 入门模板
- [vite-vue3-h5-ssr](https://github.com/lincenying/vite-vue3-h5-ssr) - Vue3 + Vant + Vite + SSR 入门模板
- [vite-vue3-uniapp](https://github.com/lincenying/vite-vue3-uniapp) - Uniapp3 + Vite 入门模板
- [vite-vue3-web](https://github.com/lincenying/vite-vue3-web) - Vue3 + ElementPlus + Vite web入门模板
- [vite-react-mobx](https://github.com/lincenying/vite-react-mobx) - React + Mobx + Vite 入门模板
- [vite-react-mobx-ssr](https://github.com/lincenying/vite-react-mobx-ssr) - React + Mobx + Vite + SSR 入门模板
- [vite-react-redux](https://github.com/lincenying/vite-react-redux) - React + Redux + Vite 入门模板

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
pnpm preview

# VITE_APP_SSR_API 设置的端口需要和启动端口保持一致, 否则SSR端无法请求接口
```

### Lint 和修复文件

```bash
pnpm lint # eslint检测不修复
pnpm lint:fix # eslint检测并修复
pnpm lint:ts # ts 类型检测
pnpm lint:css # css 检测并修复

```

### docker

```bash
# 第一次执行时, 如果node镜像拉不下来, 可以执行以下命令:
docker pull swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/node:22-alpine3.22
docker tag swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/node:22-alpine3.22 node:22-alpine
# 构建镜像
docker build -t vite-nitro-vue3-ssr:1.25.1029 -f ./Dockerfile .
# 运行镜像
docker run -d -p 5273:5273 --add-host=host.docker.internal:host-gateway --name vite-nitro-vue3-ssr vite-nitro-vue3-ssr:1.25.1029
# 进入镜像
docker exec -it vite-nitro-vue3-ssr /bin/sh
# 停止容器
docker stop vite-nitro-vue3-ssr
# 删除容器
docker rm vite-nitro-vue3-ssr
# 删除镜像
docker rmi vite-nitro-vue3-ssr:1.25.1029
```

## License

[MIT]
