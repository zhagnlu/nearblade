# 独立语言页面设计与实施

日期：2026-11-15；2026-11-16更新尾斜杠规则。多语言开发已提交至 `ce18202`；当前尾斜杠调整仅在本地，尚未提交或部署。

## URL 与语言规则

九种语言使用同一域名下的目录：`en`、`zh-cn`、`es`、`fr`、`de`、`pt`、`ru`、`ar`、`ja`。HTML / hreflang 的简体中文代码为 `zh-CN`，URL 使用小写 `zh-cn`。全部页面地址统一带尾斜杠，如 `/en/`、`/en/products/`、`/zh-cn/products/pb-double-v-die/`。图片、JS、CSS和JSON等文件地址保持原样，不追加斜杠。后半段产品 ID、文章 slug 和目录分类不变，图片与脚本共用。

URL 是语言的唯一来源。直接访问英语页面，即使 localStorage 曾选择中文，也必须呈现英语。语言偏好仅记录，不自动按浏览器语言或 IP 强制跳转。根路径固定 301 到 `/en/`。

语言菜单使用原生 details 和各语言自称的真实链接，无 JS 时也可操作。切换保留当前产品／文章、筛选参数、来源参数和锚点，移除旧 `lang` 参数。普通点击先加载目标词典，再由 React Router 导航，保留当前页表单及图库状态；加载失败留在原页并提示，可再次选择重试。Ctrl/Cmd 点击和新标签页使用独立 URL。站内链接沿用当前语言。

## 页面生成与搜索信息

`src/i18n/paths.ts` 统一语言前缀与对应页链接；`routing.ts` 为旧链接和规范化的共用规则。`LanguageProvider` 从请求路径和当前页面嵌入的词典初始化，不等待 effect 才翻译。后续切换按需加载 `/locales/{code}.json`，缓存已加载词典。

`scripts/build-seo.mjs` 为现有 43 页 × 9 种语言生成 387 个可索引 HTML，另有各语言 404 和旧地址兜底文件。页面首个 HTTP 响应即包含该语言正文、H1、alt、标题、描述和结构化数据。内嵌 JSON 转义 `<`，与客户端首屏共用同一词典，避免英文闪烁和 hydration 不一致。通用 404 文件有 noindex，并在客户端按实际未知路径重新渲染。

英文沿用已有 SEO 规划；其他语言的标题与描述复用已翻译的可见页面、产品及文章文案，由 `src/i18n/seo.ts` 统一生成，不另写未经确认的产品承诺。后续可按语言补充独立关键词研究；本次不是九个市场的关键词研究。

每页 canonical 指向自身语言地址；hreflang 包含九种语言及 x-default（同页英文），相互返回链接。HTML 设置 lang 和 dir，阿拉伯语为 rtl。分享元数据、面包屑、产品／文章文字、WebPage.inLanguage 和站内 URL 同步本地化。sitemap 仅收录387个有效语言地址，排除旧址、别名、退役产品和404。

## 旧地址迁移

| 请求 | 301 目标 |
| --- | --- |
| `/` | `/en/` |
| `/products/sb-001` | `/en/products/sb-001/` |
| `/products/sb-001?lang=zh-CN&source=old` | `/zh-cn/products/sb-001/?source=old` |
| `/products/sb-002/index.html?lang=ja` | `/ja/products/sb-001/` |
| `/de/products/?lang=ja` | `/de/products/` |
| `/en` 或 `/en/index.html` | `/en/` |

已经有语言前缀时，路径语言优先于旧参数。未知语言和未知产品返回真实404，不伪装为首页。预览服务支持 GET / HEAD，已知路由才进行迁移，缺失资源仍为404。

## Nginx 与发布

构建同步生成 `deploy/multilingual-maps.conf`，必须 include 在 Nginx `http {}` 内；`deploy/nginx.conf.example` 的站点规则合入现有提供正文的 server 块。生成文件包含有效页面、旧页和退役 ID 的目标表，以及规范地址判定、语言参数清理和语言404映射。单个历史 `lang` 参数位于查询头、中、尾时均保留其他参数；多个重复 `lang` 的异常地址在 Nginx 中可能需要多次规范化，预览／浏览器规则会一次移除全部。迁移验收以正常历史单参数 URL 为准。

