# Nearblade 工业刀片网站源码

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
npm run build:ecs  # 已包含 npm test，无需重复运行
npm run preview  # 浏览器检查；结束后 Ctrl+C
npm run publish:ecs -- --dry-run  # 可选：准备发布提交，不推送
npm run publish:ecs
```

使用 Node.js 22.13 或更新版本。`npm test` 依次运行 TypeScript、语言包校验、Vite 和静态 SEO 构建，再运行站点、多语言与发布流程测试。`build:ecs` 与参考仓库一样调用 `npm test`，全部通过且源码提交保持不变后才在 `dist/.ecs-build.json` 记录该提交，不推送。开发工作区可以执行普通构建和测试，发布构建要求先提交源码。`publish:ecs` 核对当前提交后，将现有 `dist/` 作为 `push_remote` 的根目录提交并推送，不重新编译、不切换开发分支、不强制推送。源码提交变化后需重新构建；不要手工修改产物。

只推送 `main` 不会部署。首次发布自动创建 `push_remote`；该分支的推送触发 ECS 同步。部署默认目录为 `/var/www/nearblade`，必须与其他网站隔离。首次上线需配置 GitHub Secrets 和 Nginx；可参考 [Nginx 配置模板](deploy/nginx.conf.example)和 [ECS 部署文档](docs/DEPLOYMENT.md)。发布流程本地验证：`npm run test:ecs`。`output/` 和 `.playwright-cli/` 仅用于本地检查，不纳入源码提交或部署。

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

手册提取的 18 张原始照片保留在 `public/images/manual/`；产品展示区使用内置 ImageGen 参考手册制作的 7 张独立透明背景展示图，保存于 `public/images/products/`，分辨率 1536×1024。网页使用质量 88 的 WebP 版本，7 张合计约 1 MB；原 PNG（合计约 12.2 MB）保留作为母版及历史预览资源。Logo 同样使用 WebP，约 28 KB，原 PNG 保留。转换记录见 `public/images/assets.json`。产品图统一中性银色钢材、清晰轮廓和完整构图；卡片与详情通过 CSS 设置统一的摄影棚底色。它们是参考产品形态生成的宣传展示图，不是具体型号实拍或尺寸图，选型应以原始手册和确认图纸为准。

首页保留原有宣传静物横幅；产品列表改用独立的钢材刃口特写横幅 `public/images/catalog-hero.jpg`；7 个产品详情分别使用自身独立产品展示图。About、Equipment、Contact 页面分别使用独立生成的刀片精密检测、磨削设备、技术选型工作台横幅，保存于 `public/images/heroes/`（1672×941），属于概念宣传场景。它们留出中心标题空间，并使用较轻的遮罩保留画面细节。PageHero 的图片参数为必填，防止无意回退到同一张主图。图片来源、工具、参考图和完整生成提示词保存于 `public/images/assets.json`。

About 主图现使用 `public/images/heroes/about-hero-v3.webp`（1672×941，约 190 KB），为精密刀片与现代制造车间的概念宣传场景。使用内置 image_gen 生成，完整提示词及来源记录在 `public/images/assets.json`；旧版检测特写保留为历史资源。

About 正文的 Our Story 与 Quality Commitment 分别使用 `public/images/about/blade-manufacturing-v4.webp` 和 `public/images/about/blade-inspection.webp`（1536×1024），展示刀片磨削加工和百分表尺寸检测的概念宣传场景。加工图第四版校正桌面三片刀片的长边、刃口和孔位排列，保留东亚工人、干净整洁的车间、自然光线与钢材和衣物纹理。使用内置 image_gen 生成，提示词及来源记录在 `public/images/assets.json`；两图统一 3:2 比例并采用 WebP 压缩，原始手册图片及此前加工图保留。

询价表单参考 `nearfastener` 联系页的邮件草稿实现：收集姓名、邮箱、公司、电话 / WhatsApp、主题和需求，点击 **Open Email Draft** 调用客户的邮件应用，收件人为 `info@nearblade.com`，客户审核后自行发送。首页、联系页、产品详情共用此实现；产品详情自动填入产品询价主题。表单保留已填写内容，并提供重新打开草稿及直接联系邮箱的入口。邮件地址和草稿生成逻辑位于 `src/data/contact.ts`。此方式无需服务器邮件接口，客户需要配置邮件应用；网站不保存客户资料。页脚移除未配置的 LinkedIn / Facebook 占位链接，产品链接按对应类别筛选。

构建为每条公开路由生成带独立元数据的 HTML 入口。静态部署应优先读取对应路由的 `index.html`；Nginx 示例及 404 配置见 `docs/DEPLOYMENT.md`。

## 验证

- TypeScript 5.6.2 类型检查通过。
- Vite 5.4.21 生产构建通过，构建文件位于 `dist/`。
- Chrome 实际检查首页视觉、产品列表、分类筛选、产品详情跳转通过。
- 本地资源路径和组件引用检查通过。
- 全站统一大屏主图更新后，`npm run build` 通过；Chrome 检查关于页、产品详情页主图及正文锚点滚动通过。
- 第一轮图片更新经过 Chrome 检查；本轮对新图逐张视觉检查，验证透明通道、尺寸、资源引用和主图唯一性，并重新通过生产构建。

## 当前配色：浅色正文与海军蓝框架

导航和页脚统一使用 Nearblade 品牌标识，由 `src/components/common/BrandLogo.tsx` 共用。横向 NB 图形与小写字标位于 `public/images/brand/nearblade-logo.png`，生成来源及完整提示词见同目录的 `brand.json`；小尺寸浏览器标签使用 `public/favicon.svg`。手机端保留完整品牌名。页面标题、公司介绍、联系页及页脚版权统一使用 Nearblade，公司地址及联系方式沿用现有配置。

参考 `nearfastener`：正文使用白色 / 浅灰底、海军蓝标题、灰蓝正文和铜橙色操作按钮；导航、制造能力数据区及页脚采用深海军蓝。产品透明图使用浅灰摄影棚底，卡片使用白底与细边框；规格、筛选、Blog 和询价区统一采用浅色体系。Hero 保留原有图片、遮罩、浅蓝标题和蓝色按钮，通过局部颜色变量隔离正文配色。主题颜色在 `tailwind.config.js` 与 `src/index.css` 中维护。当前效果以 `npm run build` 后的 `npm run preview` 为准。

`previews/` 中保留的是此前配色方案的静态视觉预览，不代表当前主题。它们不包含筛选、表单或移动导航交互。需要按当前页面重新生成 `previews/light-theme/` 时，先执行 `npm run build`，再执行 `node scripts/preview-theme.mjs`。

全部 7 个产品详情页保留炭灰 Hero 背景、白色标题和浅蓝强调。详情正文改为白底，规格区采用浅灰色，询价区使用铜橙色顶边与白色输入框。

## WhatsApp 联系入口

全站电话和 WhatsApp 统一使用 `+8618966486485`，WhatsApp 链接为 `https://wa.me/8618966486485`。号码统一配置在 `src/data/contact.ts`；联系页、页脚、悬浮按钮及 Organization 结构化数据共用该配置，400 电话已移除。点击 WhatsApp 后在新标签打开会话，消息由访客自行发送；不需要服务器接口或第三方聊天脚本。按钮适配手机安全区域，在产品图片弹窗下方显示，打印时隐藏。

