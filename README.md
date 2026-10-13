# Rucheng 工业刀片网站源码

根据用户提供的原站开发服务器公开的前端模块及 source map 恢复，保留 React + TypeScript + Vite + Tailwind CSS 结构。支持本地编辑和通过发布分支部署到 ECS。

## 启动

```sh
npm install
npm run dev
```

浏览器打开终端显示的地址（通常为 http://127.0.0.1:5173）。生产构建：`npm run build`；预览构建：`npm run preview`。

## ECS 编译与提交模式

沿用 `nearfastener` 的发布模式：开发分支保存源码，本地编译并预览，`push_remote` 分支只保存静态产物及部署 workflow。GitHub Actions 不编译，通过 SSH + rsync 同步到 ECS。

```sh
# 在 main 或其他开发分支修改并提交源码，保持工作区干净
npm ci
npm run build:ecs
npm run preview  # 浏览器检查；结束后 Ctrl+C
npm run publish:ecs -- --dry-run  # 可选：准备发布提交，不推送
npm run publish:ecs
```

`build:ecs` 执行 TypeScript 检查和 Vite 构建，在 `dist/.ecs-build.json` 记录源码提交，不推送。`publish:ecs` 核对当前提交后，将现有 `dist/` 作为 `push_remote` 的根目录提交并推送，不重新编译、不切换开发分支、不强制推送。源码提交变化后需重新构建；不要手工修改产物。

只推送 `main` 不会部署。首次发布自动创建 `push_remote`；该分支的推送触发 ECS 同步。部署默认目录为 `/var/www/nearblade`，必须与其他网站隔离。首次上线需配置 GitHub Secrets 和 Nginx，详见 [ECS 部署文档](docs/DEPLOYMENT.md)。发布流程本地验证：`npm run test:ecs`。

## 页面与编辑位置

- `src/pages/`：首页、产品列表、产品详情、关于我们、设备、联系页面。
- `src/data/products.ts`：产品分类、型号、材料、精度、应用和图片。
- `src/components/generated/`：导航、页脚、计数动画、询价表单。
- `src/index.css` 和 `tailwind.config.js`：原站配色、字体、间距和样式。
- `src/components/common/PageHero.tsx`：所有页面共用的全屏主图、标题、按钮和正文滚动入口。
- `public/images/`：本地图片资源，`assets.json` 记录恢复状态。

## 恢复范围与限制

恢复浏览器可取得的前端源码及样式，并补齐独立运行所需的构建配置。没有取得服务器端源码、数据库或平台后台。入口中未保留万小智平台编辑器、统计与热更新注入。

修正原站计数组件将小数取整的问题，使首页精度显示为 ±0.001mm。

图片资源分为两组：手册提取的 18 张原始照片保留在 `public/images/manual/`；产品展示区使用内置 ImageGen 参考手册制作的 7 张独立透明背景展示图，保存于 `public/images/products/`，分辨率 1536×1024。新图统一中性银色钢材、清晰轮廓和完整构图，去除手册拼版、杂色底、包装盒及文字；卡片与详情通过 CSS 设置统一的摄影棚底色。它们是参考产品形态生成的宣传展示图，不是具体型号实拍或尺寸图，选型应以原始手册和确认图纸为准。

首页保留原有宣传静物横幅；产品列表改用独立的钢材刃口特写横幅 `public/images/catalog-hero.jpg`；7 个产品详情分别使用自身独立产品展示图。About、Equipment、Contact 页面分别使用独立生成的刀片精密检测、磨削设备、技术选型工作台横幅，保存于 `public/images/heroes/`（1672×941），属于概念宣传场景。它们留出中心标题空间，并使用较轻的遮罩保留画面细节。PageHero 的图片参数为必填，防止无意回退到同一张主图。图片来源、工具、参考图和完整生成提示词保存于 `public/images/assets.json`。

原站表单仅设置前端成功状态，没有网络发送接口。本地版本保留演示交互并明确提示不会发送询价；生产使用前需要接入邮件或后台 API。社交链接沿用原站占位链接。

静态部署需将所有页面路由回退到 `index.html`，以支持 `/products/:id` 等直接访问。

## 验证

- TypeScript 5.6.2 类型检查通过。
- Vite 5.4.21 生产构建通过，构建文件位于 `dist/`。
- Chrome 实际检查首页视觉、产品列表、分类筛选、产品详情跳转通过。
- 本地资源路径和组件引用检查通过。
- 全站统一大屏主图更新后，`npm run build` 通过；Chrome 检查关于页、产品详情页主图及正文锚点滚动通过。
- 第一轮图片更新经过 Chrome 检查；本轮对新图逐张视觉检查，验证透明通道、尺寸、资源引用和主图唯一性，并重新通过生产构建。

## 当前配色：浅色正文与海军蓝框架

参考 `nearfastener`：正文使用白色 / 浅灰底、海军蓝标题、灰蓝正文和铜橙色操作按钮；导航、制造能力数据区及页脚采用深海军蓝。产品透明图使用浅灰摄影棚底，卡片使用白底与细边框；规格、筛选、Blog 和询价区统一采用浅色体系。Hero 保留原有图片、遮罩、浅蓝标题和蓝色按钮，通过局部颜色变量隔离正文配色。主题颜色在 `tailwind.config.js` 与 `src/index.css` 中维护。当前效果以 `npm run build` 后的 `npm run preview` 为准。

`previews/` 中保留的是此前配色方案的静态视觉预览，不代表当前主题。它们不包含筛选、表单或移动导航交互。需要按当前页面重新生成 `previews/light-theme/` 时，先执行 `npm run build`，再执行 `node scripts/preview-theme.mjs`。

全部 7 个产品详情页保留炭灰 Hero 背景、白色标题和浅蓝强调。详情正文改为白底，规格区采用浅灰色，询价区使用铜橙色顶边与白色输入框。

## Blog 模块

`/blog` 为文章列表，`/blog/:slug` 为文章详情。首页、导航与页脚增加 Blog 入口；初始文章涵盖定制询价、产品分类和更换规划。内容在 `src/data/blog.ts` 编辑，详情页包含目录、相关产品、询价入口与相关文章。Blog 正文采用统一的浅灰底和白色卡片，保留独立生成的 Hero 主图；来源与提示词见 `public/images/assets.json`。这是一组静态内容页面，没有管理后台。

历史蓝色主题预览生成脚本：`node scripts/preview-theme.mjs` 和 `node scripts/preview-hero-blue.mjs`。这些方案预览不用于 ECS 发布。
