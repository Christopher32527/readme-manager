#!/bin/bash

# README Manager - GitHub 发布脚本
# 使用方法: ./scripts/publish.sh YOUR-GITHUB-USERNAME

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查参数
if [ -z "$1" ]; then
    echo -e "${RED}错误: 请提供 GitHub 用户名${NC}"
    echo "使用方法: ./scripts/publish.sh YOUR-GITHUB-USERNAME"
    exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME="readme-manager"
VERSION="1.0.0"

echo -e "${GREEN}=== README Manager GitHub 发布脚本 ===${NC}\n"

# 步骤 1: 检查 Git 状态
echo -e "${YELLOW}步骤 1: 检查 Git 状态...${NC}"
if [ -d .git ]; then
    echo "✓ Git 仓库已存在"
else
    echo "初始化 Git 仓库..."
    git init
    echo "✓ Git 仓库已初始化"
fi

# 步骤 2: 检查是否有未提交的更改
echo -e "\n${YELLOW}步骤 2: 检查未提交的更改...${NC}"
if [ -n "$(git status --porcelain)" ]; then
    echo "发现未提交的更改，正在添加..."
    git add .
    git commit -m "Initial commit: README Manager v${VERSION}

- Auto-discovery and indexing of README files
- Tree view in Explorer sidebar
- Quick navigation with Ctrl+Shift+R
- Preview support for Markdown files
- Manual refresh functionality
- Multi-workspace support
- Customizable file patterns and exclusion rules"
    echo "✓ 更改已提交"
else
    echo "✓ 没有未提交的更改"
fi

# 步骤 3: 检查远程仓库
echo -e "\n${YELLOW}步骤 3: 配置远程仓库...${NC}"
if git remote | grep -q origin; then
    echo "✓ 远程仓库已配置"
    REMOTE_URL=$(git remote get-url origin)
    echo "  当前远程: $REMOTE_URL"
else
    echo "添加远程仓库..."
    git remote add origin "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
    echo "✓ 远程仓库已添加: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
fi

# 步骤 4: 推送到 GitHub
echo -e "\n${YELLOW}步骤 4: 推送代码到 GitHub...${NC}"
echo "正在推送到 main 分支..."
git branch -M main
if git push -u origin main; then
    echo "✓ 代码已推送到 GitHub"
else
    echo -e "${RED}✗ 推送失败${NC}"
    echo "可能的原因："
    echo "1. GitHub 仓库不存在 - 请先在 GitHub 上创建仓库"
    echo "2. 认证失败 - 请检查 GitHub 凭据"
    echo "3. 远程有冲突 - 尝试: git pull origin main --rebase"
    exit 1
fi

# 步骤 5: 创建标签
echo -e "\n${YELLOW}步骤 5: 创建版本标签...${NC}"
if git tag | grep -q "v${VERSION}"; then
    echo "✓ 标签 v${VERSION} 已存在"
else
    echo "创建标签 v${VERSION}..."
    git tag -a "v${VERSION}" -m "Release v${VERSION}

README Manager - Centralized README file management for VSCode

Features:
- Auto-discovery and indexing of README files
- Tree view in Explorer sidebar
- Quick navigation (Ctrl+Shift+R)
- Preview support for Markdown files
- Manual refresh functionality
- Multi-workspace support
- Customizable configuration"
    echo "✓ 标签已创建"
fi

# 步骤 6: 推送标签
echo -e "\n${YELLOW}步骤 6: 推送标签到 GitHub...${NC}"
if git push origin "v${VERSION}"; then
    echo "✓ 标签已推送"
else
    echo -e "${YELLOW}! 标签推送失败（可能已存在）${NC}"
fi

# 步骤 7: 检查 .vsix 文件
echo -e "\n${YELLOW}步骤 7: 检查 .vsix 文件...${NC}"
VSIX_FILE="${REPO_NAME}-${VERSION}.vsix"
if [ -f "$VSIX_FILE" ]; then
    echo "✓ 找到 .vsix 文件: $VSIX_FILE"
else
    echo -e "${RED}✗ 未找到 .vsix 文件${NC}"
    echo "正在打包..."
    npm run package
    if [ -f "$VSIX_FILE" ]; then
        echo "✓ .vsix 文件已生成"
    else
        echo -e "${RED}✗ 打包失败${NC}"
        exit 1
    fi
fi

# 完成
echo -e "\n${GREEN}=== 发布准备完成！ ===${NC}\n"
echo "✅ 代码已推送到 GitHub"
echo "✅ 标签 v${VERSION} 已创建"
echo "✅ .vsix 文件已准备好"
echo ""
echo -e "${YELLOW}下一步：${NC}"
echo "1. 访问: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/releases/new"
echo "2. 选择标签: v${VERSION}"
echo "3. 填写 Release 标题: README Manager v${VERSION}"
echo "4. 从 CHANGELOG.md 复制 Release 说明"
echo "5. 上传文件: ${VSIX_FILE}"
echo "6. 点击 'Publish release'"
echo ""
echo -e "${GREEN}或者使用 GitHub CLI:${NC}"
echo "gh release create v${VERSION} ${VSIX_FILE} --title \"README Manager v${VERSION}\" --notes-file CHANGELOG.md"
echo ""
echo "🎉 完成后，用户可以从以下地址下载："
echo "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/releases/download/v${VERSION}/${VSIX_FILE}"
