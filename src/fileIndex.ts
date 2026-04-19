/**
 * File index for managing README files
 */

import * as vscode from 'vscode';
import { ReadmeFile } from './types';

/**
 * Interface for file index operations
 */
export interface IFileIndex {
    /**
     * Add a file to the index
     */
    addFile(file: ReadmeFile): void;

    /**
     * Remove a file from the index
     */
    removeFile(uri: vscode.Uri): void;

    /**
     * Get all files in the index
     */
    getAllFiles(): ReadmeFile[];

    /**
     * Get files grouped by workspace folder
     */
    getFilesByWorkspace(): Map<vscode.WorkspaceFolder, ReadmeFile[]>;

    /**
     * Find a file by URI
     */
    findByUri(uri: vscode.Uri): ReadmeFile | undefined;

    /**
     * Clear all files from the index
     */
    clear(): void;

    /**
     * Get the number of files in the index
     */
    getCount(): number;
}

/**
 * Simple Map-based file index implementation
 */
export class FileIndex implements IFileIndex {
    private files: Map<string, ReadmeFile> = new Map();

    /**
     * Add a file to the index
     */
    addFile(file: ReadmeFile): void {
        const key = file.uri.toString();
        this.files.set(key, file);
    }

    /**
     * Remove a file from the index
     */
    removeFile(uri: vscode.Uri): void {
        const key = uri.toString();
        this.files.delete(key);
    }

    /**
     * Get all files in the index
     */
    getAllFiles(): ReadmeFile[] {
        return Array.from(this.files.values());
    }

    /**
     * Get files grouped by workspace folder
     */
    getFilesByWorkspace(): Map<vscode.WorkspaceFolder, ReadmeFile[]> {
        const grouped = new Map<vscode.WorkspaceFolder, ReadmeFile[]>();

        for (const file of this.files.values()) {
            const existing = grouped.get(file.workspaceFolder) || [];
            existing.push(file);
            grouped.set(file.workspaceFolder, existing);
        }

        return grouped;
    }

    /**
     * Find a file by URI
     */
    findByUri(uri: vscode.Uri): ReadmeFile | undefined {
        return this.files.get(uri.toString());
    }

    /**
     * Clear all files from the index
     */
    clear(): void {
        this.files.clear();
    }

    /**
     * Get the number of files in the index
     */
    getCount(): number {
        return this.files.size;
    }
}
