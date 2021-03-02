// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('redact-secrets.redact', function () {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		function do_mask(secret: string) {
			const secrets_pattern: RegExp = new RegExp(vscode.workspace.getConfiguration().get('redact-secrets.secrets_pattern',''), "g");
			const mask_char: string = vscode.workspace.getConfiguration().get('redact-secrets.mask_char', '');
			return secret.replace(secrets_pattern, mask_char);
		}

		if (editor) {
			const document = editor.document;

			editor.edit(editBuilder => {

				if (editor.selections.length === 0) {
					vscode.window.showWarningMessage("No selection found");
					return;
				}

				for (let selection of editor.selections) {
					// const range = selection.with();
					// const secret = editor.document.getText(range);
					// const masked = mask(secret, "X");
					// Get the word within the selection
					const word = document.getText(selection);
					const masked = do_mask(word);
					editBuilder.replace(selection, masked);
				}
			});
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
