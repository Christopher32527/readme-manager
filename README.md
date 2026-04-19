# README Manager

> Centralized README file management and navigation for VSCode

README Manager is a VSCode extension that helps developers efficiently manage and navigate multiple README files across their projects. When working with multi-module projects, packages, or components, each part may have its own README file, making documentation scattered and hard to find. This extension provides a centralized view and quick navigation features to streamline your documentation workflow.

## Features

- 🔍 **Auto-Discovery**: Automatically scans and indexes all README files in your workspace
- 🌲 **Tree View**: Displays README files in a hierarchical tree structure in the sidebar
- ⚡ **Quick Navigation**: Jump to any README file with a keyboard shortcut (Ctrl+Shift+R / Cmd+Shift+R)
- 👁️ **Preview Support**: Preview README files with Markdown rendering using VSCode's built-in preview
- 🔄 **Manual Refresh**: Refresh the file index with a single click
- 🎯 **Multi-Workspace Support**: Works seamlessly with multi-root workspaces
- ⚙️ **Customizable**: Configure custom file patterns and exclusion rules

## Installation

### From GitHub Release

1. Download the latest `.vsix` file from [GitHub Releases](https://github.com/your-username/readme-manager/releases)
2. Open VSCode
3. Go to Extensions view (Ctrl+Shift+X / Cmd+Shift+X)
4. Click the "..." menu at the top of the Extensions view
5. Select "Install from VSIX..."
6. Choose the downloaded `.vsix` file

### From Command Line

```bash
code --install-extension readme-manager-1.0.0.vsix
```

## Usage

### Tree View

After installation, you'll see a "README Files" view in the Explorer sidebar. This view displays all README files found in your workspace, organized by their directory structure.

- **Click** on any file to open it in the editor
- **Right-click** on a file to see context menu options
- Click the **refresh button** in the view title to rescan the workspace

### Quick Navigation

Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac) to open the quick navigation panel. This shows all README files with fuzzy search support. Start typing to filter the list, then press Enter to open the selected file.

### Preview

Right-click on any README file in the tree view and select "Preview" to open it in preview mode. Markdown files will be rendered with VSCode's built-in Markdown preview.

## Configuration

Open VSCode Settings (Ctrl+, / Cmd+,) and search for "README Manager" to customize the extension:

### File Patterns

Add custom README file name patterns (regex):

```json
{
  "readmeManager.filePatterns": [
    "^info\\.md$",
    "^guide\\.txt$"
  ]
}
```

### Exclude Patterns

Specify directories to exclude from scanning:

```json
{
  "readmeManager.excludePatterns": [
    "**/node_modules/**",
    "**/.git/**",
    "**/dist/**",
    "**/build/**",
    "**/.vscode/**",
    "**/vendor/**"
  ]
}
```

## Supported File Types

By default, README Manager recognizes the following file patterns:

- `README.md`, `readme.md`
- `README.txt`, `readme.txt`
- `README.rst`, `readme.rst`
- `README`, `readme`
- `READ.ME`, `read.me`

You can add custom patterns using the `readmeManager.filePatterns` configuration.

## Requirements

- VSCode version 1.75.0 or higher

## Known Issues

None at this time. Please report issues on [GitHub](https://github.com/your-username/readme-manager/issues).

## Release Notes

See [CHANGELOG.md](CHANGELOG.md) for detailed release notes.

### 1.0.0

Initial release of README Manager

- Auto-discovery and indexing of README files
- Tree view in Explorer sidebar
- Quick navigation with keyboard shortcut
- Preview support for Markdown files
- Manual refresh functionality
- Multi-workspace support
- Customizable file patterns and exclusion rules

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

This extension is licensed under the [MIT License](LICENSE).

## Acknowledgments

Built with ❤️ using the VSCode Extension API.

---

**Enjoy managing your README files!**
