/**
 * README Manager Extension Entry Point
 */

import * as vscode from 'vscode';
import { ExtensionManager } from './extensionManager';

// Global extension manager instance
let extensionManager: ExtensionManager | undefined;

/**
 * Activate the extension
 */
export async function activate(context: vscode.ExtensionContext): Promise<void> {
    console.log('README Manager is activating...');

    try {
        // Create and activate extension manager
        extensionManager = new ExtensionManager(context);
        await extensionManager.activate(context);

        console.log('README Manager activated successfully!');

    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error('Failed to activate README Manager:', err);

        vscode.window.showErrorMessage(
            `README Manager failed to activate: ${err.message}`
        );

        // Don't throw - allow VSCode to continue
    }
}

/**
 * Deactivate the extension
 */
export async function deactivate(): Promise<void> {
    console.log('README Manager is deactivating...');

    try {
        if (extensionManager) {
            await extensionManager.deactivate();
            extensionManager = undefined;
        }

        console.log('README Manager deactivated successfully!');

    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error('Error during deactivation:', err);
    }
}
