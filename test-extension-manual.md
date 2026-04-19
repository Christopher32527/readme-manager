# README Manager 扩展手动测试指南

## 忽略 Kiro 错误

你看到的错误是 Kiro IDE 自身的问题：
- `Cannot find module 'is-electron'` - Kiro 内部依赖问题
- `ENOENT: scandir .kiro\skills` - Kiro 扫描不存在的目录

**这些错误不影响你的扩展运行！**

## 测试你的扩展

### 1. 检查扩展是否激活

按 F5 后，在扩展开发主机窗口中：

1. 打开命令面板（Ctrl+Shift+P）
2. 输入 "README Manager"
3. 应该能看到以下命令：
   - README Manager: Quick Open
   - README Manager: Refresh
   - README Manager: Preview
   - README Manager: Open File

### 2. 检查树形视图

1. 查看左侧 Explorer 侧边栏
2. 应该能看到 "README Files" 视图
3. 如果当前工作区有 README 文件，应该显示在列表中

### 3. 测试快速导航

1. 按 `Ctrl+Shift+R`（Windows/Linux）或 `Cmd+Shift+R`（Mac）
2. 应该弹出快速选择面板
3. 显示所有 README 文件
4. 支持模糊搜索

### 4. 测试预览功能

**方法 1：通过命令**
1. 打开命令面板（Ctrl+Shift+P）
2. 输入 "README Manager: Preview"
3. 选择一个 README 文件

**方法 2：通过树形视图**
1. 在 "README Files" 视图中找到一个文件
2. 右键点击
3. 选择 "Preview"

**注意**：如果右键菜单没有 Preview 选项，这是正常的，因为需要先点击文件才能看到上下文菜单。

### 5. 测试刷新功能

1. 在 "README Files" 视图的标题栏
2. 点击刷新按钮（🔄图标）
3. 应该重新扫描工作区

### 6. 检查输出日志

1. 打开输出面板（View > Output）
2. 在下拉菜单中选择 "README Manager"
3. 应该能看到激活日志：
   ```
   [timestamp] [INFO] README Manager is activating...
   [timestamp] [INFO] File index initialized
   [timestamp] [INFO] Scanner initialized
   [timestamp] [INFO] Tree view provider initialized
   [timestamp] [INFO] Command handler initialized
   [timestamp] [INFO] Commands registered
   [timestamp] [INFO] Starting initial workspace scan...
   [timestamp] [INFO] Initial scan complete: found X README file(s)
   [timestamp] [INFO] README Manager activated successfully
   ```

## 创建测试 README 文件

如果当前工作区没有 README 文件，创建一些测试文件：

```bash
# 在项目根目录
echo "# Main README" > README.md

# 在子目录
mkdir -p docs
echo "# Docs README" > docs/README.md

mkdir -p src
echo "# Source README" > src/README.txt
```

然后点击刷新按钮，应该能看到这些文件。

## 预期行为

### ✅ 正常工作的标志：

1. **树形视图显示**
   - 侧边栏有 "README Files" 视图
   - 显示找到的 README 文件
   - 文件按路径排序

2. **点击文件**
   - 点击树形视图中的文件
   - 文件在编辑器中打开

3. **快速导航**
   - Ctrl+Shift+R 打开快速选择
   - 显示所有 README 文件
   - 可以搜索和选择

4. **刷新功能**
   - 点击刷新按钮
   - 显示进度通知
   - 更新文件列表

5. **输出日志**
   - 有 "README Manager" 输出通道
   - 显示激活和操作日志

### ❌ 如果遇到问题：

1. **树形视图不显示**
   - 检查是否在 Explorer 侧边栏
   - 尝试重新加载窗口（Developer: Reload Window）

2. **没有找到 README 文件**
   - 确认工作区有 README 文件
   - 点击刷新按钮
   - 检查输出日志

3. **命令不工作**
   - 检查输出日志是否有错误
   - 查看 Debug Console 是否有错误信息

4. **Preview 不工作**
   - 这可能是因为上下文菜单配置问题
   - 可以通过命令面板使用 Preview 功能
   - 或者直接点击文件打开

## 调试技巧

1. **查看 Debug Console**
   - 在扩展开发主机中按 F12
   - 查看 Console 标签
   - 应该能看到 "README Manager is activating..." 等日志

2. **查看已注册的命令**
   - 打开命令面板
   - 输入 ">"
   - 搜索 "README Manager"
   - 应该能看到所有命令

3. **检查扩展是否激活**
   - 打开命令面板
   - 输入 "Developer: Show Running Extensions"
   - 查找 "README Manager"
   - 应该显示为 "Active"

## 下一步

如果基本功能都正常工作，我们可以继续：
1. 完善配置功能（Phase 7）
2. 添加更多测试（Phase 8）
3. 完善文档（Phase 9）
4. 打包发布（Phase 10）

如果有任何问题，请告诉我具体的错误信息或行为！
