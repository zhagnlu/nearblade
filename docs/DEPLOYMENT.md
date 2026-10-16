# ECS 静态部署

## 编译、提交与发布

```text
开发分支修改源码 → git commit
  → npm run build:ecs（npm test：构建 + SEO / 多语言 / 发布流程检查）
  → npm run preview（浏览器检查 dist/）
  → npm run publish:ecs（静态产物提交并推送到 push_remote）
  → GitHub Actions（SSH + rsync）→ ECS → Nginx
```

与 `nearfastener` 使用相同的开发/发布分支模式和构建测试入口，本项目直接使用 Vite 的 `dist/`，无需该参考站的 Next 静态导出步骤。服务器无需 Node.js、npm 或源码。发布分支根目录包含 `index.html`、各路由的 `index.html`、`404.html`、`assets/`、`images/`、`locales/`、`sitemap.xml`、`robots.txt` 和 `.github/workflows/deploy-ecs.yml`，不包含 `dist/` 外层目录、源码或构建标记。

开发和发布都从 `main` 或其他开发分支执行，不要切换到 `push_remote` 开发或将源码分支合并进去。开发分支按平常方式提交、推送；只推送开发分支不会部署。

```bash
# 本机构建使用 Node.js >=22.13.0；ECS 不需要 Node.js
npm ci
# 修改源码，检查并 git commit 后：
npm run build:ecs
npm run preview -- --port 8000
# 打开 http://127.0.0.1:8000/，检查首页、产品、Blog 及详情路由；Ctrl+C 结束
npm run publish:ecs -- --dry-run
npm run publish:ecs
```

`npm test` 可在开发工作区执行，会先构建，再运行站点、语言包和发布流程测试。`build:ecs` 调用相同入口，但要求构建前后工作区均干净，且开发 commit 在整个过程中不变；只有全部检查通过才生成发布标记。构建或测试失败会使旧标记失效。构建成功记录对应源码 commit；源码提交改变后必须重新构建和预览。普通 `npm run build`、`npm test` 不生成 ECS 构建标记。不要手工编辑 `dist/`；标记核对源码提交，不校验后来手改的产物。

图片、页面内容、语言源文件及生成的 `public/locales/` 均属于网站源码，应一并审核提交。测试截图和浏览器缓存位于已忽略的 `output/`、`.playwright-cli/`，不会影响干净工作区检查。

发布使用独立临时 Git 仓库，不修改当前开发分支。第一次自动创建远程 `push_remote`，之后保留发布历史并移除过时文件。没有产物变化时不创建提交；不使用强制推送，远程并发修改会导致推送拒绝。`--dry-run` 仍读取远程分支和准备本地发布提交，但不推送、不触发部署。

## 配置 ECS

服务器安装 Nginx、SSH 服务和 rsync。例如 Ubuntu/Debian：

```bash
sudo apt-get update
sudo apt-get install nginx rsync
# 如果 deploy 已存在，跳过 useradd
sudo useradd -m -s /bin/bash deploy
sudo install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
sudo touch /home/deploy/.ssh/authorized_keys
sudo chown deploy:deploy /home/deploy/.ssh/authorized_keys
sudo chmod 600 /home/deploy/.ssh/authorized_keys
sudo mkdir -p /var/www/nearblade
sudo chown -R deploy:deploy /var/www/nearblade
sudo chmod 755 /var/www/nearblade
```

只对本网站目录授权；目录中已有文件会被发布覆盖或清理。部署用户不需要 sudo。ECS 安全组及系统防火墙需允许 SSH 和网站 HTTP/HTTPS 端口。

