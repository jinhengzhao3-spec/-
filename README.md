# 赵金恒作品集网站

这是一个基于 Vite 和 React 的静态作品集网站。

## 发布方式

网站配置为通过 GitHub Actions 自动发布到 GitHub Pages。当前仓库名为 `-`，发布地址为：

https://jinhengzhao3-spec.github.io/-/

首次发布时，在 GitHub 仓库设置中将 **Settings → Pages → Build and deployment → Source** 设为 **GitHub Actions**。之后推送到 `master` 分支会自动重新构建并发布。

## 本地预览

```bash
pnpm install
pnpm dev
```