不得直接覆盖整份生产 Nginx 配置；保留现有证书、CDN回源头、HTTPS/www规则。现有 GitHub Actions 只同步静态产物，不应用这些服务器配置。页面URL现在沿用现有服务器的目录尾斜杠习惯，不再要求关闭自动添加目录斜杠。旧无语言前缀地址和 `?lang=` 的HTTP 301迁移仍需服务器规则；单纯发布语言目录文件不等于这些迁移规则已生效。HTML兜底的 meta refresh 不是服务器301。

服务器执行 `nginx -t` 后 reload，再核对新路径、全部迁移入口、保留查询参数、未知路由404和资源响应。源代码／部署配置与静态产物的恢复需一起考虑：回滚到上一发布分支提交时同时还原相应服务器规则，避免旧页面被导向不存在的新目录。本地无 Nginx 可执行文件，因此本轮不声称服务器语法及真实 Nginx HTTP 验收通过。

## 验证入口

- `npm test`：构建、目录、多语言词典、全部语言静态HTML、客户端接管、切换／后退、表单与图库交互、预览HTTP和既有发布流程。
- `npm run check:seo -- http://127.0.0.1:8000 /tmp/nearblade-localized-seo.json`：全部387页的原始HTML、canonical、hreflang、语言、站内链接、别名／退役地址及404。
- 浏览器验收：简体中文、英语、阿拉伯语首页／产品／文章，手机和桌面语言菜单、同页切换、刷新、后退、锚点、筛选、表单输入、图库放大。

本轮自动化结果和浏览器可用性见交付说明。自动化 DOM 检查不能代替实际浏览器视觉验收。

依据：[Google多语言网站](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)、[hreflang规范](https://developers.google.com/search/docs/specialty/international/localized-versions)、[Nginx map](https://nginx.org/en/docs/http/ngx_http_map_module.html)。

## 本轮验收记录（2026-11-15）

- `npm run build`：成功，387个可索引语言页及各语言404生成完成。
- 最终 `node --test tests/*.test.mjs`：43项通过、0失败。覆盖九种语言首响应正文和元数据、六种直接访问／接管场景、同页切换、URL优先于已保存偏好、后退、筛选、表单保留、图库、查询／锚点保留、并发切换和词典下载失败后重试。
- 重启8000端口预览后执行 `npm run check:seo -- http://127.0.0.1:8000 /tmp/nearblade-localized-seo.json`：387页检查通过，0问题。报告与控制台日志留在 `/tmp/`，不纳入公开产物。
- `git diff --check`：通过。
- 真实Chrome视觉检查：未完成。浏览器工具能列出标签页，但标签绑定失败；原生Chrome回报 `cgWindowNotFound`。此限制不影响自动化DOM／HTTP验证，但不能据此宣称桌面／手机视觉通过。
- 真实Nginx语法／HTTP检查：未执行，本机无Nginx；生成配置待在部署前核验和应用。
- 本轮未提交、推送或部署，线上仍保留上一次版本。供用户检查的本地预览持续运行于8000端口。

## 2026-11-16 尾斜杠统一

用户要求先统一尾斜杠。全部页面链接、语言切换、canonical、hreflang、分享地址、面包屑和sitemap改用带尾斜杠URL；不带尾斜杠和显式index.html作为入口别名，预览和生成的服务器规则都直接301至带尾斜杠地址。查询参数和锚点仍放在斜杠之后。仅调整URL规范，不改产品身份、词典、图片及文件资源路径。本轮不部署，也不修改线上Nginx。上方11月15日验收记录保留为当时快照。此前管理员迁移包依据旧无尾斜杠方案制作，不应再直接应用；后续如需服务器迁移，应基于当前源码重新生成。

本轮验证：`npm test` 构建和43项测试全部通过；重启8000端口预览后，387页独立HTTP/SEO审计通过，0问题，报告 `/tmp/nearblade-trailing-slash-seo.json`。未提交、推送或部署。
