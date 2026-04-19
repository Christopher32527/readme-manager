/**
 * Tree view provider for README files
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { ReadmeFile, TreeNode, WorkspaceFolderNode, ReadmeFileNode } from './types';
import { IFileIndex } from './fileIndex';

/**
 * Interface for tree view provider operations
 */
export interface IReadmeTreeViewProvider extends vscode.TreeDataProvider<TreeNode> {
    /**
     * Refresh the tree view
     */
    refresh(): void;

    /**
     * Reveal a specific file in the tree view
     */
    reveal(file: ReadmeFile): Promise<void>;

    /**
     * Dispose the tree view
     */
    dispose(): void;
}

/**
 * Tree view provider implementation
 */
export class ReadmeTreeViewProvider implements IReadmeTreeViewProvider {
    private treeView: vscode.TreeView<TreeNode>;
    private changeEmitter = new vscode.EventEmitter<TreeNode | undefined>();

    readonly onDidChangeTreeData = this.changeEmitter.event;

    constructor(private fileIndex: IFileIndex) {
        // Create tree view
        this.treeView = vscode.window.createTreeView('readmeManager.treeView', {
            treeDataProvider: this,
            showCollapseAll: true
        });
    }

    /**
     * Refresh the tree view
     */
    refresh(): void {
        this.changeEmitter.fire(undefined);
    }

    /**
     * Reveal a specific file in the tree view
     */
    async reveal(file: ReadmeFile): Promise<void> {
        const node: ReadmeFileNode = { type: 'file', file };
        await this.treeView.reveal(node, { select: true, focus: true });
    }

    /**
     * Get tree item representation for a node
     */
    getTreeItem(element: TreeNode): vscode.TreeItem {
        if (element.type === 'workspace') {
            return this.createWorkspaceFolderItem(element);
        } else {
            return this.createReadmeFileItem(element);
        }
    }

    /**
     * Get children of a tree node
     */
    getChildren(element?: TreeNode): TreeNode[] {
        if (!element) {
            // Root level: return workspace folders or files
            return this.getRootNodes();
        }

        if (element.type === 'workspace') {
            // Workspace node: return its README files
            return element.children;
        }

        // File nodes have no children
        return [];
    }

    /**
     * Get parent of a tree node
     */
    getParent(element: TreeNode): TreeNode | undefined {
        if (element.type === 'file') {
            // Find the workspace node containing this file
            const workspaceNodes = this.getRootNodes();
            return workspaceNodes.find(node =>
                node.type === 'workspace' &&
                node.folder === element.file.workspaceFolder
            );
        }
        return undefined;
    }

    /**
     * Get root nodes for the tree view
     */
    private getRootNodes(): TreeNode[] {
        const filesByWorkspace = this.fileIndex.getFilesByWorkspace();
        const folders = vscode.workspace.workspaceFolders || [];

        if (folders.length === 0) {
            return [];
        }

        // If only one workspace, show files directly
        if (folders.length === 1) {
            const files = filesByWorkspace.get(folders[0]) || [];
            return files
                .sort((a, b) => a.relativePath.localeCompare(b.relativePath))
                .map(file => ({ type: 'file', file } as ReadmeFileNode));
        }

        // Multiple workspaces: group by folder
        return folders.map(folder => {
            const files = filesByWorkspace.get(folder) || [];
            const children: ReadmeFileNode[] = files
                .sort((a, b) => a.relativePath.localeCompare(b.relativePath))
                .map(file => ({
                    type: 'file',
                    file
                }));

            return {
                type: 'workspace',
                folder,
                children
            } as WorkspaceFolderNode;
        });
    }

    /**
     * Create tree item for workspace folder node
     */
    private createWorkspaceFolderItem(node: WorkspaceFolderNode): vscode.TreeItem {
        const item = new vscode.TreeItem(
            node.folder.name,
            vscode.TreeItemCollapsibleState.Expanded
        );

        item.iconPath = new vscode.ThemeIcon('folder');
        item.contextValue = 'workspaceFolder';
        item.description = `${node.children.length} README file${node.children.length !== 1 ? 's' : ''}`;
        item.tooltip = node.folder.uri.fsPath;

        return item;
    }

    /**
     * Create tree item for README file node
     */
    private createReadmeFileItem(node: ReadmeFileNode): vscode.TreeItem {
        const file = node.file;
        const item = new vscode.TreeItem(
            file.fileName,
            vscode.TreeItemCollapsibleState.None
        );

        // Set icon based on file type
        item.iconPath = this.getFileIcon(file.fileType);

        // Set description (directory path)
        const dirPath = path.dirname(file.relativePath);
        item.description = dirPath === '.' ? '' : dirPath;

        // Set tooltip
        item.tooltip = file.relativePath;

        // Set click command
        item.command = {
            command: 'readmeManager.openFile',
            title: 'Open README',
            arguments: [file.uri]
        };

        // Set context value for context menu
        item.contextValue = 'readmeFile';

        return item;
    }

    /**
     * Get icon for file type
     */
    private getFileIcon(fileType: ReadmeFile['fileType']): vscode.ThemeIcon {
        switch (fileType) {
            case 'markdown':
                return new vscode.ThemeIcon('markdown');
            case 'text':
                return new vscode.ThemeIcon('file-text');
            case 'rst':
                return new vscode.ThemeIcon('file-code');
            default:
                return new vscode.ThemeIcon('file');
        }
    }

    /**
     * Dispose the tree view and resources
     */
    dispose(): void {
        this.treeView.dispose();
        this.changeEmitter.dispose();
    }
}
