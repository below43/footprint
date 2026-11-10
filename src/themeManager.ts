import * as vscode from "vscode";

const KEY="footprint.themeSnapshot";
const STATUS_BAR_MANAGED=["statusBar.background","statusBar.foreground","statusBarItem.hoverBackground","statusBar.debuggingBackground","statusBar.debuggingForeground"] as const;
const TITLE_BAR_MANAGED=["titleBar.activeBackground","titleBar.activeForeground","titleBar.inactiveBackground","titleBar.inactiveForeground"] as const;
const ALL_MANAGED=[...STATUS_BAR_MANAGED,...TITLE_BAR_MANAGED] as const;
type ThemeColors=Record<string,unknown>;
export type ColorTarget="statusBar"|"titleBar";

export async function applyWorkspaceTheme(
  context:vscode.ExtensionContext,
  color:string,
  foreground:string,
  target:ColorTarget
):Promise<void>{
  const config=vscode.workspace.getConfiguration();
  const existing=config.get<ThemeColors>("workbench.colorCustomizations",{});
  if(context.workspaceState.get<ThemeColors|null>(KEY,null)===null){
    const snapshot:ThemeColors={};
    for(const key of ALL_MANAGED) if(Object.prototype.hasOwnProperty.call(existing,key)) snapshot[key]=existing[key];
    await context.workspaceState.update(KEY,snapshot);
  }
  const snapshot=context.workspaceState.get<ThemeColors>(KEY,{});
  const next={...existing};

  if (target === "statusBar") {
    next["statusBar.background"]=color;
    next["statusBar.foreground"]=foreground;
    next["statusBarItem.hoverBackground"]=color;
    next["statusBar.debuggingBackground"]=color;
    next["statusBar.debuggingForeground"]=foreground;
    restoreKeys(next,snapshot,TITLE_BAR_MANAGED);
  } else {
    next["titleBar.activeBackground"]=color;
    next["titleBar.activeForeground"]=foreground;
    next["titleBar.inactiveBackground"]=color;
    next["titleBar.inactiveForeground"]=foreground;
    restoreKeys(next,snapshot,STATUS_BAR_MANAGED);
  }

  await config.update("workbench.colorCustomizations",next,vscode.ConfigurationTarget.Workspace);
}

function restoreKeys(next: ThemeColors, snapshot: ThemeColors, keys: readonly string[]): void {
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(snapshot, key)) {
      next[key] = snapshot[key];
    } else {
      delete next[key];
    }
  }
}