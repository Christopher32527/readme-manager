# Contributing to README Manager

Thank you for your interest in contributing to README Manager! This document provides guidelines and instructions for contributing.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- VSCode (v1.75.0 or higher)
- Git

### Setup Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/readme-manager.git
   cd readme-manager
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Open the project in VSCode:
   ```bash
   code .
   ```

5. Press F5 to start debugging (this will open a new VSCode window with the extension loaded)

## Development Workflow

### Project Structure

```
readme-manager/
├── src/                    # Source code
│   ├── extension.ts        # Extension entry point
│   ├── extensionManager.ts # Extension lifecycle manager
│   ├── scanner.ts          # File scanner
│   ├── fileIndex.ts        # File index
│   ├── treeViewProvider.ts # Tree view provider
│   ├── commandHandler.ts   # Command handler
│   ├── errorHandler.ts     # Error handler
│   └── types.ts            # Type definitions
├── test/                   # Tests
│   └── suite/              # Test suites
├── resources/              # Resources (icons, images)
├── out/                    # Compiled output (generated)
└── node_modules/           # Dependencies (generated)
```

### Building

Compile TypeScript:
```bash
npm run compile
```

Watch mode (auto-compile on changes):
```bash
npm run watch
```

### Testing

Run all tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

Generate HTML coverage report:
```bash
npm run test:report
```

### Linting

Run ESLint:
```bash
npm run lint
```

### Debugging

1. Open the project in VSCode
2. Set breakpoints in the source code
3. Press F5 to start debugging
4. A new VSCode window will open with the extension loaded
5. Test the extension in the new window
6. Check the Debug Console for logs and errors

## Making Changes

### Branch Naming

- Feature: `feature/description`
- Bug fix: `fix/description`
- Documentation: `docs/description`
- Refactoring: `refactor/description`

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example:
```
feat: add support for custom file patterns
fix: resolve issue with multi-workspace scanning
docs: update installation instructions
```

### Code Style

- Use TypeScript strict mode
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Write tests for new features

### Testing Requirements

- All new features must include tests
- Maintain test coverage above 80%
- Test both success and error cases
- Include integration tests for user-facing features

## Submitting Changes

### Pull Request Process

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

3. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Open a Pull Request on GitHub

5. Ensure all checks pass:
   - Tests pass
   - Linting passes
   - Code coverage maintained

6. Wait for review and address feedback

### Pull Request Guidelines

- Provide a clear description of the changes
- Reference related issues (e.g., "Fixes #123")
- Include screenshots for UI changes
- Update documentation if needed
- Keep PRs focused and reasonably sized

## Reporting Issues

### Bug Reports

When reporting bugs, please include:

- VSCode version
- Extension version
- Operating system
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Error messages or logs

### Feature Requests

When requesting features, please include:

- Clear description of the feature
- Use case and motivation
- Proposed implementation (if any)
- Examples or mockups (if applicable)

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information
- Other unprofessional conduct

## Questions?

If you have questions, feel free to:

- Open an issue on GitHub
- Start a discussion in GitHub Discussions
- Contact the maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to README Manager! 🎉
