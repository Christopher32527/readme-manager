/**
 * README file scanner
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { ReadmeFile } from './types';
import { IFileIndex } from './fileIndex';

/**
 * Interface for README scanner operations
 */
export interface IReadmeScanner {
    /**
     * Scan the entire workspace for README files
     */
    scanWorkspace(): Promise<void>;
    
    /**
     * Scan a specific folder for README files
     */
    scanFolder(folderUri: vscode.Uri): Promise<ReadmeFile[]>;
    
    /**
     * Check if a file name matches README patterns
     */
    isReadmeFile(fileName: string): boolean;
}

/**
 * README file scanner implementation
 */
export class ReadmeScanner implements IReadmeScanner {
    private readonly readmePatterns: RegExp[];
    private readonly excludePatterns: string[];
    
    constructor(private fileIndex: IFileIndex) {
        // Get configuration
        const config = vscode.workspace.getConfiguration('readmeManager');
        const customPatterns = config.get<string[]>('filePatterns', []);
        
        // Default README patterns
        const defaultPatterns = [
            /^readme\.md$/i,
            /^readme\.txt$/i,
            /^readme\.rst$/i,
            /^readme$/i,
            /^read\.me$/i
        ];
        
        // Combine default and custom patterns
        this.readmePatterns = [
            ...defaultPatterns,
            ...customPatterns.map(p => {
                try {
                    return new RegExp(p, 'i');
                } catch (error) {
                    console.warn(`Invalid regex pattern: ${p}`, error);
                    return null;
                }
            }).filter((p): p is RegExp => p !== null)
        ];
        
        // Get exclude patterns
        this.excludePatterns = config.get<string[]>('excludePatterns', [
            '**/node_modules/**',
            '**/.git/**',
            '**/dist/**',
            '**/build/**',
            '**/.vscode/**'
        ]);
    }
    
    /**
     * Scan the entire workspace for README files
     */
    async scanWorkspace(): Promise<void> {
        const folders = vscode.workspace.workspaceFolders;
        if (!folders) {
            return;
        }
        
        // Clear existing index
        this.fileIndex.clear();
        
        // Scan all workspace folders in parallel
        const scanPromises = folders.map(folder => this.scanFolder(folder.uri));
        const results = await Promise.all(scanPromises);
        
        // Add all found files to index
        results.flat().forEach(file => this.fileIndex.addFile(file));
    }
    
    /**
     * Scan a specific folder for README files
     */
    async scanFolder(folderUri: vscode.Uri): Promise<ReadmeFile[]> {
        const files: ReadmeFile[] = [];
        
        try {
            // Use workspace.findFiles for efficient scanning
            // This uses ripgrep internally for fast file search
            const pattern = new vscode.RelativePattern(
                folderUri,
                '**/{README,readme,Read.me,READ.ME}{.md,.txt,.rst,}'
            );
            
            // Create exclude pattern
            const exclude = `{${this.excludePatterns.join(',')}}`;
            
            // Find all matching files
            const foundUris = await vscode.workspace.findFiles(pattern, exclude);
            
            // Process each found file
            for (const uri of foundUris) {
                const fileName = path.basename(uri.fsPath);
                
                // Double-check with our patterns
                if (this.isReadmeFile(fileName)) {
                    const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
                    
                    if (workspaceFolder) {
                        files.push({
                            uri,
                            relativePath: vscode.workspace.asRelativePath(uri),
                            workspaceFolder,
                            fileName,
                            fileType: this.detectFileType(fileName)
                        });
                    }
                }
            }
        } catch (error) {
            console.error(`Error scanning folder ${folderUri.fsPath}:`, error);
        }
        
        return files;
    }
    
    /**
     * Check if a file name matches README patterns
     */
    isReadmeFile(fileName: string): boolean {
        return this.readmePatterns.some(pattern => pattern.test(fileName));
    }
    
    /**
     * Detect file type based on extension
     */
    private detectFileType(fileName: string): ReadmeFile['fileType'] {
        const ext = path.extname(fileName).toLowerCase();
        
        switch (ext) {
            case '.md':
                return 'markdown';
            case '.txt':
                return 'text';
            case '.rst':
                return 'rst';
            default:
                return 'other';
        }
    }
}
