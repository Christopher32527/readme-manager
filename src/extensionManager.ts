/**
 * Extension manager - coordinates all components
 */

import * as vscode from 'vscode';
import { FileIndex, IFileIndex } from './fileIndex';
import { ReadmeScanner, IReadmeScanner } from './scanner';
import { ReadmeTreeViewProvider, IReadmeTreeViewProvider } from './treeViewProvider';
import { CommandHandler, ICommandHandler } from './commandHandler';
import { ErrorHandler } from './errorHandler';

/**
 * Interface for extension manager operations
 */
export interface IExtensionManager {
    /**
     * Activate the extension
     */
    activate(context: vscode.ExtensionContext): Promise<void>;

    /**
     * Deactivate the extension
     */
    deactivate(): Promise<void>;

    /**
     * Get the file index instance
     */
    getFileIndex(): IFileIndex;
}

/**
 * Extension manager implementation
 */
export class ExtensionManager implements IExtensionManager {
    private scanner?: ReadmeScanner;
    private treeViewProvider?: ReadmeTreeViewProvider;
    private commandHandler?: CommandHandler;
    private fileIndex?: FileIndex;
    private errorHandler?: ErrorHandler;

    constructor(private context: vscode.ExtensionContext) { }

    /**
     * Activate the extension
     */
    async activate(context: vscode.ExtensionContext): Promise<void> {
        try {
            // Initialize error handler first
            this.errorHandler = new ErrorHandler();
            this.errorHandler.logInfo('README Manager is activating...');

            // Initialize file index
            this.fileIndex = new FileIndex();
            this.errorHandler.logInfo('File index initialized');

            // Initialize scanner
            this.scanner = new ReadmeScanner(this.fileIndex);
            this.errorHandler.logInfo('Scanner initialized');

            // Initialize tree view provider
            this.treeViewProvider = new ReadmeTreeViewProvider(this.fileIndex);
            this.errorHandler.logInfo('Tree view provider initialized');

            // Initialize command handler
            this.commandHandler = new CommandHandler(
                this.fileIndex,
                this.scanner,
                this.treeViewProvider
            );
            this.errorHandler.logInfo('Command handler initialized');

            // Register commands
            this.commandHandler.registerCommands(context);
            this.errorHandler.logInfo('Commands registered');

            // Perform initial scan
            this.errorHandler.logInfo('Starting initial workspace scan...');
            await this.scanner.scanWorkspace();
            const count = this.fileIndex.getCount();
            this.errorHandler.logInfo(`Initial scan complete: found ${count} README file(s)`);

            // Refresh tree view
            this.treeViewProvider.refresh();

            // Add error handler to subscriptions
            context.subscriptions.push(this.errorHandler);

            this.errorHandler.logInfo('README Manager activated successfully');

        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));

            if (this.errorHandler) {
                this.errorHandler.handleInitializationError(err);
            } else {
                // Fallback if error handler not initialized
                console.error('Failed to activate README Manager:', err);
                vscode.window.showErrorMessage(
                    `README Manager failed to activate: ${err.message}`
                );
            }

            throw err;
        }
    }

    /**
     * Deactivate the extension
     */
    async deactivate(): Promise<void> {
        try {
            if (this.errorHandler) {
                this.errorHandler.logInfo('README Manager is deactivating...');
            }

            // Dispose tree view provider
            if (this.treeViewProvider) {
                this.treeViewProvider.dispose();
                if (this.errorHandler) {
                    this.errorHandler.logInfo('Tree view provider disposed');
                }
            }

            // Clear file index
            if (this.fileIndex) {
                this.fileIndex.clear();
                if (this.errorHandler) {
                    this.errorHandler.logInfo('File index cleared');
                }
            }

            if (this.errorHandler) {
                this.errorHandler.logInfo('README Manager deactivated successfully');
            }

        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));

            if (this.errorHandler) {
                this.errorHandler.logError('Error during deactivation', err);
            } else {
                console.error('Error during deactivation:', err);
            }
        }
    }

    /**
     * Get the file index instance
     */
    getFileIndex(): IFileIndex {
        if (!this.fileIndex) {
            throw new Error('File index not initialized');
        }
        return this.fileIndex;
    }

    /**
     * Get the scanner instance
     */
    getScanner(): IReadmeScanner {
        if (!this.scanner) {
            throw new Error('Scanner not initialized');
        }
        return this.scanner;
    }

    /**
     * Get the tree view provider instance
     */
    getTreeViewProvider(): IReadmeTreeViewProvider {
        if (!this.treeViewProvider) {
            throw new Error('Tree view provider not initialized');
        }
        return this.treeViewProvider;
    }

    /**
     * Get the command handler instance
     */
    getCommandHandler(): ICommandHandler {
        if (!this.commandHandler) {
            throw new Error('Command handler not initialized');
        }
        return this.commandHandler;
    }

    /**
     * Get the error handler instance
     */
    getErrorHandler(): ErrorHandler {
        if (!this.errorHandler) {
            throw new Error('Error handler not initialized');
        }
        return this.errorHandler;
    }
}
