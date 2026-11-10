import * as vscode from "vscode";

const KEY="footprint.themeSnapshot";
const LAST_APPLIED_KEY="footprint.themeLastApplied";
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
  const lastApplied=context.workspaceState.get<ThemeColors>(LAST_APPLIED_KEY,{});
  const next={...existing};

  if (Object.keys(lastApplied).length === 0) {
    clearLegacyFootprintColors(next,target,color,foreground);
  }

  // Remove any previous Footprint-managed values before applying the new target.
  restoreLastApplied(next,snapshot,lastApplied);

  const appliedNow:ThemeColors={};

  if (target === "statusBar") {
    clearManagedKeys(next,TITLE_BAR_MANAGED);
    next["statusBar.background"]=color;
    next["statusBar.foreground"]=foreground;
    next["statusBarItem.hoverBackground"]=color;
    next["statusBar.debuggingBackground"]=color;
    next["statusBar.debuggingForeground"]=foreground;
    appliedNow["statusBar.background"]=color;
    appliedNow["statusBar.foreground"]=foreground;
    appliedNow["statusBarItem.hoverBackground"]=color;
    appliedNow["statusBar.debuggingBackground"]=color;
    appliedNow["statusBar.debuggingForeground"]=foreground;
  } else {
    clearManagedKeys(next,STATUS_BAR_MANAGED);
    next["titleBar.activeBackground"]=color;
    next["titleBar.activeForeground"]=foreground;
    next["titleBar.inactiveBackground"]=color;
    next["titleBar.inactiveForeground"]=foreground;
    appliedNow["titleBar.activeBackground"]=color;
    appliedNow["titleBar.activeForeground"]=foreground;
    appliedNow["titleBar.inactiveBackground"]=color;
    appliedNow["titleBar.inactiveForeground"]=foreground;
  }

  await config.update("workbench.colorCustomizations",next,vscode.ConfigurationTarget.Workspace);
  await context.workspaceState.update(LAST_APPLIED_KEY,appliedNow);
}

function clearLegacyFootprintColors(
  next: ThemeColors,
  target: ColorTarget,
  color: string,
  foreground: string
): void {
  if (target === "titleBar") {
    const matchesStatusBar =
      next["statusBar.background"] === color &&
      next["statusBar.foreground"] === foreground &&
      next["statusBarItem.hoverBackground"] === color &&
      next["statusBar.debuggingBackground"] === color &&
      next["statusBar.debuggingForeground"] === foreground;
    if (matchesStatusBar) {
      for (const key of STATUS_BAR_MANAGED) {
        delete next[key];
      }
    }
    return;
  }

  const matchesTitleBar =
    next["titleBar.activeBackground"] === color &&
    next["titleBar.activeForeground"] === foreground &&
    next["titleBar.inactiveBackground"] === color &&
    next["titleBar.inactiveForeground"] === foreground;
  if (matchesTitleBar) {
    for (const key of TITLE_BAR_MANAGED) {
      delete next[key];
    }
  }
}

function restoreLastApplied(next: ThemeColors, snapshot: ThemeColors, lastApplied: ThemeColors): void {
  for (const key of ALL_MANAGED) {
    if (!Object.prototype.hasOwnProperty.call(lastApplied, key)) {
      continue;
    }
    if (next[key] !== lastApplied[key]) {
      // User changed this value since Footprint set it; leave it untouched.
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(snapshot, key)) {
      next[key] = snapshot[key];
    } else {
      delete next[key];
    }
  }
}

function clearManagedKeys(next: ThemeColors, keys: readonly string[]): void {
  for (const key of keys) {
    delete next[key];
  }
}