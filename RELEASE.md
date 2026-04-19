# 发布到 GitHub 指南

## 前提条件

1. 已安装 Git
2. 有 GitHub 账号
3. 已生成 .vsix 文件 (`readme-manager-1.0.0.vsix`)

## 发布步骤

### 步骤 1: 初始化 Git 仓库（如果还没有）

```bash
# 检查是否已经是 Git 仓库
git status

# 如果不是，初始化
git init
```

### 步骤 2: 添加所有文件

```bash
# 添加所有文件到暂存区
git add .

# 查看将要提交的文件
git status

# 提交
git commit -m "Initial commit: README Manager v1.0.0

- Auto-discovery and indexing of README files
- Tree view in Explorer sidebar
- Quick navigation with Ctrl+Shift+R
- Preview support for Markdown files
- Manual refresh functionality
- Multi-workspace support
- Customizable file patterns and exclusion rules"
```

### 步骤 3: 在 GitHub 上创建仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `readme-manager`
   - **Description**: `Centralized README file management and navigation for VSCode`
   - **Visibility**: Public（推荐）或 Private
   - **不要**勾选 "Initialize this repository with a README"（我们已经有了）
3. 点击 "Create repository"

### 步骤 4: 连接到 GitHub 仓库

```bash
# 添加远程仓库（替换 YOUR-USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR-USERNAME/readme-manager.git

# 或者使用 SSH（如果已配置 SSH key）
git remote add origin git@github.com:YOUR-USERNAME/readme-manager.git

# 验证远程仓库
git remote -v
```

### 步骤 5: 推送代码到 GitHub

```bash
# 重命名分支为 main（如果需要）
git branch -M main

# 推送代码
git push -u origin main
```

### 步骤 6: 创建 Release

#### 方法 A: 使用 Git 命令行

```bash
# 创建标签
git tag -a v1.0.0 -m "Release v1.0.0

README Manager - Centralized README file management for VSCode

Features:
- Auto-discovery and indexing of README files
- Tree view in Explorer sidebar
- Quick navigation (Ctrl+Shift+R)
- Preview support for Markdown files
- Manual refresh functionality
- Multi-workspace support
- Customizable configuration"

# 推送标签
git push origin v1.0.0
```

#### 方法 B: 使用 GitHub CLI（如果已安装）

```bash
# 创建 release 并上传 .vsix 文件
gh release create v1.0.0 readme-manager-1.0.0.vsix \
  --title "README Manager v1.0.0" \
  --notes-file CHANGELOG.md
```

#### 方法 C: 使用 GitHub 网页界面

1. 访问你的仓库页面
2. 点击右侧的 "Releases"
3. 点击 "Create a new release"
4. 填写信息：
   - **Tag version**: `v1.0.0`
   - **Release title**: `README Manager v1.0.0`
   - **Description**: 从 CHANGELOG.md 复制内容
5. 上传 `readme-manager-1.0.0.vsix` 文件
6. 点击 "Publish release"

### 步骤 7: 更新 README.md 中的链接

在 README.md 中更新以下内容：

```markdown
## Installation

### From GitHub Release

1. Download the latest `.vsix` file from [GitHub Releases](https://github.com/YOUR-USERNAME/readme-manager/releases)
2. Open VSCode
3. Go to Extensions view (Ctrl+Shift+X / Cmd+Shift+X)
4. Click the "..." menu at the top of the Extensions view
5. Select "Install from VSIX..."
6. Choose the downloaded `.vsix` file
```

更新后提交：

```bash
git add README.md
git commit -m "docs: update installation links"
git push
```

## 验证发布

### 1. 检查仓库

访问 `https://github.com/YOUR-USERNAME/readme-manager` 确认：
- ✅ 所有文件已上传
- ✅ README.md 正确显示
- ✅ LICENSE 文件存在

### 2. 检查 Release

访问 `https://github.com/YOUR-USERNAME/readme-manager/releases` 确认：
- ✅ v1.0.0 release 存在
- ✅ .vsix 文件已上传
- ✅ Release 说明完整

### 3. 测试安装

```bash
# 从 GitHub 下载 .vsix 文件
# 然后安装
code --install-extension readme-manager-1.0.0.vsix
```

## 后续更新

当你需要发布新版本时：

```bash
# 1. 更新版本号（在 package.json 中）
# 2. 更新 CHANGELOG.md
# 3. 提交更改
git add .
git commit -m "chore: bump version to 1.1.0"
git push

# 4. 重新打包
npm run package

# 5. 创建新标签和 release
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin v1.1.0

# 6. 在 GitHub 上创建新 release 并上传新的 .vsix
```

## 推广你的扩展

### 1. 添加徽章到 README.md

```markdown
![Version](https://img.shields.io/github/v/release/YOUR-USERNAME/readme-manager)
![License](https://img.shields.io/github/license/YOUR-USERNAME/readme-manager)
![Downloads](https://img.shields.io/github/downloads/YOUR-USERNAME/readme-manager/total)
```

### 2. 添加主题标签

在 GitHub 仓库页面，点击 "About" 旁边的齿轮图标，添加主题：
- `vscode-extension`
- `readme`
- `documentation`
- `markdown`
- `navigation`

### 3. 分享

- 在社交媒体分享
- 在相关论坛发布
- 添加到 awesome-vscode 列表

## 故障排除

### 问题：推送被拒绝

```bash
# 如果远程有更改，先拉取
git pull origin main --rebase
git push
```

### 问题：忘记添加文件

```bash
# 添加遗漏的文件
git add forgotten-file.txt
git commit --amend --no-edit
git push --force
```

### 问题：需要修改最后一次提交

```bash
# 修改文件后
git add .
git commit --amend
git push --force
```

## 完成！

恭喜！你的扩展现在已经在 GitHub 上了！

用户可以通过以下方式安装：
1. 从 GitHub Releases 下载 .vsix
2. 使用 `code --install-extension` 命令
3. 在 VSCode 中从 VSIX 安装

---

**需要帮助？** 查看 [GitHub 文档](https://docs.github.com/en/repositories) 或提交 Issue。
