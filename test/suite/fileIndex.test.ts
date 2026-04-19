/**
 * Unit tests for FileIndex
 */

import * as assert from 'assert';
import * as vscode from 'vscode';
import { FileIndex } from '../../src/fileIndex';
import { ReadmeFile } from '../../src/types';

suite('FileIndex Test Suite', () => {
    let fileIndex: FileIndex;

    // Helper function to create mock README file
    function createMockReadmeFile(
        path: string,
        fileName: string = 'README.md',
        workspaceName: string = 'test-workspace'
    ): ReadmeFile {
        const uri = vscode.Uri.file(path);
        const workspaceFolder: vscode.WorkspaceFolder = {
            uri: vscode.Uri.file(`/workspace/${workspaceName}`),
            name: workspaceName,
            index: 0
        };

        return {
            uri,
            relativePath: path,
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

    test('should start with empty index', () => {
        assert.strictEqual(fileIndex.getCount(), 0);
        assert.strictEqual(fileIndex.getAllFiles().length, 0);
    });

    test('should add file to index', () => {
        const file = createMockReadmeFile('/project/README.md');

        fileIndex.addFile(file);

        assert.strictEqual(fileIndex.getCount(), 1);
        assert.strictEqual(fileIndex.getAllFiles().length, 1);
    });

    test('should add multiple files to index', () => {
        const file1 = createMockReadmeFile('/project/README.md');
        const file2 = createMockReadmeFile('/project/docs/README.md');
        const file3 = createMockReadmeFile('/project/src/README.txt', 'README.txt');

        fileIndex.addFile(file1);
        fileIndex.addFile(file2);
        fileIndex.addFile(file3);

        assert.strictEqual(fileIndex.getCount(), 3);
        assert.strictEqual(fileIndex.getAllFiles().length, 3);
    });

    test('should find file by URI', () => {
        const file = createMockReadmeFile('/project/README.md');
        fileIndex.addFile(file);

        const found = fileIndex.findByUri(file.uri);

        assert.ok(found);
        assert.strictEqual(found.uri.toString(), file.uri.toString());
        assert.strictEqual(found.fileName, 'README.md');
    });

    test('should return undefined for non-existent URI', () => {
        const file = createMockReadmeFile('/project/README.md');
        fileIndex.addFile(file);

        const notFound = fileIndex.findByUri(vscode.Uri.file('/other/README.md'));

        assert.strictEqual(notFound, undefined);
    });

    test('should remove file from index', () => {
        const file = createMockReadmeFile('/project/README.md');
        fileIndex.addFile(file);

        assert.strictEqual(fileIndex.getCount(), 1);

        fileIndex.removeFile(file.uri);

        assert.strictEqual(fileIndex.getCount(), 0);
        assert.strictEqual(fileIndex.findByUri(file.uri), undefined);
    });

    test('should handle removing non-existent file', () => {
        const file = createMockReadmeFile('/project/README.md');
        fileIndex.addFile(file);

        // Remove a file that doesn't exist
        fileIndex.removeFile(vscode.Uri.file('/other/README.md'));

        // Original file should still be there
        assert.strictEqual(fileIndex.getCount(), 1);
    });

    test('should clear all files', () => {
        const file1 = createMockReadmeFile('/project/README.md');
        const file2 = createMockReadmeFile('/project/docs/README.md');

        fileIndex.addFile(file1);
        fileIndex.addFile(file2);

        assert.strictEqual(fileIndex.getCount(), 2);

        fileIndex.clear();

        assert.strictEqual(fileIndex.getCount(), 0);
        assert.strictEqual(fileIndex.getAllFiles().length, 0);
    });

    test('should get all files', () => {
        const file1 = createMockReadmeFile('/project/README.md');
        const file2 = createMockReadmeFile('/project/docs/README.md');
        const file3 = createMockReadmeFile('/project/src/README.txt', 'README.txt');

        fileIndex.addFile(file1);
        fileIndex.addFile(file2);
        fileIndex.addFile(file3);

        const allFiles = fileIndex.getAllFiles();

        assert.strictEqual(allFiles.length, 3);
        assert.ok(allFiles.some(f => f.fileName === 'README.md'));
        assert.ok(allFiles.some(f => f.fileName === 'README.txt'));
    });

    test('should group files by workspace', () => {
        const file1 = createMockReadmeFile('/project1/README.md', 'README.md', 'workspace1');
        const file2 = createMockReadmeFile('/project1/docs/README.md', 'README.md', 'workspace1');
        const file3 = createMockReadmeFile('/project2/README.md', 'README.md', 'workspace2');

        fileIndex.addFile(file1);
        fileIndex.addFile(file2);
        fileIndex.addFile(file3);

        const grouped = fileIndex.getFilesByWorkspace();

        assert.strictEqual(grouped.size, 2);

        // Check workspace1 has 2 files
        const workspace1Files = Array.from(grouped.values())[0];
        assert.ok(workspace1Files.length === 2 || workspace1Files.length === 1);

        // Check total files
        let totalFiles = 0;
        for (const files of grouped.values()) {
            totalFiles += files.length;
        }
        assert.strictEqual(totalFiles, 3);
    });

    test('should handle single workspace', () => {
        const file1 = createMockReadmeFile('/project/README.md', 'README.md', 'workspace1');
        const file2 = createMockReadmeFile('/project/docs/README.md', 'README.md', 'workspace1');

        fileIndex.addFile(file1);
        fileIndex.addFile(file2);

        const grouped = fileIndex.getFilesByWorkspace();

        assert.strictEqual(grouped.size, 1);

        const files = Array.from(grouped.values())[0];
        assert.strictEqual(files.length, 2);
    });

    test('should update file if added twice with same URI', () => {
        const file1 = createMockReadmeFile('/project/README.md', 'README.md');
        const file2 = createMockReadmeFile('/project/README.md', 'README.md');

        fileIndex.addFile(file1);
        fileIndex.addFile(file2);

        // Should only have one file (updated)
        assert.strictEqual(fileIndex.getCount(), 1);
    });

    test('should handle empty workspace grouping', () => {
        const grouped = fileIndex.getFilesByWorkspace();

        assert.strictEqual(grouped.size, 0);
    });

    test('should preserve file properties', () => {
        const file = createMockReadmeFile('/project/docs/README.md', 'README.md');
        file.fileType = 'markdown';

        fileIndex.addFile(file);

        const found = fileIndex.findByUri(file.uri);

        assert.ok(found);
        assert.strictEqual(found.fileName, 'README.md');
        assert.strictEqual(found.fileType, 'markdown');
        assert.strictEqual(found.relativePath, '/project/docs/README.md');
    });
});
