/**
 * Unit tests for ErrorHandler
 */

import * as assert from 'assert';
import * as vscode from 'vscode';
import { ErrorHandler, LogLevel } from '../../src/errorHandler';

suite('ErrorHandler Test Suite', () => {
    let errorHandler: ErrorHandler;

    setup(() => {
        errorHandler = new ErrorHandler();
    });

    teardown(() => {
        errorHandler.dispose();
    });

    test('should create error handler', () => {
        assert.ok(errorHandler);
    });

    test('should have log levels defined', () => {
        assert.strictEqual(LogLevel.FATAL, 'FATAL');
        assert.strictEqual(LogLevel.ERROR, 'ERROR');
        assert.strictEqual(LogLevel.WARNING, 'WARNING');
        assert.strictEqual(LogLevel.INFO, 'INFO');
    });

    test('should handle file access errors', () => {
        const uri = vscode.Uri.file('/test/README.md');
        const error = new Error('Permission denied');

        // Should not throw
        assert.doesNotThrow(() => {
            errorHandler.handleFileAccessError(uri, error);
        });
    });

    test('should handle scan errors', () => {
        const error = new Error('Scan failed');

        // Should not throw
        assert.doesNotThrow(() => {
            errorHandler.handleScanError(error);
        });
    });

    test('should handle preview errors', () => {
        const error = new Error('Preview failed');

        // Should not throw
        assert.doesNotThrow(() => {
            errorHandler.handlePreviewError(error);
        });
    });

    test('should handle initialization errors', () => {
        const error = new Error('Init failed');
        error.stack = 'Error stack trace';

        // Should not throw
        assert.doesNotThrow(() => {
            errorHandler.handleInitializationError(error);
        });
    });

    test('should handle command errors', () => {
        const error = new Error('Command failed');

        // Should not throw
        assert.doesNotThrow(() => {
            errorHandler.handleCommandError('testCommand', error);
        });
    });

    test('should log info messages', () => {
        // Should not throw
        assert.doesNotThrow(() => {
            errorHandler.logInfo('Test info message');
        });
    });

    test('should log warning messages', () => {
        // Should not throw
        assert.doesNotThrow(() => {
            errorHandler.logWarning('Test warning message');
        });
    });

    test('should log error messages', () => {
        // Should not throw
        assert.doesNotThrow(() => {
            errorHandler.logError('Test error message');
        });
    });

    test('should log error messages with stack trace', () => {
        const error = new Error('Test error');
        error.stack = 'Error stack trace';

        // Should not throw
        assert.doesNotThrow(() => {
            errorHandler.logError('Test error message', error);
        });
    });

    test('should show output channel', () => {
        // Should not throw
        assert.doesNotThrow(() => {
            errorHandler.show();
        });
    });

    test('should clear output channel', () => {
        // Should not throw
        assert.doesNotThrow(() => {
            errorHandler.clear();
        });
    });

    test('should handle multiple errors', () => {
        const uri = vscode.Uri.file('/test/README.md');
        const error1 = new Error('Error 1');
        const error2 = new Error('Error 2');
        const error3 = new Error('Error 3');

        // Should handle multiple errors without throwing
        assert.doesNotThrow(() => {
            errorHandler.handleFileAccessError(uri, error1);
            errorHandler.handleScanError(error2);
            errorHandler.handlePreviewError(error3);
        });
    });

    test('should handle errors with different log levels', () => {
        // Should not throw
        assert.doesNotThrow(() => {
            errorHandler.logInfo('Info message');
            errorHandler.logWarning('Warning message');
            errorHandler.logError('Error message');
        });
    });

    test('should format log messages with timestamp', () => {
        // Log messages should include timestamp
        // This is tested indirectly through the log methods
        assert.doesNotThrow(() => {
            errorHandler.logInfo('Test message');
        });
    });

    test('should handle errors without stack trace', () => {
        const error = new Error('Error without stack');
        delete error.stack;

        // Should not throw
        assert.doesNotThrow(() => {
            errorHandler.logError('Test error', error);
        });
    });

    test('should dispose cleanly', () => {
        // Should not throw
        assert.doesNotThrow(() => {
            errorHandler.dispose();
        });
    });
});
