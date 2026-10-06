# Sites 作品目录实施契约

## 目标与边界

保留夜航实验室的暗墨绿背景、酸橙色交互重点、原 YourWar 主视觉与公开笔记功能，加入全部已核实的 Sites 作品入口。目录面向招聘者快速了解作品、朋友试玩和手机浏览。内容仅是索引，不迁移任何站点后端、数据库、账户、存档或私有笔记，不改变外站访问权限。Node 22、零依赖、ESA `npm run build` / `./dist` 配置保持不变。

## 两遍连接模块审查

第一遍已读取 `public/index.html`、`public/styles.css`、`public/app.js`、`package.json` 与仓库 `AGENTS.md`。调用链为静态 HTML → 延迟加载浏览器脚本 → 本地筛选，构建为 build → check/assets → Node tests → 公开白名单复制 → deployment.json。

第二遍已读取 `public/notes-data.js`、`public/notes-core.js`、`scripts/assets.cjs`、`scripts/check.cjs`、`scripts/build.cjs`、两套现有测试、`public-files.json`、`baseline-v2.json`、`esa.jsonc`、`.gitignore`、`.gitattributes` 与 README。笔记无已发布文章；无后端、持久化、运行时 transport 或迁移任务。侧入口包括首屏 YourWar 链接、关于我作品摘要和原笔记访问说明。公开输出有严格白名单与资源哈希；原图片、操作证据和私有材料必须留在仓库外。现有 app 的导航依赖笔记初始化成功，且笔记使用全局 category/search 选择器，本次须隔离两套控件并使导航独立初始化。

## 唯一数据源与输入输出

- `data/works.json` 是作品名称、顺序、分类、简介、特色、公开状态、访问链接、核验日期与封面路径的唯一事实源。只接收经 Sites 清单和访问核验整理后的公开级信息，不写聊天 ID、站点内部 ID、私有内容或凭据。
- 数据结构为 `{schemaVersion: 1, verifiedAt: ISO8601, works: [...]}`。作品字段限定为 `id`（稳定 slug）、`title`、`category`（game/tool/learning）、`summary`、`features`（短标签数组）、`access`（public/restricted）、`url`（无凭据 HTTPS）、`cover`（src/small/width/height/smallWidth/alt）。所有概念封面的 alt 和可见图注均明确其非实际截图。六个新增封面为 1200×750 / 640×400；两张既有封面复用原本尺寸和小图，由 CSS 按 8:5 裁切显示。
- `scripts/works.cjs` 校验数据和链接，再生成 `public/index.html` 的标记区块。作品卡片、筛选数量、首屏推荐、简介统计和受限笔记说明由同一目录生成；生成内容提交到 Git。`npm run generate` 更新区块，check 校验生成内容是否漂移；构建不会悄悄修正文案差异。
- 浏览器 `public/works-core.js` 只处理分类/关键词的纯函数；`public/works.js` 从预渲染卡片的安全 data 属性读取检索投影并隐藏不匹配项。没有 API 请求、localStorage、Cookie 或用户数据采集。
- `deployment.json` 继续记录完整 Git 提交与公开资源哈希，线上验证由发布协调方执行。

## 同时修改的文件

`data/works.json`、`scripts/works.cjs`、`public/index.html`、`public/styles.css`、`public/app.js`、`public/works-core.js`、`public/works.js`、`public-files.json`、`scripts/check.cjs`、`scripts/build.cjs`、`package.json`、`tests/works.test.cjs`、`README.md`、`docs/TEST-RECORD.md`。封面为公开本地 WebP 资源，图片制作方提供真实文件后加入白名单。`notes-core.js`、`notes-data.js`、ESA 配置与基线快照无需改动。

## 旧逻辑移除

移除只展示口袋游乐场的旧“继续探索”卡片及学习预告卡；其作品入口进入完整目录。移除相应 arcade / notes-feature 专属 CSS（含各断点和打印样式），避免保留隐藏的旧版布局。关于我不再硬编码两个项目。原笔记受限入口由目录生成，避免重复维护。笔记选择器限定到 notebook；导航不再位于笔记数据缺失会提前退出的初始化分支中。

## 验收条件

1. 首次有效盘点的 8 个作品各出现一张卡片，URL 与目录一致，无重复 id/URL；类别统计为 5 游戏、2 工具、1 学习，7 公开、1 受限。若盘点发现变化，应先更新本契约，不能强行凑数。
2. 卡片均包含准确名称、简洁介绍、经核实特色、可见“概念封面”图注、分类、访问状态和可用入口；受限项在操作前说明需要权限，私有正文不进入 HTML。
3. 全部/分类/搜索/组合筛选/清除/空结果均工作；大小写、首尾空白、一个字符、120 字上限有明确行为；作品筛选不影响笔记筛选。
4. 无 JS 时完整目录和外链仍可用，筛选控件隐藏。缺少某个增强脚本不影响静态目录、导航或其他功能。
5. 桌面、手机无横向滚动；标题、按钮、访问说明不截断；图片有尺寸、响应式 srcset 和懒加载；首屏保持优先加载。键盘可达，有可见焦点和筛选结果播报；尊重减少动画。
6. 资源全部本地引用、总包维持 5 MiB 以下。保留字体授权，并为现有中文字库未覆盖的新文案提供本地系统字形回退。
7. Node 测试、静态检查、构建通过，并将实际结果写入 TEST-RECORD。浏览器人工/自动验收与线上验收分别记状态，不能用静态通过替代。

## 失败分支

- 空输入或纯空白：按所选类别显示全部；找不到：显示清晰空结果和清除按钮；未知类别：纯函数返回无结果，UI 不生成未知选项。
- 数据为空、重复、字段越界、非法链接、缺失封面、生成区块漂移：构建失败，禁止发布；不删除或伪造数据以通过检查。
- JS 不可用/初始化顺序异常：默认静态卡片全部可见；增强控件只有初始化完成后显示，无网络重试需求。
- 外站受限/不可达：保留核实过的访问状态与真实入口；不绕过登录，不据本机代理访问推断中国大陆无代理可达。
- 图片失败：文字、分类和访问入口独立存在；图片使用固定比例的背景占位，alt 明确含义。
- Windows：路径操作使用明确仓库根目录，写文件 UTF-8 并回读；不根据控制台乱码修复文件；不新增递归清理或依赖安装。
- 新远端提交、ESA 未触发或域名版本不匹配：交由主协调方停止发布/报告阻塞，不强推，不修改 DNS、SSL 或重建应用。

## 实施清单

- [x] 两遍连接模块审查与契约完成。
- [x] 收到并审查经核实的目录数据和封面。
- [x] 建立数据校验、静态生成、独立增强与响应式样式。
- [x] 移除旧卡片及控件耦合，保留公开笔记。
- [x] 实际测试、构建、UTF-8 回读和结果登记。
- [ ] 主协调方完成浏览器与线上验收，登记证据。
