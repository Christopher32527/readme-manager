/**
 * Command handler for README Manager
 */

import * as vscode from 'vscode';
import { IFileIndex } from './fileIndex';
import { IReadmeScanner } from './scanner';
import { IReadmeTreeViewProvider } from './treeViewProvider';

/**
 * Interface for command handler operations
 */
export interface ICommandHandler {
    /**
     * Register all commands
     */
    registerCommands(context: vscode.ExtensionContext): void;
}

/**
 * Command handler implementation
 */
export class CommandHandler implements ICommandHandler {
    constructor(
        private fileIndex: IFileIndex,
        private scanner: IReadmeScanner,
        private treeViewProvider: IReadmeTreeViewProvider
    ) { }

    /**
     * Register all commands
     */
    registerCommands(context: vscode.ExtensionContext): void {
        // Open file command
        context.subscriptions.push(
            vscode.commands.registerCommand(
                'readmeManager.openFile',
                (uri: vscode.Uri) => this.openFile(uri)
            )
        );

        // Quick open command
        context.subscriptions.push(
            vscode.commands.registerCommand(
                'readmeManager.quickOpen',
                () => this.quickOpen()
            )
        );

        // Preview command
        context.subscriptions.push(
            vscode.commands.registerCommand(
                'readmeManager.preview',
                (uri: vscode.Uri) => this.preview(uri)
            )
        );

        // Refresh command
        context.subscriptions.push(
            vscode.commands.registerCommand(
                'readmeManager.refresh',
                () => this.refresh()
            )
        );
    }

    /**
     * Open a README file in the editor
     */
    private async openFile(uri: vscode.Uri): Promise<void> {
        try {
            const document = await vscode.workspace.openTextDocument(uri);
            await vscode.window.showTextDocument(document);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            vscode.window.showErrorMessage(
                `Failed to open file: ${message}`
            );
        }
    }

    /**
     * Show quick pick for README navigation
     */
    private async quickOpen(): Promise<void> {
        const files = this.fileIndex.getAllFiles();

        if (files.length === 0) {
            vscode.window.showInformationMessage('No README files found in workspace');
            return;
        }

        // Create quick pick items
        interface ReadmeQuickPickItem extends vscode.QuickPickItem {
            uri: vscode.Uri;
        }

        const items: ReadmeQuickPickItem[] = files.map(file => ({
            label: file.fileName,
            description: file.relativePath,
            detail: file.workspaceFolder.name,
            uri: file.uri
        }));

        // Show quick pick with fuzzy search
        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Select a README file to open',
            matchOnDescription: true,
            matchOnDetail: true
        });

        if (selected) {
            await this.openFile(selected.uri);
        }
    }

    /**
     * Preview a README file
     */
    private async preview(uri: vscode.Uri): Promise<void> {
        try {
            const file = this.fileIndex.findByUri(uri);

            if (!file) {
                vscode.window.showErrorMessage('File not found in index');
                return;
            }

            // For Markdown files, use VSCode's built-in preview
            if (file.fileType === 'markdown') {
                await vscode.commands.executeCommand(
                    'markdown.showPreview',
                    uri
                );
            } else {
                // For other file types, open in preview mode
                const document = await vscode.workspace.openTextDocument(uri);
                await vscode.window.showTextDocument(document, {
                    preview: true,
                    preserveFocus: true
                });
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            vscode.window.showErrorMessage(
                `Failed to preview file: ${message}`
            );
        }
    }

    /**
     * Refresh the README file index
     */
    private async refresh(): Promise<void> {
        await vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: 'Refreshing README files...',
                cancellable: false
            },
            async () => {
                try {
                    // Trigger rescan
                    await this.scanner.scanWorkspace();

                    // Refresh tree view
                    this.treeViewProvider.refresh();

                    // Show success message
                    const count = this.fileIndex.getCount();
                    vscode.window.showInformationMessage(
                        `Found ${count} README file${count !== 1 ? 's' : ''}`
                    );
                } catch (error) {
                    const message = error instanceof Error ? error.message : String(error);
                    vscode.window.showErrorMessage(
                        `Failed to refresh: ${message}`
                    );
                }
            }
        );
    }
}