## Blog 模块

`/blog` 为文章列表，`/blog/:slug` 为文章详情。首页、导航与页脚增加 Blog 入口；初始文章涵盖定制询价、产品分类和更换规划。内容在 `src/data/blog.ts` 编辑，详情页包含目录、相关产品、询价入口与相关文章。Blog 正文采用统一的浅灰底和白色卡片，保留独立生成的 Hero 主图；来源与提示词见 `public/images/assets.json`。这是一组静态内容页面，没有管理后台。

历史蓝色主题预览生成脚本：`node scripts/preview-theme.mjs` 和 `node scripts/preview-hero-blue.mjs`。这些方案预览不用于 ECS 发布。

## 图片、产品详情与搜索信息

首页公司介绍与 About 使用同一张已确认的刀片加工图；手机上的装饰框限制在页面范围内。设备页 6 张正文图与首页 3 张设备缩略图改用 `public/images/equipment/` 下的 1448×1086 WebP，统一 4:3 横向构图。它们通过内置 image_gen 对照低清手册照片重建，属于设备类型的宣传参考图，新增细节不是从原始实拍中恢复的事实；原始手册照片保留。设备数据集中于 `src/data/equipment.ts`，来源与完整提示词见 `public/images/assets.json`。

原 Machine Assembly Workshop 栏目现已替换为 Blade Heat Treatment Workshop，使用 `public/images/equipment/blade-heat-treatment-v1.webp`，展示刀片热处理炉、长条刀片装炉托架及圆刀坯。该图为内置 image_gen 生成的 1448×1086 概念参考图，不代表特定温度、工艺参数或认证；完整提示词记录于 `public/images/assets.json`。旧装配场景仅作为历史资源保留。

