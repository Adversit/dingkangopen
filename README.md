# 丁康 · 夜航实验室

这是 `Adversit/dingkangopen` 的独立静态主页部署目录。初始18个公开页面文件逐字节复用用户已接受外观的夜航实验室 v2；仓库不包含旧版备份、原始图片、私有笔记、账户记录或本机路径。

## 本地与 ESA 构建

使用 Node.js 22，无第三方依赖，无需执行 npm install。

```sh
npm test
npm run check
npm run build
```

构建会检查公开文件白名单、资源引用和脚本语法，并运行笔记过滤与部署边界测试；任一失败即中止。成功后生成 `dist/`，包含完整静态资源与 `deployment.json`。该文件记录 Git 提交和资源哈希，供核对线上版本；初次未提交的本地准备阶段提交号为 null。

`public/` 是本仓库的可编辑网页内容；`public-files.json` 是允许发布的文件清单。新增公开资源时应显式更新清单。`baseline-v2.json` 仅记录初始版本哈希，不冻结后续用户要求的修改。`dist/` 由构建生成，不提交到 Git。

当前字体是 v2 文字的本地子集。新增中文文案时，需要检查字形覆盖并按字体授权更新子集，不应假定现有字体包含所有汉字。

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

`esa.jsonc` 已固化安装、构建和静态目录。未写入应用名称、域名或函数入口，避免借配置定向覆盖现有应用。是否能将原 ZIP 应用直接关联 Git 尚未证实；GitHub 提交完成也不代表 ESA 已接通。

按 [ESA GitHub 导入文档](https://help.aliyun.com/zh/edge-security-acceleration/esa/user-guide/connect-pages-to-github) 连接仓库，生产分支新提交将自动构建并发布。授权应选择 Only select repositories，仅指定本仓库；新增持久权限由用户在实际授权页面核对并确认。无需 GitHub Actions 或额外部署密钥。

若原应用没有关联 Git 的入口，先建立独立 Git 导入应用，在不影响原应用的情况下测试。核对构建日志的提交号及测试网址上的 `deployment.json` 和文件哈希，成功后再迁移 `www.dingkangopen.xyz` 绑定。保留原应用和旧包以便恢复；不得重复添加普通 DNS 记录或改动旧域名。

## 后续修改与验收

只实施用户请求的内容变更。先在工作分支修改 `public/`，运行构建检查、预览和适用的人工／浏览器验收，再把用户授权的版本提交到生产分支。直接推送 main 会触发已连接的 ESA 生产部署，不得将连接授权解释为可以自行改内容上线。

用户已经接受 v2 的本机页面外观。静态和逻辑测试不能替代浏览器视觉、交互、手机、键盘与无代理地域访问验收；这些范围仍须如实报告。
