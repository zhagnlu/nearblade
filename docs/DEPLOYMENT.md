# ECS 静态部署

## 编译、提交与发布

```text
开发分支修改源码 → git commit
  → npm run build:ecs（TypeScript 检查 + Vite 编译）
  → npm run preview（浏览器检查 dist/）
  → npm run publish:ecs（静态产物提交并推送到 push_remote）
  → GitHub Actions（SSH + rsync）→ ECS → Nginx
```

与 `nearfastener` 使用相同的开发/发布分支模式，本项目直接使用 Vite 的 `dist/`。服务器无需 Node.js、npm 或源码。发布分支根目录包含 `index.html`、`assets/`、`images/` 和 `.github/workflows/deploy-ecs.yml`，不包含 `dist/` 外层目录、源码或构建标记。

开发和发布都从 `main` 或其他开发分支执行，不要切换到 `push_remote` 开发或将源码分支合并进去。开发分支按平常方式提交、推送；只推送开发分支不会部署。

```bash
npm ci
# 修改源码，检查并 git commit 后：
npm run build:ecs
npm run preview -- --port 8000
# 打开 http://127.0.0.1:8000/，检查首页、产品、Blog 及详情路由；Ctrl+C 结束
npm run publish:ecs -- --dry-run
npm run publish:ecs
```

构建与发布前要求工作区干净。构建成功记录对应源码 commit；源码提交改变后必须重新构建和预览。普通 `npm run build` 不生成 ECS 构建标记。不要手工编辑 `dist/`；标记核对源码提交，不校验后来手改的产物。

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

Nginx 站点配置示例，将 `example.com` 换成实际域名，已有 HTTPS 配置保持原有证书设置：

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/nearblade;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        try_files $uri =404;
    }

    location /images/ {
        try_files $uri =404;
    }
}
```

本项目使用 React Router，`/products/:id`、`/blog/:slug` 等页面直接访问或刷新时必须回退到 `index.html`。不能照搬 `nearfastener` 页面路由的 `=404` 配置。静态资源缺失则返回 404。

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

沿用单目录同步，没有 `releases/current`、版本保留或自动回滚，同步期间可能短暂出现新旧文件混合。发布完成后在 GitHub Actions 查看结果，检查线上首页、产品详情、Blog 详情及刷新访问。

| 现象 | 检查 |
| --- | --- |
| 工作区不干净 | 先检查并提交源码修改，再 build:ecs |
| 构建标记缺失或过期 | 重新 build:ecs 并预览 |
| SSH 私钥格式错误 / libcrypto | 私钥完整、真实换行、无密码短语 |
| Permission denied (publickey) | 用户、私钥及 authorized_keys 是否匹配 |
| Host key verification failed | known_hosts 主机、公钥、端口是否一致 |
| rsync 权限错误 | 部署用户是否能修改整个站点目录 |
| 刷新详情页 404 | Nginx 是否回退到 /index.html |
| workflow 未执行 | 是否推送 push_remote，且该分支包含 workflow |

`npm run test:ecs` 使用临时本地仓库验证发布隔离、构建提交检查、首次发布、更新、清理旧产物及 dry-run，不连接真实 ECS。

当前询价表单仍为演示交互，部署不会自动增加邮件或后台 API。