7 个产品详情各增加原手册的产品族参考图，并通过 `src/data/productGuides.ts` 提供尺寸、安装、兼容性和检测要点。`BladeDimensionDrawing` 使用 SVG 绘制长刀、圆刀、模具、齿刀及刮刀带的尺寸示意。字母表示客户需要提供的尺寸，不构成加工图；没有新增未经确认的尺寸上下限。原有公差改标为目录精度参考，说明报价需明确受控尺寸、基准及检验方法。图库支持缩略图、手机切换和可用 Escape 关闭的放大弹窗。

站点 URL 集中配置在 `site.config.json`，正式地址为 `https://www.nearblade.com`，与线上裸域名跳转一致；正式域名改变时需更新该文件并重新构建。PageMeta 统一设置 canonical（忽略筛选参数）、Open Graph / Twitter 分享信息，以及 Organization、WebSite、WebPage 和面包屑 JSON-LD。产品和文章分别增加 Product、Article 数据；不生成价格、库存、评分或未经确认的认证信息。

`npm run build` 在 Vite 编译后运行 `scripts/build-seo.mjs`，为 16 个公开页面生成独立 HTML 头部、`dist/sitemap.xml`、`dist/robots.txt` 和不允许索引的 `dist/404.html`。元数据在初始 HTML 中可读取，页面正文仍由 React 在客户端渲染。实施参考 [Google JavaScript SEO 文档](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) 和 [Open Graph 协议](https://ogp.me/)。

构建后执行 `npm run test:site`，检查站点地图覆盖、各页面 canonical / 分享图片 / JSON-LD、404 索引规则及图片体积。`npm run test:ecs` 检查原有发布流程。确认构建效果请使用 `npm run preview`；开发服务不提供构建生成的 sitemap 和静态元数据入口。

## 多语言入口

页头地球图标旁的语言选择器参考 `../nearfastener/`，支持英语、简体中文、西班牙语、法语、德语、葡萄牙语、俄语、阿拉伯语和日语。正文、导航、产品详情、文章、图片说明和表单提示使用本地语言包，无需第三方在线翻译脚本；用户输入、电话、邮箱、材质代号和尺寸符号保持原值。阿拉伯语启用 RTL 排版。选择保存在 `nearblade-language` 本地存储中，也支持 `?lang=zh-CN` 等链接参数；加载失败保留当前语言并显示重试提示。语言切换不新增独立的 SEO 路由，canonical 和初始 HTML 元数据仍沿用英文主站。

`content/locales/*.json` 是可编辑的完整语言包。页面新增文案后执行 `npm run i18n:extract` 更新英文键，再补齐另外八种语言；技术标识保存在 `invariants.json`。`npm run build` 会校验页面覆盖、空译文和技术标识，再生成 `public/locales/*.json`；缺失翻译会阻止构建。`npm run test:i18n` 检查语言包、发布文件、React 编译转换和统一电话。

`scripts/localize-jsx.ts` 在 Vite 编译时将原生元素及路由链接交给 `LocalizedElement` 翻译文本和可访问属性，保留 React 对 DOM、表单值和 ref 的管理。修改本地化组件时，需验证语言切换、刷新恢复、内部导航、表单输入保留、图片弹窗及手机端 RTL 布局。

## SEO 关键词规划

`content/seo/pages.json` 为现有 16 个英文 canonical 页面维护搜索意图、主关键词、辅助词、独立标题和描述。首页面向工业刀片制造商采购，目录用于比较产品系列；7 个详情页分别承接闸式刀、摆式刀、V 形折弯下模、圆剪刀、旋转分切刀、瓦楞纸切割刀和薄片刮墨刀。3 篇文章分别面向定制报价准备、刀片类型比较、替换采购计划，并使用产品名称链接到对应详情页。PageMeta 和 WebPage 结构化数据共用规划，新增页面未补规划会阻止 SEO 构建。

本轮同时调整首页、目录、产品 H1 和正文，不堆砌材料牌号作为产品主关键词。新增文案同步更新八种译文。资料来源和范围保存在 `content/seo/research.json`；依据是公开搜索结果、制造商产品用语和现有目录，没有付费搜索量、竞争度或转化数据，也不把所选词视为排名承诺。Google 明确不使用 meta keywords 参与索引和排名，因此优化重点是具体标题、相关正文和可理解的内部链接。参考 [Google 标题说明](https://developers.google.com/search/docs/appearance/title-link)、[摘要说明](https://developers.google.com/search/docs/appearance/snippet)及[支持的元标签](https://developers.google.com/search/docs/crawling-indexing/special-tags)。
