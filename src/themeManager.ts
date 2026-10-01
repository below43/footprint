import * as vscode from "vscode";

const KEY="footprint.statusBarThemeSnapshot";
const MANAGED=["statusBar.background","statusBar.foreground","statusBarItem.hoverBackground","statusBar.debuggingBackground","statusBar.debuggingForeground"] as const;
type ThemeColors=Record<string,unknown>;

export async function applyStatusBarTheme(context:vscode.ExtensionContext,color:string,foreground:string):Promise<void>{
  const config=vscode.workspace.getConfiguration();
  const existing=config.get<ThemeColors>("workbench.colorCustomizations",{});
  if(context.workspaceState.get<ThemeColors|null>(KEY,null)===null){
    const snapshot:ThemeColors={};
    for(const key of MANAGED) if(Object.prototype.hasOwnProperty.call(existing,key)) snapshot[key]=existing[key];
    await context.workspaceState.update(KEY,snapshot);
  }
  const next={...existing};
  next["statusBar.background"]=color;
  next["statusBar.foreground"]=foreground;
  next["statusBarItem.hoverBackground"]=color;
  next["statusBar.debuggingBackground"]=color;
  next["statusBar.debuggingForeground"]=foreground;
  await config.update("workbench.colorCustomizations",next,vscode.ConfigurationTarget.Workspace);
}