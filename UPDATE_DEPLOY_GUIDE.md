# Life OS v0.2.1 更新部署（给不懂编程的人）

你的 GitHub 仓库已经叫 `life-os`，Pages 和 Actions 也已经开好，所以这次不需要重新建仓库。

## 最简单更新方法

1. 下载 `life-os-v0.2.1.zip`。
2. 在电脑上右键压缩包 → 全部解压。
3. 打开解压后的 `life-os` 文件夹。
4. 打开 GitHub → 进入你的 `life-os` 仓库 → `Code`。
5. 点击 `Add file` → `Upload files`。
6. 把解压后的这些内容拖进去：
   - `src` 文件夹
   - `public` 文件夹
   - `docs` 文件夹
   - `index.html`
   - `package.json`
   - `tsconfig.app.json`
   - `tsconfig.json`
   - `tsconfig.node.json`
   - `vite.config.ts`
   - `README.md`
   - `IMPLEMENTATION_NOTES.md`
7. GitHub 如果提示文件同名，会以这次提交更新这些文件。
8. 页面底部点 `Commit changes`。
9. 点顶部 `Actions`，等待最新的 `Deploy Life OS to GitHub Pages` 变成绿色 ✅。
10. 绿色以后，打开原来的 Life OS 网站地址即可。

## `.github` 文件夹怎么办？

你之前已经手动创建并成功运行过 `.github/workflows/deploy.yml`，所以这次即使 Windows 看不到 `.github` 隐藏文件夹，也不用重新上传它。

如果部署失败，把 Actions 里最新一条红叉点进去，把报错截图发给 ChatGPT，不要自己乱删文件。

## 更新后手机怎么刷新？

先用 Safari 打开 Life OS 网页刷新一次。如果主屏幕上的 Web App 还是旧界面：

1. 完全划掉 Life OS。
2. 再重新打开。
3. 等几秒，PWA 会自动更新缓存。

正常更新不会主动清空 IndexedDB 里的旧任务、课程、账单等数据。但正式使用前仍建议先在「我的 → 数据与备份」导出一份 JSON 备份。
