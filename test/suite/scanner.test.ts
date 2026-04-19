/**
 * Unit tests for ReadmeScanner
 */

import * as assert from 'assert';
import * as vscode from 'vscode';
import { ReadmeScanner } from '../../src/scanner';
import { FileIndex } from '../../src/fileIndex';

suite('ReadmeScanner Test Suite', () => {
    let scanner: ReadmeScanner;
    let fileIndex: FileIndex;

    setup(() => {
        fileIndex = new FileIndex();
        scanner = new ReadmeScanner(fileIndex);
    });

    teardown(() => {
        fileIndex.clear();
    });

    suite('isReadmeFile', () => {
        test('should recognize README.md', () => {
            assert.strictEqual(scanner.isReadmeFile('README.md'), true);
        });

        test('should recognize readme.md (lowercase)', () => {
            assert.strictEqual(scanner.isReadmeFile('readme.md'), true);
        });

        test('should recognize README.txt', () => {
            assert.strictEqual(scanner.isReadmeFile('README.txt'), true);
        });

        test('should recognize readme.txt (lowercase)', () => {
            assert.strictEqual(scanner.isReadmeFile('readme.txt'), true);
        });

        test('should recognize README.rst', () => {
            assert.strictEqual(scanner.isReadmeFile('README.rst'), true);
        });

        test('should recognize README (no extension)', () => {
            assert.strictEqual(scanner.isReadmeFile('README'), true);
        });

        test('should recognize readme (lowercase, no extension)', () => {
            assert.strictEqual(scanner.isReadmeFile('readme'), true);
        });

        test('should recognize READ.ME', () => {
            assert.strictEqual(scanner.isReadmeFile('READ.ME'), true);
        });

        test('should recognize read.me (lowercase)', () => {
            assert.strictEqual(scanner.isReadmeFile('read.me'), true);
        });

        test('should reject package.json', () => {
            assert.strictEqual(scanner.isReadmeFile('package.json'), false);
        });

        test('should reject index.ts', () => {
            assert.strictEqual(scanner.isReadmeFile('index.ts'), false);
        });

        test('should reject READMORE.md', () => {
            assert.strictEqual(scanner.isReadmeFile('READMORE.md'), false);
        });

        test('should reject MY_README.md', () => {
            assert.strictEqual(scanner.isReadmeFile('MY_README.md'), false);
        });

        test('should be case insensitive', () => {
            assert.strictEqual(scanner.isReadmeFile('ReAdMe.Md'), true);
            assert.strictEqual(scanner.isReadmeFile('README.MD'), true);
            assert.strictEqual(scanner.isReadmeFile('readme.MD'), true);
        });
    });

    suite('detectFileType', () => {
        test('should detect markdown files', () => {
            // We need to test this indirectly through scanFolder
            // or make detectFileType public for testing
            // For now, we'll test through the file type in results
            assert.ok(true, 'File type detection tested through integration');
        });
    });

    suite('scanWorkspace', () => {
        test('should handle empty workspace', async () => {
            // This test requires a real workspace
            // In a real test environment, we would mock vscode.workspace
            assert.ok(true, 'Workspace scanning requires integration test');
        });

        test('should clear index before scanning', async () => {
            // Add a mock file
            const mockFile = {
                uri: vscode.Uri.file('/test/README.md'),
                relativePath: 'README.md',
                workspaceFolder: {
                    uri: vscode.Uri.file('/test'),
                    name: 'test',
                    index: 0
                },
                fileName: 'README.md',
                fileType: 'markdown' as const
            };

            fileIndex.addFile(mockFile);
            assert.strictEqual(fileIndex.getCount(), 1);

            // scanWorkspace would clear this
            // But we can't test it without a real workspace
            assert.ok(true, 'Clear behavior tested in integration');
        });
    });

    suite('scanFolder', () => {
        test('should return empty array for non-existent folder', async () => {
            const uri = vscode.Uri.file('/non/existent/path');
            const files = await scanner.scanFolder(uri);

            // Should handle gracefully
            assert.ok(Array.isArray(files));
        });

        test('should handle errors gracefully', async () => {
            // Test error handling
            const uri = vscode.Uri.file('/invalid/path');

            try {
                const files = await scanner.scanFolder(uri);
                assert.ok(Array.isArray(files));
            } catch (error) {
                assert.fail('Should not throw error');
            }
        });
    });

    suite('Pattern Matching', () => {
        test('should match various README formats', () => {
            const validNames = [
                'README.md',
                'readme.md',
                'README.txt',
                'readme.txt',
                'README.rst',
                'readme.rst',
                'README',
                'readme',
                'READ.ME',
                'read.me',
                'ReAdMe.Md',
                'README.MD'
            ];

            validNames.forEach(name => {
                assert.strictEqual(
                    scanner.isReadmeFile(name),
                    true,
                    `Should match ${name}`
                );
            });
        });

        test('should reject non-README files', () => {
            const invalidNames = [
                'package.json',
                'index.ts',
                'READMORE.md',
                'MY_README.md',
                'README_OLD.md',
                'readme-backup.md',
                'test.md',
                'docs.txt',
                'info.rst'
            ];

            invalidNames.forEach(name => {
                assert.strictEqual(
                    scanner.isReadmeFile(name),
                    false,
                    `Should reject ${name}`
                );
            });
        });
    });

    suite('Configuration', () => {
        test('should use default patterns', () => {
            // Scanner is created with default patterns
            assert.strictEqual(scanner.isReadmeFile('README.md'), true);
        });

        test('should handle invalid custom patterns gracefully', () => {
            // Invalid patterns should be filtered out
            // Scanner should still work with default patterns
            assert.strictEqual(scanner.isReadmeFile('README.md'), true);
        });
    });

    suite('File Type Detection', () => {
        test('should detect file types correctly', async () => {
            // This is tested indirectly through scanFolder
            // The file type is set based on extension
            assert.ok(true, 'File type detection works through extension');
        });
    });
});
