# 丁康 · 夜航实验室

这是 `Adversit/dingkangopen` 的静态个人站。保留夜航实验室 v2 的主视觉和公开笔记，v2.1 加入 8 个 Sites 作品入口（5 游戏、2 工具、1 学习），其中 7 个公开、1 个受限。仓库不包含旧版备份、原始图片、私有笔记或账户记录。

## 本地与 ESA 构建

使用 Node.js 22，无第三方依赖，无需执行 npm install。

```sh
npm test
npm run check
npm run build
```

构建会校验作品目录生成结果、公开文件白名单、资源引用和脚本语法，并运行作品/笔记过滤与部署边界测试；任一失败即中止。成功后生成 `dist/`，包含完整静态资源与 `deployment.json`。该文件记录构建时的 Git 提交和资源哈希，供核对线上版本；有未提交修改时必须同时比对资源哈希，不能只看提交号。

`public/` 是本仓库的可编辑网页内容；`public-files.json` 是允许发布的文件清单。新增公开资源时应显式更新清单。`baseline-v2.json` 仅记录初始版本哈希，不冻结后续用户要求的修改。`dist/` 由构建生成，不提交到 Git。

当前字体是 v2 文字的本地子集。新增中文字形由本机 Microsoft YaHei / PingFang SC 等中文字体回退补足；不请求外部字体服务。原字体的 OFL 授权随公开资源保留。

## 作品维护

`data/works.json` 是作品信息的唯一来源。名称、简介、标签和权限状态仅使用已经核实的公开级信息；不写内部站点 ID、访问凭据、聊天记录或私有文章。`scripts/works.cjs` 校验字段、去重、HTTPS 链接、访问边界与本地概念封面后，生成 HTML 中的 `generated:*` 区域：

```sh
npm run generate
npm test
npm run build
```

提交数据和生成后的 `public/index.html`，不要手工改生成区块。目录不依赖 JavaScript 即可浏览；浏览器脚本只增强分类与关键词筛选，作品和笔记筛选相互独立。无客户端 API、存储或原站数据迁移。

新增资源需要加入 `public-files.json`。封面均为本地 WebP，包含响应式小图、固定尺寸和懒加载；概念封面在图注与替代文字中明确标注，不代表实际产品截图。来源见 [素材记录](docs/ASSET-SOURCES.md)，本次契约见 [目录实施说明](docs/sites-gallery-spec.md)，实际验证见 [测试记录](docs/TEST-RECORD.md)。

## ESA 配置

| 配置 | 值 |
| --- | --- |
| GitHub 仓库 | Adversit/dingkangopen |
| 生产分支 | main |
| 根目录 | / |
| Node.js | 22 |
| 安装命令 | 留空；esa.jsonc 中为空字符串 |
| 构建命令 | npm run build |
| 静态资源目录 | ./dist |
| 函数入口、环境变量、AccessKey | 均不需要 |

现有 ESA Git 应用为 `dingkangopen`，已关联本仓库 `main`，正式域为 `https://www.dingkangopen.xyz/`。本轮前已验证上线的基线提交为 `55d899c994d38cd412c79e4a2295a74b937e6180`。`esa.jsonc` 固化安装、构建和静态目录；无需 GitHub Actions、AccessKey 或额外部署密钥。

保留现有应用、DNS、SSL 与域名绑定，不删除或重建应用。推送后必须分别核对 ESA 的对应提交构建/生产发布记录、正式域的 `deployment.json` 和实际资源哈希。GitHub 推送成功不等于上线成功，任何未完成的验证都需在测试记录明确标注。

## 后续修改与验收

只实施用户请求的内容变更。修改目录源、`public/` 与有关构建文件后，运行构建检查、预览和适用的人工／浏览器验收，再把用户授权的版本提交到生产分支。推送前再次读取远端 main，保留无关改动，不强制推送。直接推送 main 会触发已连接的 ESA 生产部署，不得将连接授权解释为可以自行改内容上线。

用户已经接受 v2 的本机页面外观。静态和逻辑测试不能替代浏览器视觉、交互、手机、键盘与无代理地域访问验收；这些范围仍须如实报告。
