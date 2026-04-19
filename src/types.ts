/**
 * Type definitions for README Manager extension
 */

import * as vscode from 'vscode';

/**
 * README file information
 */
export interface ReadmeFile {
    /** File URI */
    uri: vscode.Uri;

    /** Relative path to workspace */
    relativePath: string;

    /** Workspace folder this file belongs to */
    workspaceFolder: vscode.WorkspaceFolder;

    /** File name */
    fileName: string;

    /** File type */
    fileType: 'markdown' | 'text' | 'rst' | 'other';
}

/**
 * Tree view node types
 */
export type TreeNode = WorkspaceFolderNode | ReadmeFileNode;

/**
 * Workspace folder node in tree view
 */
export interface WorkspaceFolderNode {
    type: 'workspace';
    folder: vscode.WorkspaceFolder;
    children: ReadmeFileNode[];
}

/**
 * README file node in tree view
 */
export interface ReadmeFileNode {
    type: 'file';
    file: ReadmeFile;
}

/**
 * Extension configuration
 */
export interface ExtensionConfiguration {
    /** Custom file name patterns (regex) */
    filePatterns: string[];

    /** Exclude directory patterns (glob) */
    excludePatterns: string[];
}
