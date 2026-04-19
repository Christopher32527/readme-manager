# Change Log

All notable changes to the "README Manager" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-04-17

### Added
- Initial release
- Auto-discovery and indexing of README files in workspace
- Tree view in Explorer sidebar showing all README files
- Quick navigation command with keyboard shortcut (Ctrl+Shift+R / Cmd+Shift+R)
- Preview support for README files (Markdown rendering for .md files)
- Manual refresh button to rescan workspace
- Multi-workspace support with folder grouping
- Configuration options for custom file patterns
- Configuration options for exclusion patterns
- Context menu for preview action
- Support for multiple README file formats (.md, .txt, .rst, etc.)
- Error handling and logging system
- Comprehensive test suite with >80% coverage

### Technical Details
- Built with TypeScript
- Uses VSCode Extension API
- Leverages VSCode's built-in features (search, preview, fuzzy matching)
- Efficient file scanning using workspace.findFiles API
- Simple Map-based file indexing
- User-controlled refresh mechanism

[Unreleased]: https://github.com/your-username/readme-manager/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/your-username/readme-manager/releases/tag/v1.0.0
