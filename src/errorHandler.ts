/**
 * Error handler and logging system
 */

import * as vscode from 'vscode';

/**
 * Log levels
 */
export enum LogLevel {
    FATAL = 'FATAL',
    ERROR = 'ERROR',
    WARNING = 'WARNING',
    INFO = 'INFO'
}

/**
 * Error handler for README Manager
 */
export class ErrorHandler {
    private outputChannel: vscode.OutputChannel;

    constructor() {
        this.outputChannel = vscode.window.createOutputChannel('README Manager');
    }

    /**
     * Handle file access errors
     */
    handleFileAccessError(uri: vscode.Uri, error: Error): void {
        const message = `Failed to access file ${uri.fsPath}: ${error.message}`;
        this.log(LogLevel.WARNING, message);
        console.warn(message, error);
    }

    /**
     * Handle scan errors
     */
    handleScanError(error: Error): void {
        const message = `Scan failed: ${error.message}`;
        this.log(LogLevel.ERROR, message);

        vscode.window.showErrorMessage(
            `README Manager: ${message}`,
            'View Output'
        ).then(selection => {
            if (selection === 'View Output') {
                this.outputChannel.show();
            }
        });
    }

    /**
     * Handle preview errors
     */
    handlePreviewError(error: Error): void {
        const message = `Preview failed: ${error.message}`;
        this.log(LogLevel.WARNING, message);

        vscode.window.showWarningMessage(
            'README Manager: Failed to preview file. Opening in editor instead.'
        );
    }

    /**
     * Handle initialization errors
     */
    handleInitializationError(error: Error): void {
        const message = `Extension initialization failed: ${error.message}`;
        this.log(LogLevel.FATAL, message);

        if (error.stack) {
            this.outputChannel.appendLine(error.stack);
        }

        vscode.window.showErrorMessage(
            'README Manager failed to initialize. See output for details.',
            'View Output'
        ).then(selection => {
            if (selection === 'View Output') {
                this.outputChannel.show();
            }
        });
    }

    /**
     * Handle command execution errors
     */
    handleCommandError(commandName: string, error: Error): void {
        const message = `Command '${commandName}' failed: ${error.message}`;
        this.log(LogLevel.ERROR, message);

        vscode.window.showErrorMessage(
            `README Manager: ${message}`
        );
    }

    /**
     * Log informational messages
     */
    logInfo(message: string): void {
        this.log(LogLevel.INFO, message);
    }

    /**
     * Log warning messages
     */
    logWarning(message: string): void {
        this.log(LogLevel.WARNING, message);
    }

    /**
     * Log error messages
     */
    logError(message: string, error?: Error): void {
        this.log(LogLevel.ERROR, message);
        if (error && error.stack) {
            this.outputChannel.appendLine(error.stack);
        }
    }

    /**
     * Log a message with level
     */
    private log(level: LogLevel, message: string): void {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level}] ${message}`;

        this.outputChannel.appendLine(logMessage);

        // Also log to console for debugging
        switch (level) {
            case LogLevel.FATAL:
            case LogLevel.ERROR:
                console.error(logMessage);
                break;
            case LogLevel.WARNING:
                console.warn(logMessage);
                break;
            case LogLevel.INFO:
                console.log(logMessage);
                break;
        }
    }

    /**
     * Show the output channel
     */
    show(): void {
        this.outputChannel.show();
    }

    /**
     * Clear the output channel
     */
    clear(): void {
        this.outputChannel.clear();
    }

    /**
     * Dispose the error handler
     */
    dispose(): void {
        this.outputChannel.dispose();
    }
}