Nginx 站点配置示例，将 `example.com` 换成实际域名，已有 HTTPS 配置保持原有证书设置。可直接参考仓库内的 [deploy/nginx.conf.example](../deploy/nginx.conf.example)，该模板默认对应 `site.config.json` 的 `www.nearblade.com` 和 `/var/www/nearblade`，沿用线上从裸域名到 `www` 的跳转：

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/nearblade;
    index index.html;

    # build-seo.mjs generates an HTML entry for every public route.
    location / {
        try_files $uri/index.html $uri =404;
    }

    error_page 404 /404.html;
    location = /404.html {
        internal;
    }

    location /assets/ {
        try_files $uri =404;
    }

    location /images/ {
        try_files $uri =404;
    }

    location /locales/ {
        try_files $uri =404;
    }
}
```

构建为 16 条公开路由生成独立 HTML 入口，包含对应的 canonical、分享信息及 JSON-LD，正文由 React Router 渲染。上述规则优先读取路由入口（例如 `/products/sb-001/index.html`），未知路由返回带 noindex 的 404 页面并保留 HTTP 404 状态。已有站点若仍使用回退到根 `index.html` 的配置，需同步更新 Nginx，才能让直接访问不同页面时获得各自的初始元数据。

部署前核对根目录 `site.config.json` 的正式域名，再执行构建。`dist/sitemap.xml` 和 `dist/robots.txt` 随产物一起发布；没有编造页面修改日期或产品价格。

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## SSH 与 GitHub Secrets

在本机生成专用部署密钥；如果同名文件已存在，不要覆盖：

```bash
ssh-keygen -t ed25519 -C "nearblade-github-ecs" -f ~/.ssh/nearblade_ecs_deploy -N ""
cat ~/.ssh/nearblade_ecs_deploy.pub
```

通过可信的 ECS 控制台终端，将上述公钥完整一行追加到 `/home/deploy/.ssh/authorized_keys`，保留已有公钥。私钥留在受控本地位置和 GitHub Secrets，不写入仓库。

GitHub 仓库 → Settings → Secrets and variables → Actions，配置：

| Secret | 内容 |
| --- | --- |
| `ECS_HOST` | ECS 公网 IPv4 或主机名，不带协议 |
| `ECS_USER` | 有整个站点目录读写权限的 SSH 用户，例如 `deploy` |
| `ECS_SSH_KEY` | 完整无密码短语私钥，保留 BEGIN/END 和真实换行，不是 `.pub` 文件 |
| `ECS_KNOWN_HOSTS` | 经核验的 SSH 服务器主机公钥记录 |
| `ECS_PORT` | 可选，默认 `22` |
| `ECS_DEPLOY_PATH` | 可选，默认 `/var/www/nearblade`，仅用于本网站的绝对目录 |

Mac 可使用 `pbcopy < ~/.ssh/nearblade_ecs_deploy` 复制私钥后粘贴到 Secret。脚本会校验私钥格式并处理 CRLF 换行，不输出私钥。

通过可信的 ECS 控制台终端读取服务器主机公钥：

```bash
cat /etc/ssh/ssh_host_ed25519_key.pub
```

将 `ECS_HOST` 的实际值与上述公钥类型和完整公钥组合成 `ECS_KNOWN_HOSTS`，示例仅为占位：

```text
example.com ssh-ed25519 完整服务器主机公钥
# 非 22 端口：
[example.com]:2222 ssh-ed25519 完整服务器主机公钥
```

这是服务器身份公钥，不是 deploy 用户的公钥。多个网站可以共用已有部署用户，但 `ECS_DEPLOY_PATH` 必须分别设置，不能指向 `nearfastener` 的网站目录。

## 部署行为与检查

workflow 只响应 `push_remote` 推送，手动 Run workflow 也必须选择该分支。部署只同步文件，不修改 Nginx 配置。rsync 会删除部署目录中过时的网站文件，保留 `.well-known/`、`.user.ini`，不上传 `.git/` 和 `.github/`。目录和文件权限分别设为 755 和 644。

服务器预检会分别报告 SSH 登录、rsync、目录创建和写权限问题。若网站根目录不可写，会先尝试恢复当前用户自有目录的写权限，或利用服务器已有的免密 sudo 更正该目录本身的属主；不会修改父目录或其他站点，也不会配置新的 sudo 权限。账号没有相应权限时仍需管理员在 ECS 控制台为该站点目录授权。

沿用单目录同步，没有 `releases/current`、版本保留或自动回滚，同步期间可能短暂出现新旧文件混合。发布完成后在 GitHub Actions 查看结果，检查线上首页、产品详情、Blog 详情及刷新访问。

| 现象 | 检查 |
| --- | --- |
| 工作区不干净 | 先检查并提交源码修改，再 build:ecs |
| 构建标记缺失或过期 | 重新 build:ecs 并预览 |
| SSH 私钥格式错误 / libcrypto | 私钥完整、真实换行、无密码短语 |
| Permission denied (publickey) | 用户、私钥及 authorized_keys 是否匹配 |
| Host key verification failed | known_hosts 主机、公钥、端口是否一致 |
| rsync 权限错误 | 部署用户是否能修改整个站点目录 |
| 刷新详情页 404 | 发布产物是否包含该路由的 index.html，Nginx 是否优先读取 $uri/index.html |
| workflow 未执行 | 是否推送 push_remote，且该分支包含 workflow |

`npm run test:ecs` 使用临时本地仓库验证完整构建测试入口、失败标记清理、构建中提交变化、发布隔离、首次发布、更新、清理旧产物，以及 SEO 页面和语言包的静态发布，不连接真实 ECS。

当前询价表单通过 `mailto:` 打开访客的邮件应用并准备询盘，由访客核对发送；电话及 WhatsApp 共用 `src/data/contact.ts` 中的号码。ECS 不需要报价 API，部署也不会增加后台邮件服务。
