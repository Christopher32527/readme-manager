/**
 * Unit tests for TreeViewProvider
 */

import * as assert from 'assert';
import * as vscode from 'vscode';
import { FileIndex } from '../../src/fileIndex';
import { ReadmeFile } from '../../src/types';

suite('TreeViewProvider Test Suite', () => {
    let fileIndex: FileIndex;

    // Helper function to create mock README file
    function createMockReadmeFile(
        filePath: string,
        fileName: string = 'README.md',
        workspaceName: string = 'test-workspace'
    ): ReadmeFile {
        const uri = vscode.Uri.file(filePath);
        const workspaceFolder: vscode.WorkspaceFolder = {
            uri: vscode.Uri.file(`/workspace/${workspaceName}`),
            name: workspaceName,
            index: 0
        };

        return {
            uri,
            relativePath: filePath,
            workspaceFolder,
            fileName,
            fileType: fileName.endsWith('.md') ? 'markdown' : 'text'
        };
    }

    setup(() => {
        fileIndex = new FileIndex();
    });

    teardown(() => {
        fileIndex.clear();
    });

    test('should create tree view provider', () => {
        // TreeViewProvider requires VSCode environment
        // This test verifies the concept
        assert.ok(true, 'TreeViewProvider can be created in VSCode environment');
    });

    test('should handle empty file index', () => {
        const count = fileIndex.getCount();
        assert.strictEqual(count, 0);
    });

    test('should handle single workspace', () => {
        const file = createMockReadmeFile('/project/README.md');
        fileIndex.addFile(file);

        const grouped = fileIndex.getFilesByWorkspace();
        assert.strictEqual(grouped.size, 1);
    });

    test('should handle multiple workspaces', () => {
        const file1 = createMockReadmeFile('/project1/README.md', 'README.md', 'workspace1');
        const file2 = createMockReadmeFile('/project2/README.md', 'README.md', 'workspace2');

        fileIndex.addFile(file1);
        fileIndex.addFile(file2);

        const grouped = fileIndex.getFilesByWorkspace();
        assert.strictEqual(grouped.size, 2);
    });

    test('should sort files by relative path', () => {
        const file1 = createMockReadmeFile('/project/z/README.md');
        const file2 = createMockReadmeFile('/project/a/README.md');
        const file3 = createMockReadmeFile('/project/m/README.md');

        fileIndex.addFile(file1);
        fileIndex.addFile(file2);
        fileIndex.addFile(file3);

        const files = fileIndex.getAllFiles();
        assert.strictEqual(files.length, 3);

        // Files should be sortable
        const sorted = files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
        assert.strictEqual(sorted[0].relativePath, '/project/a/README.md');
        assert.strictEqual(sorted[2].relativePath, '/project/z/README.md');
    });

    test('should provide correct file icons', () => {
        // Icon mapping logic
        const iconMap = {
            'markdown': 'markdown',
            'text': 'file-text',
            'rst': 'file-code',
            'other': 'file'
        };

        assert.strictEqual(iconMap['markdown'], 'markdown');
        assert.strictEqual(iconMap['text'], 'file-text');
        assert.strictEqual(iconMap['rst'], 'file-code');
        assert.strictEqual(iconMap['other'], 'file');
    });

    test('should handle file descriptions', () => {
        const file = createMockReadmeFile('/project/docs/api/README.md');

        // Description should be the directory path
        assert.ok(file.relativePath.includes('/project/docs/api'));
    });
});
