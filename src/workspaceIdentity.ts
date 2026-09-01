import * as vscode from "vscode";
import { normalize } from "./normalize";

export function getWorkspaceIdentity(): string | undefined {
  const workspaceFile = vscode.workspace.workspaceFile;
  if (workspaceFile) return normalize(workspaceFile.toString());

  const folders = vscode.workspace.workspaceFolders;
  if (!folders?.length) return undefined;

  return folders.map(folder => normalize(folder.uri.toString())).sort().join("|");
}