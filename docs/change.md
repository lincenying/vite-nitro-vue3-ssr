## 2026-07-09 11:45:47

### 改动内容

- 将 `typescript` 从 `~7.0.1-rc` 降级为 `~5.9.3`，修复 `vue-tsc` 因 TypeScript 7 不再导出 `./lib/tsc` 导致的 `ERR_PACKAGE_PATH_NOT_EXPORTED` 报错
- 为 `use-user-store` 补充缺失的 `setToken` 方法，修复 `App.vue` 类型错误
- 将 `AsyncDataConfig.req` 类型从 Web `Request` 修正为 Node `IncomingMessage`，与 SSR 实际传入类型一致

### Commit Message

```
fix: 降级 TypeScript 至 5.9 以修复 vue-tsc 兼容性

```
