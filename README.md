# 🎬 汪汪队立大功：电影级救援行动

一个互动式宠物管理游戏，支持 AI 换宠、特效、动作、技能和装备系统。

## ✅ 已完成部署！

### API 地址
```
https://paw-patrol-ai.812217700.workers.dev
```

### 前端已配置
`index.html` 中的 `API_BASE_URL` 已更新为上述地址。

---

## 🚀 部署到 GitHub Pages

### 步骤 1：上传文件到 GitHub

将 `index.html` 上传到您的 GitHub 仓库。

**方法 1：网页上传**
1. 在 GitHub 创建新仓库
2. 点击 "Add file" → "Upload files"
3. 拖入 `index.html`
4. 点击 "Commit changes"

**方法 2：Git 命令**
```bash
git init
git add index.html
git commit -m "添加汪汪队游戏"
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

### 步骤 2：启用 GitHub Pages

1. 进入仓库 Settings
2. 点击左侧 **Pages**
3. Source 选择 **main** 分支
4. 点击 **Save**

### 步骤 3：访问游戏

几分钟后，您的游戏将在以下地址可用：
```
https://你的用户名.github.io/仓库名/
```

---

## 🎮 功能列表

- 🤖 **AI 换宠** - 生成专属宠物形象
- 🎭 **50种特效** - 粒子、光环、动画
- 🎬 **100种动作** - 基础动作、情绪表情
- ⚡ **技能系统** - 每个宠物专属技能
- 🛒 **装备商店** - 60件可购买装备
- 🏆 **PK榜单** - 队伍积分竞争
- 🌟 **终极觉醒** - 等级 10 可觉醒

---

## 📁 项目文件

```
.
├── index.html              # 前端主文件 → 上传到 GitHub Pages
├── server.js               # 本地开发服务器
├── package.json
└── api/
    └── cloudflare/         # 已部署到 Cloudflare Workers
        └── src/index.ts
```

---

## 💰 费用说明

| 服务 | 费用 |
|------|------|
| GitHub Pages | ✅ 免费 |
| Cloudflare Workers | ✅ 免费（每天 10 万次请求） |

---

## 🔧 本地测试

```bash
pnpm install
pnpm dev
# 访问 http://localhost:5000
```

---

## 📄 License

MIT License
