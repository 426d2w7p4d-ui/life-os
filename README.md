# Life OS · 我的生活

Life OS 是一个手机端优先的个人生活管理 PWA。第一版完全可以不接 AI 使用，数据默认保存在浏览器的 IndexedDB 里。

## 现在这版已经有什么

- 今天：首页完成度、今日任务、课程、英语、消费、工作、宠物提醒
- 日历：按日期查看任务和课程
- 任务：新增、完成、删除、本地保存
- 课程：添加课程、从课程直接创建作业任务
- 英语：Level 0 - Level 6 学习路线、示例课程、练习、小测、学习记录
- 工作台：客户、视频列表、视频状态看板
- 宠物：宠物档案和健康记录
- 记账：收入/支出、预算进度、最近账单
- 备忘录：新增备忘录、一键转任务
- 纪念日 / 倒数日
- 每日复盘：自动汇总任务、英语和消费
- 奖励中心
- 全局搜索
- 设置：日历管理、JSON 全量备份和恢复
- PWA：可添加到手机主屏幕
- GitHub Pages：已提供自动部署工作流
- AI：接口已预留，但默认完全关闭

> 这是一版可以继续长期迭代的可运行基础版。完整规格里更深的功能，例如英语全部课程内容、错题本完整题库、课程周次算法、图表统计、拖拽看板、图片附件等，可以继续在当前架构上补，不需要推倒重做。

---

## 1. 安装 Node.js

如果电脑还没有 Node.js，先安装 Node.js 22 或更高版本。

安装完以后打开终端，输入：

```bash
node -v
npm -v
```

能看到版本号就说明安装好了。

## 2. 安装项目依赖

在这个项目文件夹里打开终端，输入：

```bash
npm install
```

第一次会下载依赖，需要联网。

## 3. 在电脑上运行

输入：

```bash
npm run dev
```

终端会显示一个本地网址，例如：

```text
http://localhost:5173
```

用浏览器打开它。

如果想让同一个 Wi-Fi 下的手机也能打开，可以输入：

```bash
npm run dev -- --host
```

然后手机访问终端里显示的局域网地址。

## 4. 构建正式版本

输入：

```bash
npm run build
```

成功后会生成 `dist` 文件夹。

## 5. 上传到 GitHub

最简单的方法：

1. 在 GitHub 新建一个仓库，例如 `life-os`。
2. 把这个项目里的全部文件上传到仓库。
3. 确保默认分支叫 `main`。
4. 不要删除 `.github/workflows/deploy.yml`。

如果你使用 Git 命令，也可以：

```bash
git init
git add .
git commit -m "first Life OS version"
git branch -M main
git remote add origin 你的仓库地址
git push -u origin main
```

## 6. 开启 GitHub Pages

进入 GitHub 仓库：

1. 打开 `Settings`。
2. 左边找到 `Pages`。
3. `Source` 选择 `GitHub Actions`。
4. 回到仓库的 `Actions` 页面。
5. 等待 `Deploy Life OS to GitHub Pages` 变成绿色成功状态。

部署工作流会自动根据你的仓库名称处理 Vite 的子目录路径，所以仓库不一定非要叫 `life-os`。

## 7. 手机上打开

GitHub Pages 成功以后，会得到一个网址。

直接在 Android 浏览器或 iPhone Safari 里打开即可。

## 8. 添加到手机桌面

### iPhone

1. 用 Safari 打开 Life OS。
2. 点底部“分享”按钮。
3. 选择“添加到主屏幕”。
4. 点“添加”。

### Android

1. 用 Chrome 打开 Life OS。
2. 浏览器菜单里选择“安装应用”或“添加到主屏幕”。
3. 按提示完成。

以后它会像普通 App 一样从桌面打开。

## 9. 数据保存在哪里

第一版的数据保存在当前浏览器的 IndexedDB 中。

这意味着：

- 刷新网页不会丢。
- 关闭浏览器再打开不会丢。
- 不会自动上传到未知服务器。
- 如果清空浏览器网站数据，数据可能被删除。

所以请定期到：

`我的 → 数据与备份`

导出 JSON 备份文件。

## 10. AI 为什么是关闭的

第一版没有在浏览器前端写任何真实 API Key。

以下开关默认都是 `false`：

```ts
aiAssistant: false
englishAiTeacher: false
ocrCourseImport: false
```

未来需要 AI 时，建议通过后端、云函数或 Serverless Function 代理，再接 DeepSeek、Qwen、OpenAI-compatible API 等模型。
